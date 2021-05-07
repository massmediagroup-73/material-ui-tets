import React, { useEffect } from 'react'
import {
  createStyles, makeStyles,
} from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrders, ordersSelector, Order } from 'store/orders'

interface Row {
  orderNumber: number
  orderedDate: string
  status: string
  shippedDate: string
  customerAddress: string
  orderedValue: number
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

type SortOrder = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: SortOrder,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

interface HeadCell {
  id: keyof Row;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  {
    id: 'orderNumber', numeric: false, label: 'ORDER NUMBER & DATE',
  },
  {
    id: 'status', numeric: false, label: 'Shipping Status',
  },
  {
    id: 'shippedDate', numeric: false, label: 'CUSTOMER ADDRESS',
  },
  {
    id: 'orderedDate', numeric: true, label: 'ORDER VALUE',
  },
]

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Row) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sortOrder: SortOrder;
  sortOrderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    classes, onSelectAllClick, sortOrder, sortOrderBy, numSelected, rowCount, onRequestSort,
  } = props
  const createSortHandler = (property: keyof Row) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={sortOrderBy === headCell.id ? sortOrder : false}
          >
            <TableSortLabel
              active={sortOrderBy === headCell.id}
              direction={sortOrderBy === headCell.id ? sortOrder : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {sortOrderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {sortOrder === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="right">
          <Tooltip title="More">
            <IconButton aria-label="more">
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

const useStyles = makeStyles(() => createStyles({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  tableCellData: {
    display: 'block',
    marginTop: '5px',
    fontSize: '14px',
    lineHeight: '17px',
    letterSpacing: '0.05em',
    color: '#6E6893',
  },
  tableCellData_bold: {
    display: 'block',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '17px',
    color: '#25213B',
  },
}))

export default function EnhancedTable() {
  const dispatch = useDispatch()
  const { orders } = useSelector(ordersSelector)

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  function createRow({
    customer,
    // eslint-disable-next-line camelcase
    order_details,
    // eslint-disable-next-line camelcase
    order_number,
    // eslint-disable-next-line camelcase
    shipping_details,
    status,
  }: Order): Row {
    return {
      customerAddress: `${customer.address.line1} ${customer.address.city}, ${customer.address.state} ${customer.address.zip}`,
      orderedDate: order_details.date,
      orderedValue: order_details.value,
      orderNumber: order_number,
      shippedDate: shipping_details.date,
      status,
    }
  }

  const rows = orders.map((order: Order) => createRow(order))

  const classes = useStyles()
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('asc')
  const [sortOrderBy, setSortOrderBy] = React.useState<keyof Row>('orderNumber')
  const [selected, setSelected] = React.useState<number[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Row) => {
    const isAsc = sortOrderBy === property && sortOrder === 'asc'
    setSortOrder(isAsc ? 'desc' : 'asc')
    setSortOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.orderNumber)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, orderNumber: number) => {
    const selectedIndex = selected.indexOf(orderNumber)
    let newSelected: number[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, orderNumber)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }

    setSelected(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = (orderNumber: number) => selected.indexOf(orderNumber) !== -1

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              sortOrder={sortOrder}
              sortOrderBy={sortOrderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(sortOrder, sortOrderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.orderNumber)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row.orderNumber)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.orderNumber}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell>
                        <span className={classes.tableCellData_bold}># {row.orderNumber}</span>
                        <span className={classes.tableCellData}>Ordered: {row.orderedDate}</span>
                      </TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>{row.customerAddress}</TableCell>
                      <TableCell align="right">{row.orderedValue}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="More">
                          <IconButton aria-label="more">
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  )
}
