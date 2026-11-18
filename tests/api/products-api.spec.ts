import { expect, test } from "../fixtures";
import { ApiClient } from "./ApiClient";
import {
  blueTop,
  brandPolo,
  okResponseCode,
  unsupportedMethodMessage,
  unsupportedMethodResponseCode,
} from "../data/testData";

test.describe("Products API", () => {
  test(
    "GET productsList contains Blue Top with its price",
    { tag: ["@Smoke", "@Regression"] },
    async ({ request }) => {
      const api = new ApiClient(request);
      const { responseCode, products } = await api.getProductsList();

      expect(responseCode).toBe(okResponseCode);
      const blueTopItem = products.find(
        (product) => product.name === blueTop.name,
      );
      expect(blueTopItem, `${blueTop.name} is in the catalogue`).toBeDefined();
      expect(blueTopItem?.price).toBe(blueTop.price);
    },
  );

  test(
    "GET brandsList includes the Polo brand",
    { tag: ["@Functional", "@Regression"] },
    async ({ request }) => {
      const api = new ApiClient(request);
      const { responseCode, brands } = await api.getBrandsList();

      expect(responseCode).toBe(okResponseCode);
      expect(brands.map((item) => item.brand)).toContain(brandPolo.name);
    },
  );

  test(
    "POST productsList is rejected as an unsupported method",
    { tag: ["@Functional", "@Negative", "@Regression"] },
    async ({ request }) => {
      const api = new ApiClient(request);
      const result = await api.postToProductsList();

      expect(result.responseCode).toBe(unsupportedMethodResponseCode);
      expect(result.message).toMatch(unsupportedMethodMessage);
    },
  );
});
