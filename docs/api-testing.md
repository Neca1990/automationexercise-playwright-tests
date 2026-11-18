# API Testing

## Structure

- `tests/api/ApiClient.ts`: the only place that knows endpoint paths and response shapes. Specs call its methods.
- `tests/api/*.spec.ts`: API tests. They use the `request` fixture and never the browser.
- `tests/data/testData.ts`: expected values (product, brand, error codes) shared with UI tests.

## Rules

1. Endpoint paths are constants in `ApiClient`. A spec never contains a URL string.
2. Each client method runs in `test.step` with the method and path in its name.
3. Check the HTTP status and the body's `responseCode`. A 200 status with an error `responseCode` is a failure for the feature, not a pass.
4. Check the shape of each record (types, not only that a field exists) before using it.
5. Read the body as text and parse it. The site sends JSON with a text/html content type.
6. Do not hard-code expected values in specs. Put them in `tests/data/`.
7. API tests do not depend on the UI, and they run when the UI is down (`npm run test:api`).
8. Document any site quirk next to the code that handles it, with what the quirk is and when it was seen.

## Known site behavior

- POST to `/api/productsList` returns HTTP 200 with `responseCode: 405` and a "not supported" message.
