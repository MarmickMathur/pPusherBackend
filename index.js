const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// Keep-alive functionality
const keepServerActive = () => {
  fetch("https://nodemailerapi-0cfa.onrender.com/email/keep-alive", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}), // Sending an empty JSON object as body
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Server kept alive:", data);
    })
    .catch((error) => {
      console.error("Error keeping server alive:", error);
    });
};

app.post("/keep-alive", (req, res) => {
  res.status(200).send({ message: "Server is alive" });
});

// Send a POST request every 3 seconds (3000 milliseconds)
setInterval(keepServerActive, 3000);

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (req, res) => {
  res.send("bello");
});

app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/songs", require("./routes/api/songs"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
