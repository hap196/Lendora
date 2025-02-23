const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  AccountId,
  PrivateKey,
  Client,
  AccountBalanceQuery,
  TokenNftInfoQuery,
  TokenId,
  TokenUpdateTransaction,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
} = require("@hashgraph/sdk");

const { createLoanNFT, uploadToIPFS } = require("./mintNFT"); // Import both functions

// ✅ Initialize Express App
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors());

// ✅ Directly Hardcoded Credentials (No .env needed)
const OPERATOR_ID = AccountId.fromString("0.0.5523363");
const OPERATOR_KEY = PrivateKey.fromString(
  "3030020100300706052b8104000a04220420bccc5151af7f0c4a79d46364787a08a08506bbf1759cd5b7af8ac70ea05468e1"
);
const TREASURY_ACCOUNT_ID = AccountId.fromString("0.0.5523363");

// ✅ Initialize Hedera Client
const client = Client.forTestnet().setOperator(OPERATOR_ID, OPERATOR_KEY);

// ✅ Ensure "uploads/" directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// ✅ Configure File Upload Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

/**
 * ✅ **API: Mint Loan NFT**
 * Uploads loan document, creates NFT, and stores metadata on IPFS
 */
app.post("/create-loan", upload.single("loanDocument"), async (req, res) => {
  try {
    console.log("✅ Received NFT Minting Request");

    const loanAmount = req.body.loanAmount;
    const documentFilePath = path.join(__dirname, "uploads", req.file.filename);

    // 🔹 Mint NFT using the function from mintNFT.js
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

/**
 * ✅ **API: Get All NFTs Owned by the Treasury Account**
 * Fetches all NFTs created through this platform
 */
const axios = require("axios");

app.get("/all-nfts", async (req, res) => {
  try {
    console.log(`🔍 Fetching NFTs minted by account: ${OPERATOR_ID}`);

    const url = `https://testnet.mirrornode.hedera.com/api/v1/accounts/${OPERATOR_ID}/nfts`;

    const response = await axios.get(url);
    const nftList = response.data.nfts;

    if (!nftList || nftList.length === 0) {
      console.log("❌ No NFTs found.");
      return res.json([]);
    }

    let allNfts = [];

    for (const nft of nftList) {
      // Get token info to get memo field
      const tokenUrl = `https://testnet.mirrornode.hedera.com/api/v1/tokens/${nft.token_id}`;
      const tokenResponse = await axios.get(tokenUrl);
      const tokenInfo = tokenResponse.data;

      allNfts.push({
        tokenId: nft.token_id,
        serialNumber: nft.serial_number,
        metadata: tokenInfo.memo, // Use the memo field which contains our IPFS URL
        owner: nft.account_id,
      });
    }

    console.log("✅ NFTs fetched successfully:", allNfts);
    res.json(allNfts);
  } catch (error) {
    console.error(
      "❌ Error fetching NFTs:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: error.message });
  }
});

// Add this function after your existing imports
async function uploadUpdatedMetadata(metadata) {
  try {
    console.log("📂 Uploading updated metadata to IPFS...");
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

/**
 * ✅ **API: Update NFT Ownership**
 * Updates the ownership of an NFT
 */
app.post("/update-nft-ownership", async (req, res) => {
  try {
    const { tokenId, serialNumber, metadata, buyerAccountId, purchaseAmount } =
      req.body;

    // Parse existing metadata if it's a string
    const currentMetadata =
      typeof metadata === "string" ? JSON.parse(metadata) : metadata;

    // Calculate new ownership percentage based on purchase amount
    const purchasePercentage = Number(purchaseAmount);

    // Validate purchase percentage
    if (purchasePercentage <= 0) {
      throw new Error("Purchase percentage must be greater than 0");
    }

    // Calculate remaining percentage on the market
    const currentMarketPercentage = currentMetadata.ownership.total_percentage;

    // Check if purchase amount exceeds available percentage
    if (purchasePercentage > currentMarketPercentage) {
      throw new Error(
        `Cannot purchase ${purchasePercentage}%. Only ${currentMarketPercentage}% available.`
      );
    }

    // Update existing holder's percentage
    const existingHolder = currentMetadata.ownership.holders[0];
    existingHolder.percentage = existingHolder.percentage - purchasePercentage;

    // Add new holder
    currentMetadata.ownership.holders.push({
      account_id: buyerAccountId,
      percentage: purchasePercentage,
    });

    // Update total percentage available on the market
    currentMetadata.ownership.total_percentage =
      currentMarketPercentage - purchasePercentage;

    // Upload updated metadata to IPFS
    const updatedMetadataUrl = await uploadUpdatedMetadata(currentMetadata);

    // Update NFT metadata on Hedera
    const tokenUpdateTx = new TokenUpdateTransaction()
      .setTokenId(TokenId.fromString(tokenId))
      .setMetadata([Buffer.from(updatedMetadataUrl)])
      .freezeWith(client);

    // Sign with operator key (admin key)
    const signedTx = await tokenUpdateTx.sign(OPERATOR_KEY);
    const tokenUpdateSubmit = await signedTx.execute(client);
    const tokenUpdateRx = await tokenUpdateSubmit.getReceipt(client);

    if (tokenUpdateRx.status.toString() !== "SUCCESS") {
      throw new Error("Failed to update NFT metadata on Hedera");
    }

    console.log("✅ NFT ownership updated:", {
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
    console.error("❌ Error updating NFT ownership:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Start backend on port 3001
const PORT = 3001;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
