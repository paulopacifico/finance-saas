import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from "plaid";

const parsePlaidEnvironment = () => {
  const plaidEnv = process.env.PLAID_ENV ?? "sandbox";
  const environment = PlaidEnvironments[plaidEnv as keyof typeof PlaidEnvironments];

  if (!environment) {
    throw new Error("Invalid PLAID_ENV. Use sandbox, development, or production.");
  }

  return environment;
};

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

export const getPlaidClient = () => {
  const plaidClientId = process.env.PLAID_CLIENT_ID;
  const plaidSecret = process.env.PLAID_SECRET;

  if (!plaidClientId || !plaidSecret) {
    throw new Error("Missing PLAID_CLIENT_ID or PLAID_SECRET");
  }

  const configuration = new Configuration({
    basePath: parsePlaidEnvironment(),
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": plaidClientId,
        "PLAID-SECRET": plaidSecret,
      },
    },
  });

  return new PlaidApi(configuration);
};

export const plaidCountryCodes = parseCountries();
export const plaidProducts = parseProducts();
