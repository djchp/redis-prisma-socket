const {redisClient} = require("../Config/config");

const requestsLimiter = (limit, amount) => {
  return async (req, res, next) => {
    const ip = req.connection.remoteAddress || req.headers["x-forwarded-for"];
    const [response] = await redisClient.multi().incr(ip).expire(ip, limit).exec();
    console.log(response[1]);

    if (response[1] > amount)
      res.json({ isLogged: false, status: "request limit exceeded" });
    else next();
  };
};
module.exports = requestsLimiter;
