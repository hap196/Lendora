// api endpoints for loan nfts

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const axios = require("axios");
const { TokenId, TokenUpdateTransaction } = require("@hashgraph/sdk");
const { createLoanNFT, uploadToIPFS } = require("./mintNFT");

// configure file upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// mint loan nft
router.post("/create-loan", upload.single("loanDocument"), async (req, res) => {
  try {
    console.log("✅ Received NFT Minting Request");

    const loanAmount = req.body.loanAmount;
    const documentFilePath = path.join(__dirname, "uploads", req.file.filename);

    const { tokenId, serialNumber, metadataIpfsUrl } = await createLoanNFT(
      loanAmount,
      documentFilePath
    );

    res.json({ tokenId, serialNumber, metadataIpfsUrl });
  } catch (error) {
    console.error("❌ Error creating Loan NFT:", error);
    res.status(500).json({ error: error.message });
  }
});

// get all nfts
router.get("/all-nfts", async (req, res) => {
  try {
    console.log(`Fetching NFTs minted by account: ${req.operatorId}`);

    const url = `https://testnet.mirrornode.hedera.com/api/v1/accounts/${req.operatorId}/nfts`;

    const response = await axios.get(url);
    const nftList = response.data.nfts;

    if (!nftList || nftList.length === 0) {
      console.log("No NFTs found.");
      return res.json([]);
    }

    let allNfts = [];

    for (const nft of nftList) {
      const tokenUrl = `https://testnet.mirrornode.hedera.com/api/v1/tokens/${nft.token_id}`;
      const tokenResponse = await axios.get(tokenUrl);
      const tokenInfo = tokenResponse.data;

      allNfts.push({
        tokenId: nft.token_id,
        serialNumber: nft.serial_number,
        metadata: tokenInfo.memo,
        owner: nft.account_id,
      });
    }

    console.log("NFTs fetched successfully:", allNfts);
    res.json(allNfts);
  } catch (error) {
    console.error(
      "Error fetching NFTs:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: error.message });
  }
});

// update nft ownership
router.post("/update-nft-ownership", async (req, res) => {
  try {
    const { tokenId, serialNumber, metadata, buyerAccountId, purchaseAmount } =
      req.body;
    const currentMetadata =
      typeof metadata === "string" ? JSON.parse(metadata) : metadata;
    const purchasePercentage = Number(purchaseAmount);

    if (purchasePercentage <= 0) {
      throw new Error("Purchase percentage must be greater than 0");
    }

    const currentMarketPercentage = currentMetadata.ownership.total_percentage;

    if (purchasePercentage > currentMarketPercentage) {
      throw new Error(
        `Cannot purchase ${purchasePercentage}%. Only ${currentMarketPercentage}% available.`
      );
    }

    const existingHolder = currentMetadata.ownership.holders[0];
    existingHolder.percentage = existingHolder.percentage - purchasePercentage;

    currentMetadata.ownership.holders.push({
      account_id: buyerAccountId,
      percentage: purchasePercentage,
    });

    currentMetadata.ownership.total_percentage =
      currentMarketPercentage - purchasePercentage;

    const updatedMetadataUrl = await uploadUpdatedMetadata(currentMetadata);

    const tokenUpdateTx = new TokenUpdateTransaction()
      .setTokenId(TokenId.fromString(tokenId))
      .setTokenMemo(updatedMetadataUrl)
      .setMetadata([Buffer.from(updatedMetadataUrl)])
      .freezeWith(req.client);

    const signedTx = await tokenUpdateTx.sign(req.operatorKey);
    const tokenUpdateSubmit = await signedTx.execute(req.client);
    const tokenUpdateRx = await tokenUpdateSubmit.getReceipt(req.client);

    if (tokenUpdateRx.status.toString() !== "SUCCESS") {
      throw new Error("Failed to update NFT metadata on Hedera");
    }

    console.log("NFT ownership updated:", {
      tokenId,
      serialNumber,
      updatedMetadataUrl,
      remainingPercentage: currentMetadata.ownership.total_percentage,
      holders: currentMetadata.ownership.holders,
    });

    res.json({
      success: true,
      updatedMetadata: currentMetadata,
      metadataUrl: updatedMetadataUrl,
    });
  } catch (error) {
    console.error("Error updating NFT ownership:", error);
    res.status(500).json({ error: error.message });
  }
});

// resell nft ownership
router.post("/resell-nft", async (req, res) => {
  try {
    const {
      tokenId,
      serialNumber,
      metadata,
      sellerAccountId,
      buyerAccountId,
      resellAmount,
    } = req.body;
    const currentMetadata =
      typeof metadata === "string" ? JSON.parse(metadata) : metadata;
    const resellPercentage = Number(resellAmount);

    if (resellPercentage <= 0) {
      throw new Error("Resell percentage must be greater than 0");
    }

    // Find the seller in the holders array
    const sellerIndex = currentMetadata.ownership.holders.findIndex(
      (holder) => holder.account_id === sellerAccountId
    );

    if (sellerIndex === -1) {
      throw new Error(`Seller ${sellerAccountId} is not a holder of this NFT`);
    }

    const seller = currentMetadata.ownership.holders[sellerIndex];

    if (resellPercentage > seller.percentage) {
      throw new Error(
        `Cannot resell ${resellPercentage}%. Seller only owns ${seller.percentage}%`
      );
    }

    // update seller's percentage
    seller.percentage = seller.percentage - resellPercentage;

    // check if seller has sold all their shares
    if (seller.percentage === 0) {
      // remove seller from holders array
      currentMetadata.ownership.holders.splice(sellerIndex, 1);
    }

    // check if buyer is treasury (0.0.5518642)
    if (buyerAccountId === "0.0.5518642") {
      // when selling back to treasury, increase the total_percentage
      currentMetadata.ownership.total_percentage += resellPercentage;

      // check if buyer already exists in holders
      const buyerIndex = currentMetadata.ownership.holders.findIndex(
        (holder) => holder.account_id === buyerAccountId
      );

      if (buyerIndex !== -1) {
        // buyer already exists, update their percentage
        currentMetadata.ownership.holders[buyerIndex].percentage +=
          resellPercentage;
      } else {
        // add new buyer to holders array
        currentMetadata.ownership.holders.push({
          account_id: buyerAccountId,
          percentage: resellPercentage,
        });
      }
    } else {
      // if selling to a non-treasury account, total_percentage doesn't change
      // check if buyer already exists in holders
      const buyerIndex = currentMetadata.ownership.holders.findIndex(
        (holder) => holder.account_id === buyerAccountId
      );

      if (buyerIndex !== -1) {
        // buyer already exists, update their percentage
        currentMetadata.ownership.holders[buyerIndex].percentage +=
          resellPercentage;
      } else {
        // add new buyer to holders array
        currentMetadata.ownership.holders.push({
          account_id: buyerAccountId,
          percentage: resellPercentage,
        });
      }
    }

    const updatedMetadataUrl = await uploadUpdatedMetadata(currentMetadata);

    const tokenUpdateTx = new TokenUpdateTransaction()
      .setTokenId(TokenId.fromString(tokenId))
      .setTokenMemo(updatedMetadataUrl)
      .setMetadata([Buffer.from(updatedMetadataUrl)])
      .freezeWith(req.client);

    const signedTx = await tokenUpdateTx.sign(req.operatorKey);
    const tokenUpdateSubmit = await signedTx.execute(req.client);
    const tokenUpdateRx = await tokenUpdateSubmit.getReceipt(req.client);

    if (tokenUpdateRx.status.toString() !== "SUCCESS") {
      throw new Error("Failed to update NFT metadata on Hedera");
    }

    console.log("NFT resold successfully:", {
      tokenId,
      serialNumber,
      updatedMetadataUrl,
      sellerAccountId,
      buyerAccountId,
      resellPercentage,
      holders: currentMetadata.ownership.holders,
      totalPercentage: currentMetadata.ownership.total_percentage,
    });

    res.json({
      success: true,
      updatedMetadata: currentMetadata,
      metadataUrl: updatedMetadataUrl,
    });
  } catch (error) {
    console.error("Error reselling NFT:", error);
    res.status(500).json({ error: error.message });
  }
});

// upload updated metadata
async function uploadUpdatedMetadata(metadata) {
  try {
    console.log("Uploading updated metadata to IPFS...");
    const metadataBuffer = Buffer.from(JSON.stringify(metadata));
    const updatedMetadataUrl = await uploadToIPFS(
      metadataBuffer,
      `updated-metadata-${Date.now()}.json`
    );
    console.log("✅ Updated metadata uploaded to IPFS:", updatedMetadataUrl);
    return updatedMetadataUrl;
  } catch (error) {
    console.error("❌ Error uploading updated metadata:", error);
    throw error;
  }
}

module.exports = router;
