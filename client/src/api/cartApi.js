import axiosInstance from './axiosInstance'

export const getCartApi = () => axiosInstance.get('/cart')
export const addToCartApi = (data) => axiosInstance.post('/cart', data)
export const removeFromCartApi = (productId) => axiosInstance.delete('/cart/' + productId)
export const clearCartApi = () => axiosInstance.delete('/cart')
