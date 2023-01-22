export const translateToRange = ({ num, original, scaled }: {
  num: number
  original: { min: number; max: number }
  scaled: { min: number; max: number }
}): number => {
  return ((scaled.max - scaled.min) * (num - original.min)) / (original.max - original.min) + scaled.min
}