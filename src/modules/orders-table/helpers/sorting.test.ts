import { getComparator, stableSort, SortOrder } from './sorting'

type Row = {
  name: string
  age: number
}

test('check sorting', () => {
  const rows: Row[] = [
    {
      name: 'John',
      age: 20,
    },
    {
      name: 'Bill',
      age: 23,
    },
    {
      name: 'Bob',
      age: 30,
    },
    {
      name: 'Gary',
      age: 33,
    },
  ]

  const expected: Row[] = [
    {
      name: 'Gary',
      age: 33,
    },
    {
      name: 'Bob',
      age: 30,
    },
    {
      name: 'Bill',
      age: 23,
    },
    {
      name: 'John',
      age: 20,
    },
  ]
  const sortOrder: SortOrder = 'desc'
  const sortOrderBy: keyof Row = 'age'
  expect(stableSort(rows, getComparator(sortOrder, sortOrderBy))).toMatchObject(expected)
})
