import axiosInstance from './axiosInstance'

export const getProductsApi = (params) => axiosInstance.get('/products', { params })
export const getProductByIdApi = (id) => axiosInstance.get(`/products/${id}`)
export const createProductApi = (data) => axiosInstance.post('/products', data)
export const updateProductApi = (id, data) => axiosInstance.put(`/products/${id}`, data)
export const deleteProductApi = (id) => axiosInstance.delete(`/products/${id}`)