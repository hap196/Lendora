const { TransferTransaction } = require("@hashgraph/sdk");
const { client, operatorId, operatorKey } = require("./config");

async function transferLoanNFT(tokenId, receiverId) {
  const transferTx = await new TransferTransaction()
    .addNftTransfer(tokenId, 1, operatorId, receiverId)
    .freezeWith(client)
    .sign(operatorKey);

  const transferSubmit = await transferTx.execute(client);
  const transferRx = await transferSubmit.getReceipt(client);

  console.log(`Loan NFT transferred: ${transferRx.status}`);
}

module.exports = { transferLoanNFT };
