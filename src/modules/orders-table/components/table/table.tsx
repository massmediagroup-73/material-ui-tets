import React, { useEffect } from 'react'
import { format } from 'date-fns'
import {
  makeStyles, Theme,
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
import { Chip } from '@material-ui/core'
import { getComparator, stableSort, SortOrder } from 'modules/orders-table/helpers/sorting'

interface Row {
  orderNumber: number
  orderedDate: string
  status: string
  shippedDate: string
  customerAddress: string
  orderedValue: number
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

interface OrdersTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Row) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sortOrder: SortOrder;
  sortOrderBy: string;
  rowCount: number;
}

function OrdersTableHead(props: OrdersTableProps) {
  const {
    classes, onSelectAllClick, sortOrder, sortOrderBy, numSelected, rowCount, onRequestSort,
  } = props
  const createSortHandler = (property: keyof Row) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow className={classes.tableHeadRow}>
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
            padding="none"
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={sortOrderBy === headCell.id ? sortOrder : false}
          >
            <TableSortLabel
              active={sortOrderBy === headCell.id}
              direction={sortOrderBy === headCell.id ? sortOrder : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              <span className={classes.tableHeadCell}>{headCell.label}</span>
              {sortOrderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {sortOrder === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="right" padding="none" style={{ paddingRight: '16px' }}>
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

const tableCellDataStyles = {
  display: 'block',
  marginTop: '5px',
  fontSize: '14px',
  lineHeight: '17px',
  letterSpacing: '0.05em',
}

const tableCellDataSmallStyles = {
  ...tableCellDataStyles,
  fontSize: '12px',
  lineHeight: '15px',
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
  },
  table: {
    minWidth: 750,
  },
  tableHeadRow: {
    backgroundColor: theme.palette.secondary.light,
  },
  tableRow: {
    '& td': {
      paddingTop: '13px',
      paddingBottom: '10px',
    },
  },
  tableHeadCell: {
    paddingTop: '14px',
    paddingBottom: '15px',
    fontWeight: 600,
    fontSize: '12px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: theme.palette.primary.main,
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
    ...tableCellDataStyles,
    color: theme.palette.primary.main,
  },
  tableCellDataBold: {
    ...tableCellDataStyles,
    marginTop: 0,
    fontWeight: 500,
    color: theme.palette.secondary.main,
  },
  tableCellDataSmall: {
    ...tableCellDataSmallStyles,
    color: theme.palette.primary.main,
  },
  tableCellDataBoldSmall: {
    ...tableCellDataSmallStyles,
    fontWeight: 500,
    color: theme.palette.primary.main,
  },
  tableCellDataSmallBlack: {
    ...tableCellDataSmallStyles,
    marginTop: 0,
    color: theme.palette.secondary.main,
    fontWeight: 500,
  },
  tableChipLabelWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  tableChip: {
    width: '88px',
    height: '19px',
    justifyContent: 'normal',
    backgroundColor: '#E6E6F2',
    '& span': {
      paddingLeft: 0,
    },
  },
  tableChipBullet: {
    width: '6px',
    height: '6px',
    margin: '0 5px 0 5px',
    borderRadius: '50%',
    background: '#4A4AFF',
  },
  tableChipLabel: {
    fontSize: '12px',
    lineHeight: '1',
    fontWeight: 500,
    color: '#4A4AFF',
  },
  tableFooter: {
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '15px',
    letterSpacing: '0.05em',
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.secondary.light,
    '& .MuiTablePagination-selectRoot': {
      marginRight: '39px',
    },
    '& .MuiTablePagination-caption': {
      fontWeight: 600,
      fontSize: '12px',
      lineHeight: '15px',
      letterSpacing: '0.05em',
      color: theme.palette.primary.main,
    },
    '& .MuiTablePagination-actions': {
      display: 'flex',
      justifyContent: 'space-between',
      width: '105px',
      marginLeft: '28px',
    },
  },
}))

export default function OrdersTable() {
  const dispatch = useDispatch()
  const { orders, meta } = useSelector(ordersSelector)

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

  const handleMoreButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
  }

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  if (meta.isLoading) {
    return <>Loading...</>
  }

  if (orders.length === 0 && !meta.isLoading) {
    return <>No orders</>
  }

  if (meta.isError) {
    return <>Error happened while fetching orders</>
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={2}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <OrdersTableHead
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
                      className={classes.tableRow}
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
                        <div>
                          <span className={classes.tableCellDataBold}># {row.orderNumber}</span>
                          <span className={classes.tableCellData}>Ordered: {format(Date.parse(row.orderedDate), 'MMM. dd, yyyy')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Chip
                            className={classes.tableChip}
                            label={(
                              <div className={classes.tableChipLabelWrapper}>
                                <span className={classes.tableChipBullet} />
                                <span className={classes.tableChipLabel}>{row.status}</span>
                              </div>
                            )}
                          />
                          <span className={classes.tableCellDataBoldSmall}>Updated: {format(Date.parse(row.shippedDate), 'dd/MMM/yyyy')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={classes.tableCellDataSmallBlack}>
                          {row.customerAddress}
                        </span>
                      </TableCell>
                      <TableCell align="right">
                        <span className={classes.tableCellDataBold}>${row.orderedValue}</span>
                        <span className={classes.tableCellDataSmall}>USD</span>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="More">
                          <IconButton aria-label="more" onClick={handleMoreButtonClick}>
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
          className={classes.tableFooter}
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
