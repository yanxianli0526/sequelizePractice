import jwt from "jsonwebtoken";
import authConfig from "../config/auth.config.js";
import { db } from "../models/index.js";

const User = db.user;
// Authorization
const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }
  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const checkoutRole = async (userId, roleString) => {
  const user = await User.findByPk(userId);
  const roles = await user.getRoles();

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === roleString) {
      return true;
    }
  }
  return false;
};

const isCustomer = async (req, res, next) => {
  try {
    const haveAuthRole = await checkoutRole(req.userId, "customer");
    if (haveAuthRole) {
      next();
    } else {
      return res.status(403).send({
        message: "Require customer or Admin Role!",
      });
    }
  } catch (err) {
    return next(err);
  }
};

const isManager = async (req, res, next) => {
  try {
    const haveAuthRole = await checkoutRole(req.userId, "manager");
    if (haveAuthRole) {
      next();
    } else {
      return res.status(403).send({
        message: "Require customer or Admin Role!",
      });
    }
  } catch (err) {
    return next(err);
  }
};

// 開起來放著 有一天會用到的
const isAdmin = async (req, res, next) => {
  try {
    const haveAuthRole = await checkoutRole(req.userId, "admin");
    if (haveAuthRole) {
      next();
    } else {
      return res.status(403).send({
        message: "Require customer or Admin Role!",
      });
    }
  } catch (err) {
    return next(err);
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isManager,
  isCustomer,
};

export default authJwt;
