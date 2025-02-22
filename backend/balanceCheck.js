const { AccountBalanceQuery } = require("@hashgraph/sdk");
const { client, operatorId } = require("./config");

async function checkBalance() {
  const balance = await new AccountBalanceQuery()
    .setAccountId(operatorId)
    .execute(client);

  console.log(`Your account balance: ${balance.tokens}`);
  return balance.tokens;
}

module.exports = { checkBalance };
