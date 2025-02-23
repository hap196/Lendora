const {
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  PrivateKey,
  TokenMintTransaction,
  TokenAssociateTransaction,
  TransferTransaction,
  Client,
} = require("@hashgraph/sdk");
const crypto = require("crypto");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

// ✅ Hedera Credentials
const OPERATOR_ID = process.env.OPERATOR_ID;
const OPERATOR_KEY = PrivateKey.fromString(process.env.OPERATOR_KEY);

// ✅ Pinata Credentials
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;
const TREASURY_ACCOUNT_ID = process.env.TREASURY_ACCOUNT_ID;

// ✅ Initialize Hedera Client
const client = Client.forTestnet().setOperator(OPERATOR_ID, OPERATOR_KEY);

// ✅ Upload File to IPFS
async function uploadToIPFS(fileBuffer, fileName) {
  console.log(`📂 Uploading ${fileName} to IPFS via Pinata...`);

  const formData = new FormData();
  formData.append("file", fileBuffer, fileName);

  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );

    const ipfsUrl = `https://ipfs.io/ipfs/${response.data.IpfsHash}`;
    console.log(`✅ Uploaded ${fileName} to IPFS: ${ipfsUrl}`);
    return ipfsUrl;
  } catch (error) {
    console.error(
      "❌ IPFS Upload Error:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to upload to IPFS");
  }
}

// ✅ Ensure Treasury Account is Associated Before Minting
async function associateTreasuryWithToken(tokenId) {
  console.log(
    `🔹 Associating Treasury Account ${TREASURY_ACCOUNT_ID} with Token ${tokenId}...`
  );

  const associateTx = new TokenAssociateTransaction()
    .setAccountId(TREASURY_ACCOUNT_ID)
    .setTokenIds([tokenId])
    .freezeWith(client);

  await associateTx.sign(OPERATOR_KEY);
  await associateTx.execute(client);
  console.log(
    `✅ Treasury Account ${TREASURY_ACCOUNT_ID} Associated with Token ID ${tokenId}`
  );
}

async function createLoanNFT(loanAmount, documentFilePath) {
  try {
    console.log("🔹 Processing Loan NFT Creation...");

    // ✅ Read Loan Document File
    const documentBuffer = fs.readFileSync(documentFilePath);

    // ✅ Generate SHA-384 Hash of the Document
    const documentHash = crypto
      .createHash("sha384")
      .update(documentBuffer)
      .digest("hex");
    console.log("✅ Document SHA-384 Hash:", documentHash);

    // ✅ Upload Loan Document to IPFS
    const documentIpfsUrl = await uploadToIPFS(
      documentBuffer,
      "loan-document.pdf"
    );

    // ✅ Create Metadata JSON
    const metadata = {
      name: `Loan NFT - ${Date.now()}`,
      creator: "Lendora System",
      creatorDID: `did:hedera:testnet:fid=${OPERATOR_ID}`,
      description: `${loanAmount}`,
      image: "https://myserver.com/loan-nft-preview.png",
      checksum: documentHash,
      type: "application/pdf",
      format: "HIP412@2.0.0",
      properties: {
        external_url: `https://lendora.com/loan`,
      },
      files: [
        {
          uri: documentIpfsUrl,
          checksum: documentHash,
          is_default_file: true,
          type: "application/pdf",
        },
      ],
      ownership: {
        total_percentage: 100,
        holders: [
          {
            account_id: TREASURY_ACCOUNT_ID,
            percentage: 100,
          },
        ],
      },
    };

    // ✅ Upload Metadata to IPFS
    const metadataIpfsUrl = await uploadToIPFS(
      Buffer.from(JSON.stringify(metadata)),
      "loan-metadata.json"
    );

    // ✅ Generate a new supply key for minting NFTs
    const supplyKey = PrivateKey.generate();

    // ✅ Step 1: Create NFT Token on Hedera
    const nftCreateTx = new TokenCreateTransaction()
      .setTokenName("LoanNFT")
      .setTokenSymbol("LOAN")
      .setTokenType(TokenType.NonFungibleUnique)
      .setDecimals(0)
      .setInitialSupply(0)
      .setTreasuryAccountId(OPERATOR_ID)
      .setSupplyType(TokenSupplyType.Infinite)
      .setSupplyKey(supplyKey)
      .setAdminKey(OPERATOR_KEY)
      .setTokenMemo(metadataIpfsUrl)
      .freezeWith(client);

    // ✅ Sign and submit NFT creation transaction
    const nftCreateSign = await nftCreateTx.sign(OPERATOR_KEY);
    const nftCreateSubmit = await nftCreateSign.execute(client);
    const nftCreateRx = await nftCreateSubmit.getReceipt(client);

    if (!nftCreateRx.tokenId) {
      throw new Error("Token ID not found. Transaction may have failed.");
    }

    const tokenId = nftCreateRx.tokenId.toString();
    console.log(`✅ Loan NFT Created! Token ID: ${tokenId}`);

    // ✅ Step 2: Mint NFT with Metadata
    const mintTx = new TokenMintTransaction()
      .setTokenId(tokenId)
      .setMetadata([Buffer.from(metadataIpfsUrl)]) // ✅ Store Metadata Hash in NFT
      .freezeWith(client);

    // ✅ Sign and submit the mint transaction
    const mintTxSign = await mintTx.sign(supplyKey);
    const mintTxSubmit = await mintTxSign.execute(client);
    const mintRx = await mintTxSubmit.getReceipt(client);

    if (!mintRx.serials || mintRx.serials.length === 0) {
      throw new Error("Minting NFT failed. No serial number found.");
    }

    const serialNumber = mintRx.serials[0];

    console.log(`✅ Minted NFT ${tokenId} with Serial Number: ${serialNumber}`);

    return { tokenId, serialNumber, metadataIpfsUrl };
  } catch (error) {
    console.error("❌ Error creating Loan NFT:", error);
    throw new Error("Failed to create Loan NFT.");
  }
}

module.exports = { createLoanNFT, uploadToIPFS };
