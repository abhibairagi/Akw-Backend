const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const app = express();
const cors = require("cors");
const { createServer } = require('node:http');
const { Server } = require('socket.io');
// const server = createServer(app);
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

app.use(
  cors({
    origin: "*",
  })
);
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

io.on("connection", (socket) => {
  console.log("User Conneted");

  socket.on("message", (message) => {
    io.emit("receive-message" , message)
  })

})

dotenv.config();

app.use(express.json());

const userRoutes = require("./Routes/userRoutes");
const groupRoutes = require("./Routes/groupRoutes");
const messageRoutes = require("./Routes/messageRoutes");



const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("Server is Connected to Database");
  } catch (err) {
    console.log("Server is NOT connected to Database", err.message);
  }
};
connectDb();

app.get("/", (req, res) => {
  res.send("API is running123");
});

app.use("/user", userRoutes);
app.use("/group", groupRoutes);
app.use("/message", messageRoutes);




// Error Handling middlewares
app.use(notFound);

const PORT = process.env.PORT || 8080;
server.listen(PORT, console.log("Server is Running..."));
