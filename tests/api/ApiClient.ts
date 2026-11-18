import {
  expect,
  test,
  type APIRequestContext,
  type APIResponse,
} from "@playwright/test";

/**
 * Typed client for the public API of automationexercise.com.
 *
 * Every endpoint path lives here, so specs never contain URL strings. Each call runs in a test.step
 * so the report shows the request. Responses are checked for their shape before the specs use them.
 *
 * Note: the site answers with a JSON body and a text/html content type. Read the body as text and parse it.
 * Errors are reported in the body's `responseCode`, so the HTTP status is 200 even for a rejected method.
 */
export const endpoints = {
  productsList: "/api/productsList",
  brandsList: "/api/brandsList",
} as const;

export interface ApiProduct {
  id: number;
  name: string;
  price: string;
  brand: string;
}

export interface ApiBrand {
  id: number;
  brand: string;
}

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async getProductsList(): Promise<{
    responseCode: number;
    products: ApiProduct[];
  }> {
    return test.step(`GET ${endpoints.productsList}`, async () => {
      const body = await this.readBody(
        await this.request.get(endpoints.productsList),
      );
      expect(typeof body.responseCode).toBe("number");
      const products = body.products;
      expect(Array.isArray(products), "products is an array").toBe(true);
      for (const product of products as unknown[]) {
        expectProductShape(product);
      }
      return {
        responseCode: body.responseCode as number,
        products: products as ApiProduct[],
      };
    });
  }

  async getBrandsList(): Promise<{ responseCode: number; brands: ApiBrand[] }> {
    return test.step(`GET ${endpoints.brandsList}`, async () => {
      const body = await this.readBody(
        await this.request.get(endpoints.brandsList),
      );
      expect(typeof body.responseCode).toBe("number");
      const brands = body.brands;
      expect(Array.isArray(brands), "brands is an array").toBe(true);
      for (const brand of brands as unknown[]) {
        expect(brand).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            brand: expect.any(String),
          }),
        );
      }
      return {
        responseCode: body.responseCode as number,
        brands: brands as ApiBrand[],
      };
    });
  }

  /** Sends POST to a GET-only endpoint. The site reports the error in the body, not in the HTTP status. */
  async postToProductsList(): Promise<{
    responseCode: number;
    message: string;
  }> {
    return test.step(`POST ${endpoints.productsList}`, async () => {
      const body = await this.readBody(
        await this.request.post(endpoints.productsList),
      );
      expect(typeof body.responseCode).toBe("number");
      expect(typeof body.message).toBe("string");
      return {
        responseCode: body.responseCode as number,
        message: body.message as string,
      };
    });
  }

  private async readBody(
    response: APIResponse,
  ): Promise<Record<string, unknown>> {
    expect(response.status(), "HTTP status").toBe(200);
    const text = await response.text();
    const parsed: unknown = JSON.parse(text);
    expect(parsed, "body is a JSON object").toEqual(expect.any(Object));
    return parsed as Record<string, unknown>;
  }
}

function expectProductShape(product: unknown): void {
  expect(product).toEqual(
    expect.objectContaining({
      id: expect.any(Number),
      name: expect.any(String),
      price: expect.stringMatching(/^Rs\. \d+$/),
      brand: expect.any(String),
    }),
  );
}
