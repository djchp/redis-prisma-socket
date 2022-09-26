const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const { redisClient } = require("../Config/config");

const serverSession = session({
  name: "session",
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  store: new RedisStore({ client: redisClient }),
  // store: new PrismaStore({ client: prisma }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: false,
  },
});

const wrap = (serverSession) => (socket, next) => {
  serverSession(socket.request, {}, next);
};

module.exports = { serverSession, wrap };
