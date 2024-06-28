var firebase = require("firebase");
require("firebase/auth");
require("firebase/database");
// Initialize Firebase for the application
var config = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
};

firebase.initializeApp(config);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
