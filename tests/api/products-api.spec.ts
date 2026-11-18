import { expect, test } from "../fixtures";
import { blueTop } from "../data/testData";

/** Parses the API body. The site sends JSON with a text/html content type, so the body is read as text. */
async function readJson(response: {
  text: () => Promise<string>;
}): Promise<unknown> {
  return JSON.parse(await response.text());
}

test.describe("Products API", () => {
  test(
    "GET productsList returns the product catalogue",
    { tag: ["@Smoke", "@Regression"] },
    async ({ request }) => {
      const response = await request.get("/api/productsList");
      expect(response.status()).toBe(200);

      const body = (await readJson(response)) as {
        responseCode: number;
        products: Array<Record<string, unknown>>;
      };
      expect(body.responseCode).toBe(200);
      expect(body.products.length).toBeGreaterThan(0);

      const product = body.products.find((p) => p.name === blueTop.name);
      expect(product, `${blueTop.name} is in the catalogue`).toBeDefined();
      expect(product?.price).toBe(blueTop.price);
    },
  );

  test(
    "GET brandsList includes the Polo brand",
    { tag: ["@Functional", "@Regression"] },
    async ({ request }) => {
      const response = await request.get("/api/brandsList");
      expect(response.status()).toBe(200);

      const body = (await readJson(response)) as {
        responseCode: number;
        brands: Array<{ brand: string }>;
      };
      expect(body.responseCode).toBe(200);
      expect(body.brands.map((b) => b.brand)).toContain("Polo");
    },
  );

  test(
    "POST productsList is rejected with method not supported",
    { tag: ["@Functional", "@Negative", "@Regression"] },
    async ({ request }) => {
      const response = await request.post("/api/productsList");
      expect(response.status()).toBe(200);

      const body = (await readJson(response)) as {
        responseCode: number;
        message: string;
      };
      expect(body.responseCode).toBe(405);
      expect(body.message).toMatch(/not supported/i);
    },
  );
});
