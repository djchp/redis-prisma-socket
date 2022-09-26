const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Redis = require('ioredis')
const redisClient = new Redis("redis://red-ccoqojien0hrldb24ksg:6379")

module.exports = {redisClient, prisma} ;
