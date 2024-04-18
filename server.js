import express from "express";
import cors from "cors";
import { db } from "./app/models/index.js";
import authRoutes from "./app/routes/auth.routes.js";
import productRoutes from "./app/routes/product.routes.js";
import orderRoutes from "./app/routes/order.routes.js";

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));
app.use("/api", (req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, Content-Type, Accept"
  );
  next();
});

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const Role = db.role;

// db.sequelize.sync();
// force: true will drop the table if it already exists
db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and Resync Database with { force: true }");
  initial();
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
authRoutes(app);
productRoutes(app);
orderRoutes(app);

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    name: "customer",
  });

  Role.create({
    name: "manager",
  });
  // 有需要的話 可以開一神奇的通道給admin
  // Role.create({
  //   name: "admin",
  // });
}
