import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from "plaid";

const plaidClientId = process.env.PLAID_CLIENT_ID;
const plaidSecret = process.env.PLAID_SECRET;
const plaidEnv = process.env.PLAID_ENV ?? "sandbox";

if (!plaidClientId || !plaidSecret) {
  throw new Error("Missing PLAID_CLIENT_ID or PLAID_SECRET");
}

const environment = PlaidEnvironments[plaidEnv as keyof typeof PlaidEnvironments];

if (!environment) {
  throw new Error("Invalid PLAID_ENV. Use sandbox, development, or production.");
}

const configuration = new Configuration({
  basePath: environment,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": plaidClientId,
      "PLAID-SECRET": plaidSecret,
    },
  },
});

const parseCountries = () => {
  const raw = process.env.PLAID_COUNTRY_CODES ?? "CA";
  return raw
    .split(",")
    .map((code) => code.trim().toUpperCase())
    .filter(Boolean) as CountryCode[];
};

const parseProducts = () => {
  const raw = process.env.PLAID_PRODUCTS ?? "transactions,auth";
  return raw
    .split(",")
    .map((product) => product.trim().toLowerCase())
    .filter(Boolean) as Products[];
};

export const plaidClient = new PlaidApi(configuration);
export const plaidCountryCodes = parseCountries();
export const plaidProducts = parseProducts();
