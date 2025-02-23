// api endpoints for minting loan nfts

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

// hedera and pinata credentials
// hedera is used to create the nft token and mint the nft
// pinata is used to store the metadata and the loan document
const OPERATOR_ID = process.env.OPERATOR_ID;
const OPERATOR_KEY = PrivateKey.fromString(process.env.OPERATOR_KEY);
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;
const TREASURY_ACCOUNT_ID = process.env.TREASURY_ACCOUNT_ID;

// initialize the hedera client
const client = Client.forTestnet().setOperator(OPERATOR_ID, OPERATOR_KEY);

// upload a file to ipfs
async function uploadToIPFS(fileBuffer, fileName) {
  console.log(`Uploading ${fileName} to IPFS via Pinata...`);

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
    console.log(`Uploaded ${fileName} to IPFS: ${ipfsUrl}`);
    return ipfsUrl;
  } catch (error) {
    console.error(
      "IPFS Upload Error:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to upload to IPFS");
  }
}

// create a loan nft
async function createLoanNFT(loanAmount, documentFilePath) {
  try {
    console.log("🔹 Processing Loan NFT Creation...");

    // read loan document file that is uploaded
    const documentBuffer = fs.readFileSync(documentFilePath);

    // generate a sha-384 hash of the document
    const documentHash = crypto
      .createHash("sha384")
      .update(documentBuffer)
      .digest("hex");
    console.log("Document SHA-384 Hash:", documentHash);

    // upload the loan document to ipfs
    const documentIpfsUrl = await uploadToIPFS(
      documentBuffer,
      "loan-document.pdf"
    );

    // create metadata json object
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

    // upload the metadata to ipfs
    const metadataIpfsUrl = await uploadToIPFS(
      Buffer.from(JSON.stringify(metadata)),
      "loan-metadata.json"
    );

    // generate a new supply key for minting nfts
    const supplyKey = PrivateKey.generate();

    // create the nft token on hedera
    const nftCreateTx = new TokenCreateTransaction()
      .setTokenName("LoanNFT")
      .setTokenSymbol("LOAN")
      .setTokenType(TokenType.NonFungibleUnique)
      .setDecimals(0)
      .setInitialSupply(0)
      .setTreasuryAccountId(OPERATOR_ID)
      .setSupplyType(TokenSupplyType.Infinite)
      .setSupplyKey(supplyKey)
      // adding the admin key to the token makes the token mutable
      // need it to be mutable to update the metadata ipfs url in the token memo after shares are purchased
      .setAdminKey(OPERATOR_KEY)
      // note that we store the metadata ipfs url in the token memo
      .setTokenMemo(metadataIpfsUrl)
      .freezeWith(client);

    // sign and submit the nft creation transaction
    const nftCreateSign = await nftCreateTx.sign(OPERATOR_KEY);
    const nftCreateSubmit = await nftCreateSign.execute(client);
    const nftCreateRx = await nftCreateSubmit.getReceipt(client);

    if (!nftCreateRx.tokenId) {
      throw new Error("Token ID not found. Transaction may have failed.");
    }

    const tokenId = nftCreateRx.tokenId.toString();
    console.log(`Loan NFT Created! Token ID: ${tokenId}`);

    // mint the nft with the metadata ipfs url
    const mintTx = new TokenMintTransaction()
      .setTokenId(tokenId)
      .setMetadata([Buffer.from(metadataIpfsUrl)]) // store the metadata ipfs url in the nft
      .freezeWith(client);

    // sign and submit the mint transaction
    const mintTxSign = await mintTx.sign(supplyKey);
    const mintTxSubmit = await mintTxSign.execute(client);
    const mintRx = await mintTxSubmit.getReceipt(client);

    // check if the minting was successful
    if (!mintRx.serials || mintRx.serials.length === 0) {
      throw new Error("Minting NFT failed. No serial number found.");
    }

    const serialNumber = mintRx.serials[0];

    console.log(`Minted NFT ${tokenId} with Serial Number: ${serialNumber}`);

    return { tokenId, serialNumber, metadataIpfsUrl };
  } catch (error) {
    console.error("Error creating Loan NFT:", error);
    throw new Error("Failed to create Loan NFT.");
  }
}

module.exports = { createLoanNFT, uploadToIPFS };
