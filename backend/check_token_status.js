const {
  Client,
  TokenInfoQuery,
  TokenId,
  PrivateKey,
  AccountId,
} = require("@hashgraph/sdk");
require("dotenv").config();

const OPERATOR_ID = AccountId.fromString(process.env.OPERATOR_ID);
const OPERATOR_KEY = PrivateKey.fromString(process.env.OPERATOR_KEY);

const client = Client.forTestnet().setOperator(OPERATOR_ID, OPERATOR_KEY);

async function checkTokenStatus(tokenId) {
  try {
    console.log(`🔍 Checking token status for: ${tokenId}`);

    const query = new TokenInfoQuery().setTokenId(TokenId.fromString(tokenId));

    const tokenInfo = await query.execute(client);

    console.log("✅ Token Info:", {
      tokenId: tokenInfo.tokenId.toString(),
      supply: tokenInfo.totalSupply.toString(),
      treasury: tokenInfo.treasury.toString(),
      adminKey: tokenInfo.adminKey ? "Yes" : "No",
      freezeStatus: tokenInfo.defaultFreezeStatus.toString(),
      kycStatus: tokenInfo.defaultKycStatus.toString(),
    });
  } catch (error) {
    console.error("❌ Error fetching token info:", error.message);
  }
}

// Replace with a real token ID you tried to mint
checkTokenStatus("0.0.5615662");
