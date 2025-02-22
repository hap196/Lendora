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
} = require("@hashgraph/sdk");

const { createLoanNFT } = require("./mintNFT"); // Import Loan NFT Function

// ✅ Initialize Express App
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors({ origin: "http://localhost:3000" }));

// ✅ Directly Hardcoded Credentials (No .env needed)
const OPERATOR_ID = AccountId.fromString("0.0.5520061");
const OPERATOR_KEY = PrivateKey.fromString(
  "3030020100300706052b8104000a04220420f06dd1207140e0f36fcd8addeadd279c7edfb3e4b49cd5ff3b1bafb05ee633dd"
);
const TREASURY_ACCOUNT_ID = AccountId.fromString("0.0.5520061");

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
      allNfts.push({
        tokenId: nft.token_id,
        serialNumber: nft.serial_number,
        metadata: nft.metadata
          ? Buffer.from(nft.metadata, "base64").toString()
          : "No metadata",
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

// ✅ Start backend on port 3001
const PORT = 3001;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
