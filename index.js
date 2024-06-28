const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");



const app = express();

app.use(cors());

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("bello");
});

app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/songs", require("./routes/api/songs"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
