import { filterObject } from "./objectUtils";

describe("objectUtils", () => {
  test("should return new object with same keys", () => {
    const originalObject = { name: "Alice", age: 30 };
    const newObject = filterObject(originalObject, (key) => key !== "address");
    expect(newObject).toStrictEqual(originalObject);
  });

  test("should return new object with removed key", () => {
    const originalObject = { name: "Alice", age: 30 };
    const newObject = filterObject(originalObject, (key) => key !== "age");

    const expectedObject = { name: "Alice" };
    expect(newObject).toStrictEqual(expectedObject);
  });
});
