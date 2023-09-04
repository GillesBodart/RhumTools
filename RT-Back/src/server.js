const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const neo4j = require("neo4j-driver");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

const app = express();

app.use(morgan("tiny"));
app.use(cors({
  origin: [
    "http://rhumtools.web.app:8080",
    "https://rhumtools.web.app:8080",
    "http://rhumtools.web.app:5173",
    "https://rhumtools.web.app:5173"],
  credentials: true,
  exposedHeaders: ["set-cookie"],
}));

app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

const driverSetup = () => {
  const username = process.env.NEO4J_USER || _creds.username;
  const password = process.env.NEO4J_PASS || _creds.password;
  const uri = process.env.NEO4J_URI || _creds.uri;

  const auth = neo4j.auth.basic(username, password);
  return neo4j.driver(uri, auth);
};

let persistentDriver = null;

exports.getDriver = () => {
  if (!persistentDriver) {
    persistentDriver = driverSetup();
  }

  return persistentDriver;
};

const helloFunct = (request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
};

exports.helloWorld = onRequest(helloFunct);


