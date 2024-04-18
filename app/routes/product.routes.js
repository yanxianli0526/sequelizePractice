import middleware from "../middleware/index.js";
const { authJwt } = middleware;
import * as controller from "../controllers/product.controller.js";

export default function (app) {
  app.get(
    "/api/products",
    [authJwt.verifyToken, authJwt.isManager],
    controller.fetchProducts
  );

  app.post(
    "/api/product",
    [authJwt.verifyToken, authJwt.isManager],
    controller.createProduct
  );

  app.put(
    "/api/product/:id",
    [authJwt.verifyToken, authJwt.isManager],
    controller.updateProduct
  );
  app.delete(
    "/api/product/:id",
    [authJwt.verifyToken, authJwt.isManager],
    controller.checkProductIsInOrder,
    controller.deleteProduct
  );
}
