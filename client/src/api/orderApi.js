import axiosInstance from './axiosInstance'

export const placeOrderApi = (data) => axiosInstance.post('/orders', data)
export const getMyOrdersApi = () => axiosInstance.get('/orders/myorders')
export const getOrderByIdApi = (id) => axiosInstance.get('/orders/' + id)
