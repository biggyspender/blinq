export default function getDefaultComparer() {
  return <T>(a: T, b: T): number => (a > b ? 1 : a < b ? -1 : 0)
}
