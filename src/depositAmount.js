export function parseDepositAmount(value) {
  if (typeof value !== 'string' || !value.trim()) return NaN;
  const normalized = value.replace(/\s/g, '');
  return /^\d+$/.test(normalized) ? Number(normalized) : NaN;
}

export function isValidDepositAmount(value) {
  return Number.isInteger(value) && value >= 3000 && value <= 1000000;
}
