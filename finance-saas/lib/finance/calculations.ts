export type MoneyLike = number | string;

const toNumber = (value: MoneyLike) => {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error("Invalid monetary value");
  }
  return parsed;
};

export const roundCad = (value: MoneyLike) => Math.round(toNumber(value) * 100) / 100;

export const sumCad = (values: MoneyLike[]) =>
  roundCad(values.reduce((acc, value) => acc + toNumber(value), 0));

export const netBalanceCad = (income: MoneyLike[], expense: MoneyLike[]) =>
  roundCad(sumCad(income) - sumCad(expense));

export const convertCurrency = (
  amount: MoneyLike,
  exchangeRate: MoneyLike,
  decimals = 2,
) => {
  const converted = toNumber(amount) * toNumber(exchangeRate);
  const factor = 10 ** decimals;
  return Math.round(converted * factor) / factor;
};
