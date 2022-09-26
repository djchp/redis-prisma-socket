const { redisClient } = require("../Config/config");

const socketAuthorizer = (socket, next) => {
  if (!socket.request.session || !socket.request.session.user) {
    next(new Error("authorize"));
    console.log("bad request");
  } else {
    next();
  }
};

const storeUser = async (socket, next) => {
  socket.user = { ...socket.request.session.user };
  socket.join(socket.user.userId);

  await redisClient.hset(
    `userId:${socket.user.username}`,
    "userId",
    socket.user.userId,
    "connected",
    true
  );

  const chatterList = await redisClient.lrange(
    `chatters:${socket.user.username}`,
    0,
    -1
  );
  // console.log(chatterList);
  const moduledList = await moduleChatterList(chatterList);

  const whereToEmit = moduledList.map((chatter) => chatter.userId);

  // if (whereToEmit.length > 0)
  socket.to(whereToEmit).emit("connected", true, socket.user.username);

  socket.emit("chatters", moduledList);

  const messagesNF = await redisClient.lrange(
    `messages:${socket.user.userId}`,
    0,
    -1
  );
  console.log(messagesNF)

  const messages = messagesNF.map((message) => {
    const splitMessage = message.split(".");
    return {
      to: splitMessage[0],
      from: splitMessage[1],
      body: splitMessage[2],
    };
  });
  // console.log(messages)

  if (messages && messages.length > 0) {
    socket.emit("messages", messages);
  }
};

const add_chatter = async (socket, request, callBack) => {
  // callBack({ error:"error123", response: false})

  if (request === socket.user.username) {
    // console.log("adddddasdad");
    callBack({ error: "you wanna chat with yourself?", response: false });
    return;
  }

  const chatter = await redisClient.hgetall(`userId:${request}`);

  const chatterList = await redisClient.lrange(
    `chatters:${socket.user.username}`,
    0,
    -1
  );
  // console.log(chatter);
  // console.log(chatterList);

  if (!Object.keys(chatter).length) {
    callBack({ error: "didnt find chatter", response: false });
    console.log("run");
    return;
  }

  // console.log(Boolean(chatterList));
  // console.log(chatterList)
  // console.log(chatterList.indexOf(request) )
  // console.log(Boolean(chatterList.indexOf(request) !== -1));
  // console.log(Boolean(chatterList && chatterList.indexOf(request) !== -1));

  const list = await moduleChatterList(chatterList);
  const listToCheck = list.map((chatter) => chatter.username);
  // console.log(listToCheck)
  // console.log(Boolean((listToCheck.indexOf(request)) !== -1))

  if (chatterList && listToCheck.indexOf(request) !== -1) {
    callBack({ error: "already added", response: false });
    return;
  }
  await redisClient.lpush(
    `chatters:${socket.user.username}`,
    [request, chatter.userId].join(".")
  );

  const addedChatter = {
    username: request,
    userId: chatter.userId,
    connected: chatter.connected,
  };
  callBack({ response: true, addedChatter });
};

const moduleChatterList = async (chatterList) => {
  const newList = [];
  for (let chatter of chatterList) {
    const username = chatter.split(".");
    const onlineChatter = await redisClient.hget(
      `userId:${username[0]}`,
      "connected"
    );
    // console.log(`${onlineChatter}, asd`);
    newList.push({
      username: username[0],
      userId: username[1],
      connected: onlineChatter,
    });
  }
  return newList;
};

const privateMessage = async (socket, message) => {
  
  const messageFixed = { ...message, from: socket.user.userId };
  const messageString = [
    messageFixed.to,
    messageFixed.from,
    messageFixed.body,
  ].join(".");
  console.log(messageString)

  await redisClient.lpush(`messages:${messageFixed.to}`, messageString);
  await redisClient.lpush(`messages:${messageFixed.from}`, messageString);

  socket.to(messageFixed.to).emit("message", messageFixed);
};

const disconnect = async (socket) => {
  await redisClient.hset(`userId:${socket.user.username}`, "connected", false);
  const chatterList = await redisClient.lrange(
    `chatters:${socket.user.username}`,
    0,
    -1
  );
  // console.log(`${chatterList}`);
  const whereToEmit = await moduleChatterList(chatterList).then((list) =>
    list.map((chatter) => chatter.userId)
  );
  socket.to(whereToEmit).emit("connected", false, socket.user.username);
};

module.exports = {
  socketAuthorizer,
  storeUser,
  add_chatter,
  disconnect,
  privateMessage,
};
