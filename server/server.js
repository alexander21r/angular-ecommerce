const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const getStripeUrl = require("./controller");
const PORT = process.env.PORT || 4242;

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(PORT, () => console.log("Node server listening on port 4242!"));

app.post("/checkout", getStripeUrl);
