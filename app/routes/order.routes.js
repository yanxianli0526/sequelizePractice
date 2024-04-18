import middleware from "../middleware/index.js";
const { authJwt } = middleware;
import * as controller from "../controllers/order.controller.js";
import * as productController from "../controllers/product.controller.js";

export default function (app) {
  app.get("/api/order/:id", [authJwt.verifyToken], controller.findOrderByID);

  app.post(
    "/api/order",
    [authJwt.verifyToken, authJwt.isCustomer],
    productController.checkProductsStockIsEnough,
    controller.createOrder
  );
}
