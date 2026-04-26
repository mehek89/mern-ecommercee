import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getProductsApi, deleteProductApi, createProductApi } from '../../api/productApi'

function ManageProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', brand: '', stock: '', images: ''
  })
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return }
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await getProductsApi()
      setProducts(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await deleteProductApi(id)
      setProducts(prev => prev.filter(p => p._id !== id))
    } catch (error) {
      console.log(error)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const { data } = await createProductApi({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: [formData.images]
      })
      setProducts(prev => [data, ...prev])
      setShowForm(false)
      setFormData({ name: '', description: '', price: '', category: '', brand: '', stock: '', images: '' })
    } catch (error) {
      console.log(error)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-500">Loading products...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white px-4 py-3 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-yellow-400">🛒 ShopMERN</Link>
          <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded text-xs font-bold">ADMIN</span>
          <div className="ml-auto flex gap-4">
            <Link to="/admin" className="text-sm hover:text-yellow-400">Dashboard</Link>
            <Link to="/admin/products" className="text-sm text-yellow-400 font-bold">Products</Link>
            <Link to="/admin/orders" className="text-sm hover:text-yellow-400">Orders</Link>
            <Link to="/admin/users" className="text-sm hover:text-yellow-400">Users</Link>
            <Link to="/" className="text-sm hover:text-yellow-400">← Store</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">🛍️ Manage Products ({products.length})</h2>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            {showForm ? '✕ Cancel' : '+ Add Product'}
          </button>
        </div>

        {/* Add Product Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-4">Add New Product</h3>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Product Name" value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              <input placeholder="Brand" value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input placeholder="Category" value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              <input placeholder="Price" type="number" value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              <input placeholder="Stock" type="number" value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              <input placeholder="Image URL" value={formData.images}
                onChange={(e) => setFormData({...formData, images: e.target.value})}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <textarea placeholder="Description" value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2" rows={3} required />
              <button type="submit"
                className="md:col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                ✅ Add Product
              </button>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Rating</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.images[0]} alt={product.name}
                          className="w-10 h-10 object-cover rounded" />
                        <div>
                          <p className="font-medium text-gray-800">{product.name}</p>
                          <p className="text-gray-400 text-xs">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{product.category}</td>
                    <td className="px-4 py-3 font-bold text-blue-600">${product.price}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock > 10 ? 'bg-green-100 text-green-700' :
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-4 py-3 text-yellow-400">
                      {'★'.repeat(Math.round(product.ratings))}
                      {'☆'.repeat(5 - Math.round(product.ratings))}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link to={`/products/${product._id}`}
                          className="text-blue-600 hover:underline text-xs">View</Link>
                        <button onClick={() => handleDelete(product._id)}
                          className="text-red-500 hover:underline text-xs">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageProducts