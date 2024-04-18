import { db } from "../models/index.js";
import { isValidUUID } from "./utils.js";
const User = db.user;
const Product = db.product;
const Order = db.order;

const Op = db.Sequelize.Op;
const sequelize = db.sequelize;

export const findOrderByID = async (req, res, next) => {
  try {
    const orderID = req.params.id;
    if (!isValidUUID(orderID)) {
      return res.status(400).send({ message: "id is not valid" });
    }
    const user = await User.findOne({
      where: {
        id: req.userId,
      },
    });
    const roles = await user.getRoles();
    const rolesType = [...new Set(roles.map((d) => d.dataValues.name))];
    let orderQuery = {
      where: {
        id: orderID,
      },
    };

    // 不是manager 就只能看到自己建立的
    if (!rolesType.includes("manager")) {
      orderQuery.where.userId = req.userId;
    }

    const order = await Order.findOne(orderQuery);

    if (!order) {
      return res.status(404).send("Order not found.");
    }

    const userId = order.getDataValue("userId");

    const productsInOrder = await order.getProducts();
    const resData = productsInOrder.map((product) => {
      return {
        name: product.name,
        price: product.price,
        stock: product.stock,
      };
    });

    const responseData = { id: order.id, resData };

    // 是manager的話 把user找出來
    if (rolesType.includes("manager")) {
      responseData.userId = userId;
    }

    res.status(200).send(responseData);
  } catch (err) {
    return next(err);
  }
};

export const createOrder = async (req, res) => {
  try {
    const productsId = [];
    const productData = {};
    req.body.forEach((d) => {
      if (!d.id || d.id === "") {
        res.status(400).send({ message: "id is not valid" });
      } else {
        productsId.push(d.id);
        const data = { stock: d.stock };
        productData[d.id] = data;
      }
    });
    await sequelize.transaction(async (t) => {
      const user = await User.findOne(
        {
          where: {
            id: req.userId,
          },
        },
        { transaction: t }
      );
      const order = await Order.create({}, { transaction: t });
      await order.setUser(user, { transaction: t });
      const products = await Product.findAll(
        {
          where: {
            id: {
              [Op.in]: productsId,
            },
          },
        },
        { transaction: t }
      );
      const promises = products.map(async (d) => {
        await Product.update(
          {
            stock: d.stock - productData[d.id].stock,
          },
          { where: { id: d.id }, transaction: t }
        );
      });

      await Promise.all(promises);
      await order.setProducts(products, { transaction: t });

      res.sendStatus(201);
    });
  } catch (err) {
    return next(err);
  }
};
