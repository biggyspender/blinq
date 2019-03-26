export const entries = <
  T,
  TK extends Extract<keyof T, string>,
  TV extends T[TK],
  TEntry extends [TK, TV]
>(
  o: T
): TEntry[] => Object.entries(o) as TEntry[]
