const admin = require("firebase-admin");
require("dotenv").config();

const secretsJsonString = process.env.SECRETS;
const secrets = JSON.parse(secretsJsonString);

// console.log(secrets);

// const serviceAccount = require("../firebase/ppusher-3f6ae-firebase-adminsdk-l1q1e-4a425586ae.json");

admin.initializeApp({
  credential: admin.credential.cert(secrets),
});

const verifyToken = async (req, res, next) => {
  // console.log(req.headers);
  const token = req.headers["accesstoken"]; // Assuming the token is in the 'accesstoken' header
  // console.log(token);
  if (!token) {
    return res.status(403).send("Access Token is required");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error while verifying Firebase ID token:", error);
    res.status(600).send("Invalid Access Token");
  }
};

module.exports = verifyToken;
