import { createSlice } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from './types'

interface Meta {
  isLoading: boolean
  isError: boolean
}

interface Address {
  line1: string
  line2: string
  city: string
  state: string
  zip: string
}

interface Customer {
  // eslint-disable-next-line camelcase
  first_name: string
  // eslint-disable-next-line camelcase
  last_name: string
  address: Address
}

interface OrderDetails {
  value: number
  date: string
}

interface ShippingDetails {
  date: string
}

export interface Order {
  // eslint-disable-next-line camelcase
  order_number: number
  customer: Customer
  // eslint-disable-next-line camelcase
  order_details: OrderDetails
  // eslint-disable-next-line camelcase
  shipping_details: ShippingDetails
  status: string
}

interface OrdersState {
  meta: Meta
  orders: Order[]
}

export const initialState: OrdersState = {
  meta: {
    isLoading: false,
    isError: false,
  },
  orders: [],
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    getOrders: state => {
      state.meta.isLoading = true
    },
    getOrdersSuccess: (state, { payload }) => {
      state.orders = payload
      state.meta.isLoading = false
      state.meta.isError = false
    },
    getOrdersFailure: state => {
      state.meta.isLoading = false
      state.meta.isError = true
    },
  },
})

export const { getOrders, getOrdersSuccess, getOrdersFailure } = ordersSlice.actions
export const ordersSelector = (state: RootState) => state.orders
export default ordersSlice.reducer

export function fetchOrders() {
  return async (dispatch: AppDispatch) => {
    dispatch(getOrders())

    try {
      const response = await fetch('https://gist.githubusercontent.com/ryanjn/07512cb1c008a5ec754aea6cbbf4afab/raw/eabb4d324270cf0d3d17a79ffb00ff3cfaf9acc3/orders.json')
      const data: Order[] = await response.json()

      dispatch(getOrdersSuccess(data))
    } catch (error) {
      dispatch(getOrdersFailure())
    }
  }
}
