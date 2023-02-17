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


export function asyncDebounce<A extends unknown[], R>(
  fn: (...args: A) => Promise<R>,
  wait: number
): (...args: A) => Promise<R> {
  let lastTimeoutId: ReturnType<typeof setTimeout> | undefined = undefined

  return (...args: A): Promise<R> => {
    clearTimeout(lastTimeoutId)

    return new Promise((resolve, reject) => {
      const currentTimeoutId = setTimeout(() => {
        try {
          if (currentTimeoutId === lastTimeoutId) {
            const result = fn(...args)
            resolve(result)
          }
        } catch (err) {
          reject(err)
        }
      }, wait)

      lastTimeoutId = currentTimeoutId
    })
  }
}
