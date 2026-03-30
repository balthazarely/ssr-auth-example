export type WeightUnit = "lbs" | "kg";

export function lbsToKg(lbs: number): number {
  return Math.round(lbs * 0.453592 * 10) / 10;
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462);
}

export function toDisplayWeight(lbs: number, unit: WeightUnit): number {
  return unit === "kg" ? lbsToKg(lbs) : lbs;
}

export function toStoredLbs(value: number, unit: WeightUnit): number {
  return unit === "kg" ? kgToLbs(value) : value;
}
