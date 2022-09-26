const Yup = require("yup");
const bcrypt = require("bcrypt");
const { prisma } = require("../Config/config");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const formSchema = Yup.object({
  username: Yup.string()
    .required("Username required")
    .min(6, "Username too short")
    .max(28, "Username too long!"),
  password: Yup.string()
    .required("Password required")
    .min(6, "Password too short")
    .max(28, "Password too long!"),
});

const auth_validate = (req, res, next) => {
  const formData = req.body;
  formSchema
    .validate(formData)
    .catch((err) => {
      res.status(422).json("good");
      console.log("done");
      console.log(err.errors);
    })
    .then((valid) => {
      if (valid) {
        console.log("form is good");
      }
    });
};

const auth_login = async (req, res, next) => {
  if (req.session.userId) {
    res.status(500)
    return;
  }

  const { username, password } = req.body;
  let user;

  try {
    user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    
    const isPasswordCorr = await bcrypt.compare(password, user.password);
    if (!isPasswordCorr) res
    
    req.session.user ={
      username: req.body.username,
      id: user.id,
      userId: user.userId
    }
    // console.log(req.session.user)
    res.status(200)
  } catch (error) {
    if (!user) {
      res.status(401)
    }
  }
};

const auth_register = async (req, res, next) => {
  const { username, password } = req.body;

  let usernameCheck;

  try {
    usernameCheck = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  } catch {
    res
      .status(400)
      
  }
  if (usernameCheck)
    res
      .status(500)
      
  else {
    const saltRound = 10;
    let salted_pw = await bcrypt.hash(password, saltRound);

    try {
      await prisma.user.create({
        data: {
          username: username,
          password: salted_pw,
          userId: uuidv4(),
        },
      });
    } catch {
      res.status(500)
      return;
    }
  }
};

const auth_user = async (req, res) => {
  
  if (req.session.user) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: req.session.user.username
        },
      });
      // console.log(user)
      if (!user) res.status(401).json("User Not Found");
      const data = {
        username: user.username,
        isLogged: true
      };
      res.status(200).json(data);
    } catch {
      res.status(500).json("Something Went Wrong {auth}");
    }
  } else {
    res.status(401)
  }
};

module.exports = { auth_validate, auth_register, auth_login, auth_user };
