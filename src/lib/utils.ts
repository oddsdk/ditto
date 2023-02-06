export const translateToRange = ({ num, original, scaled }: {
  num: number
  original: { min: number; max: number }
  scaled: { min: number; max: number }
}): number => {
  return ((scaled.max - scaled.min) * (num - original.min)) / (original.max - original.min) + scaled.min
}

// Object.entries with type inference
export const objectEntries = <T extends object>(obj: T) => {
  return Object.entries(obj) as Entries<T>
}

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][]
