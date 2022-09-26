const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Redis = require('ioredis')
const redisClient = new Redis()

module.exports = {redisClient, prisma} ;
