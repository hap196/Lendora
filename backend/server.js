const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { AccountId, PrivateKey, Client } = require("@hashgraph/sdk");
require("dotenv").config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors());

// initialize hedera client and credentials
const OPERATOR_ID = AccountId.fromString(process.env.OPERATOR_ID);
const OPERATOR_KEY = PrivateKey.fromString(process.env.OPERATOR_KEY);
const client = Client.forTestnet().setOperator(OPERATOR_ID, OPERATOR_KEY);

// check if uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// middleware to inject hedera client and credentials
app.use((req, res, next) => {
  req.client = client;
  req.operatorId = OPERATOR_ID;
  req.operatorKey = OPERATOR_KEY;
  next();
});

// import and use api routes
const apiRoutes = require("./api");
app.use("/", apiRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
