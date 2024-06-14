export type FilterTime = {
  time: 'week' | 'month' | 'year' | undefined | null,
  from: string | undefined | null,
  to: string | undefined | null
}