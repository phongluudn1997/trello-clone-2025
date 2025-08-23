import { insertItemAtIndex, moveItem, removeItemAtIndex } from "./arrayUtils";

describe("arrayUtils", () => {
  describe("insertItemAtIndex", () => {
    test("should throw error if insert to negative index", () => {
      const originalArray = [];
      const item = "A";
      expect(() => insertItemAtIndex(originalArray, item, -1)).toThrow();
    });

    test("should throw error if insert to larger index than array length", () => {
      const originalArray = [];
      const item = "A";
      expect(() => insertItemAtIndex(originalArray, item, 1)).toThrow();
    });

    test("should insert item to empty array", () => {
      const originalArray = [];
      const item = "A";

      const newArray = insertItemAtIndex(originalArray, item, 0);

      expect(newArray).toEqual([item]);
    });

    test("should insert item before another item", () => {
      const originalArray = ["B"];
      const item = "A";

      const newArray = insertItemAtIndex(originalArray, item, 0);

      expect(newArray).toEqual([item, ...originalArray]);
    });

    test("should insert item after another item", () => {
      const originalArray = ["B"];
      const item = "A";

      const newArray = insertItemAtIndex(originalArray, item, 1);

      expect(newArray).toEqual([...originalArray, item]);
    });
  });

  describe("removeItemAtIndex", () => {
    test("should throw error if index is negative", () => {
      const originalArray = ["A", "B", "C"];
      expect(() => removeItemAtIndex(originalArray, -1)).toThrow();
    });

    test("should throw error if index is larger than array length", () => {
      const originalArray = ["A", "B", "C"];
      expect(() =>
        removeItemAtIndex(originalArray, originalArray.length + 1),
      ).toThrow();
    });

    test("should remove item at the beginning", () => {
      const originalArray = ["A", "B", "C"];
      const newArray = removeItemAtIndex(originalArray, 0);
      expect(newArray).toEqual(["B", "C"]);
    });

    test("should remove item at the end", () => {
      const originalArray = ["A", "B", "C"];
      const newArray = removeItemAtIndex(originalArray, 2);
      expect(newArray).toEqual(["A", "B"]);
    });

    test("should remove item in the middle", () => {
      const originalArray = ["A", "B", "C"];
      const newArray = removeItemAtIndex(originalArray, 1);
      expect(newArray).toEqual(["A", "C"]);
    });
  });

  describe("moveItem", () => {
    test("should move item to correct position", () => {
      const originalArray = ["A", "B", "C"];
      const newArray = moveItem(originalArray, 0, 1);
      expect(newArray).toEqual(["B", "A", "C"]);
    });

    test("should not change order if from index same with to index", () => {
      const originalArray = ["A", "B", "C"];
      const newArray = moveItem(originalArray, 0, 0);
      expect(newArray).toEqual(originalArray);
    });

    test("should throw error if from index is negative", () => {
      const originalArray = ["A", "B", "C"];
      expect(() => moveItem(originalArray, -1, 0)).toThrow();
    });

    test("should throw error if to index is negative", () => {
      const originalArray = ["A", "B", "C"];
      expect(() => moveItem(originalArray, -1, 0)).toThrow();
    });

    test("should throw error if to index is larger than array length", () => {
      const originalArray = ["A", "B", "C"];
      expect(() => moveItem(originalArray, -1, 0)).toThrow();
    });
  });
});
