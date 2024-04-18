import jest from "jest-mock";
import { connectDB, closeDBConnection } from "./test-helper";
import { createProduct } from "../../controllers/product.controller.js";

let db;

beforeAll(async () => {
  db = await connectDB();
});

afterAll(async () => {
  await closeDBConnection(db);
});

// 一個簡單的新增測試
describe("createProduct", () => {
  it("should create a new product", async () => {
    const req = {
      body: {
        name: "Test Product",
        price: 10.99,
        stock: 100,
      },
    };
    const res = {
      sendStatus: jest.fn().mockReturnThis(),
    };

    await createProduct(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(201);
  });

  it("should return an error if product creation fails", async () => {
    const req = {
      body: {
        name: "Test Product",
        stock: 100,
      },
    };
    const next = jest.fn();

    const res = {
      status: jest.fn().mockReturnThis(),
    };

    await createProduct(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
