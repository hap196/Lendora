const {
  TokenAssociateTransaction,
  AccountId,
  PrivateKey,
} = require("@hashgraph/sdk");
const { client } = require("./config");

async function associateToken(accountIdStr, privateKeyStr, tokenId) {
  const accountId = AccountId.fromString(accountIdStr);
  const privateKey = PrivateKey.fromStringDer(privateKeyStr);

  const associateTx = await new TokenAssociateTransaction()
    .setAccountId(accountId)
    .setTokenIds([tokenId])
    .freezeWith(client)
    .sign(privateKey);

  const associateSubmit = await associateTx.execute(client);
  const associateRx = await associateSubmit.getReceipt(client);
  console.log(`Token association for ${accountId}: ${associateRx.status}`);
}

module.exports = { associateToken };
