/**
 * Test data for specs. Specs import from here instead of hard-coding values.
 * Only public, non-personal values are stored here. Generated values come from helper functions.
 */

export interface ProductDetails {
  name: string;
  price: string;
}

/** A product that exists on automationexercise.com and is returned by searching "Blue Top". */
export const blueTop: ProductDetails = {
  name: "Blue Top",
  price: "Rs. 500",
};

export const searchTerms = {
  blueTop: "Blue Top",
};

/** Password that is never valid for any account. */
export const invalidPassword = "WrongPassword123";

/** Unique address that cannot belong to a real account. Uses the reserved .test domain. */
export function unknownEmail(): string {
  return `unknown_${Date.now()}_${Math.floor(Math.random() * 1e6)}@example.test`;
}

/** Brand listed in the left sidebar; its page lists Blue Top. */
export const brandPolo = { name: "Polo", path: "/brand_products/Polo" };

/** Product detail page id for Blue Top. */
export const blueTopDetailPath = "/product_details/1";

export const purchaseQuantity = 3;

/** Method that the products endpoint does not accept. */
export const unsupportedMethodResponseCode = 405;

/** Message the products endpoint returns for an unsupported method. */
export const unsupportedMethodMessage = /not supported/i;
