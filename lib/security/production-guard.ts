export function assertNoE2EBypassInProduction() {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const isBypassEnabled = process.env.E2E_BYPASS_AUTH === "true";
  const isMockDataEnabled = process.env.E2E_USE_MOCK_DATA === "true";

  if (isBypassEnabled || isMockDataEnabled) {
    throw new Error("E2E bypass flags are not allowed in production");
  }
}
