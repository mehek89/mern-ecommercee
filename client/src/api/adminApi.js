import axiosInstance from './axiosInstance'

export const getAdminStatsApi = () => axiosInstance.get('/admin/stats')
export const getAllOrdersApi = () => axiosInstance.get('/admin/orders')
export const getAllUsersApi = () => axiosInstance.get('/admin/users')
export const updateOrderStatusApi = (id, status) => axiosInstance.put(`/admin/orders/${id}`, { status })
export const deleteUserApi = (id) => axiosInstance.delete(`/admin/users/${id}`)