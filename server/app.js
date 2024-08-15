const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter = require("./connectors/authRouter");
const adminRouter = require("./connectors/adminRouter");
const userRouter = require("./connectors/usersRouter");
const transactionsRouter = require("./connectors/transactionRouter");
const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://avanthik:avanthik@cluster0.yuxak7x.mongodb.net/Softronics?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Data base connection error", error);
  });

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/account", transactionsRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log("server running on", PORT);
});
