const express = require("express");
const cors = require("cors");
require("dotenv").config();
const routes = require("./routes/index.js");

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("The server is running at port no ", PORT);
});
