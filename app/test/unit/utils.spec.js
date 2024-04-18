import { isValidUUID } from "../../controllers/utils.js";

describe("isValidUUID function", () => {
  it("should return true if the provided value is a valid UUID", () => {
    const successTestCases = [
      { input: "fcf0f054-08f6-40e9-aaf7-f353f4fb1432", expected: true },
      { input: "e888df2d-dfd0-4d72-b41a-61ccb1eb9980", expected: true },
      { input: "c3ccfc76-14c2-4fa8-89b6-b373a1b04bfc", expected: true },
    ];

    successTestCases.forEach((testCase) => {
      const result = isValidUUID(testCase.input);
      expect(result).toBe(testCase.expected);
    });
  });

  it("should return false if the provided value is not a valid UUID", () => {
    const failCases = [
      { input: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", expected: false }, // 長度正確內容不合法(全部都是a)
      { input: "e888df2d-dfd0-4d72-b41a-61ccb1eb99800", expected: false }, // 長度多一
      { input: "c3ccfc76-14c2-4fa8-89b6-b373a1b04bf", expected: false }, // 長度少一
    ];

    failCases.forEach((testCase) => {
      const result = isValidUUID(testCase.input);
      expect(result).toBe(testCase.expected);
    });
  });
});
