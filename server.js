require("dotenv").config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.on("open", () => console.log("ConnectedToDatabase"));

app.use(express.json());

const productsRouter = require("./routes/products");
app.use("/products", productsRouter);
app.listen(3200, () => console.log("The-Tech_Shop Server Started"));
