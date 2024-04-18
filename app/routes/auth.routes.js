import middleware from "../middleware/index.js";
const { verifySignUp } = middleware;

import * as controller from "../controllers/auth.controller.js";

export default function (app) {
  // 實際上的建立user權限是不會對外開放,但因為測試起來比較方便 就不特別限制了
  app.post(
    "/api/auth/signUp",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signUp
  );

  app.post("/api/auth/signIn", controller.signIn);
}
