// swap to redis store

const express = require("express");
const session = require("express-session");
const { PrismaClient } = require("@prisma/client");
const { default: helmet } = require("helmet");
const { Server } = require("socket.io");
const app = express();
// const PrismaStore = require('./session/index')(session)
// const {prisma} = require('./Config/config')
const { redisClient } = require("./Config/config");
const server = require("http").createServer(app);
const authRoutes = require("./routes/authRoutes");
const RedisStore = require("connect-redis")(session);
const cors = require("cors");
require('dotenv').config()

const { serverSession, wrap } = require("./middlewares/serverSession");
const {
  socketAuthorizer,
  storeUser,
  add_chatter,
  disconnect,
  privateMessage
} = require("./controllers/socketConController");


const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    name: "session",
    secret: process.env.COOKIE,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({ client: redisClient }),
    // store: new PrismaStore({ client: prisma }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: "auto",
      sameSite: "lax"
    },
  })
);
app.use("/api", authRoutes);

app.set("trust proxy", 1);
// app.use(express.urlencoded({ extended: true }));



io.use(wrap(serverSession));
io.use(socketAuthorizer);
io.on("connect", (socket) => {
  storeUser(socket);

  socket.on("add_chatter", (request, callBack) => {
    add_chatter(socket, request, callBack);
  });
  socket.on("message", (message) => {
    privateMessage(socket, message)
  })

  socket.on("disconnecting", () => disconnect(socket));
});

server.listen(5000, () => {
  console.log("server running");
});
