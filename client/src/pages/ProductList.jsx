import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getProductsApi } from '../api/productApi'

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Books', 'Sports']
const BRANDS = ['All', 'Apple', 'Samsung', 'Nike', 'Sony', 'Dell']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

function ProductList() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const [brand, setBrand] = useState('All')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [rating, setRating] = useState('')
  const [sort, setSort] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = { sort }
      if (search) params.search = search
      if (category !== 'All') params.category = category
      if (brand !== 'All') params.brand = brand
      if (minPrice) params.minPrice = minPrice
      if (maxPrice) params.maxPrice = maxPrice
      if (rating) params.rating = rating

      const { data } = await getProductsApi(params)
      setProducts(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [category, brand, sort, rating])

  useEffect(() => {
    if (searchParams.get('search') || searchParams.get('category')) {
      fetchProducts()
    }
  }, [searchParams])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts()
  }

  const handleReset = () => {
    setSearch('')
    setCategory('All')
    setBrand('All')
    setMinPrice('')
    setMaxPrice('')
    setRating('')
    setSort('newest')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-4 py-3 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold whitespace-nowrap">🛒 ShopMERN</Link>
          <form onSubmit={handleSearch} className="flex flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 text-gray-800 rounded-l-md focus:outline-none"
            />
            <button type="submit" className="bg-yellow-400 px-4 py-2 rounded-r-md hover:bg-yellow-500">
              🔍
            </button>
          </form>
          <Link to="/cart" className="text-sm hover:text-yellow-300 whitespace-nowrap">🛒 Cart</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">

        {/* Filters Sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow p-4 sticky top-20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 text-lg">Filters</h3>
              <button onClick={handleReset} className="text-blue-600 text-sm hover:underline">
                Reset all
              </button>
            </div>

            {/* Category */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-2">Category</h4>
              <div className="flex flex-col gap-2">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={category === cat}
                      onChange={() => setCategory(cat)}
                    />
                    <span className="text-gray-600 text-sm">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-2">Price Range</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
              <button
                onClick={fetchProducts}
                className="mt-2 w-full bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700"
              >
                Apply
              </button>
            </div>

            {/* Brand */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-2">Brand</h4>
              <div className="flex flex-col gap-2">
                {BRANDS.map(b => (
                  <label key={b} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="brand"
                      value={b}
                      checked={brand === b}
                      onChange={() => setBrand(b)}
                    />
                    <span className="text-gray-600 text-sm">{b}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-2">Minimum Rating</h4>
              <div className="flex flex-col gap-2">
                {[4, 3, 2, 1].map(r => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value={r}
                      checked={rating === String(r)}
                      onChange={() => setRating(String(r))}
                    />
                    <span className="text-yellow-400 text-sm">
                      {'★'.repeat(r)}{'☆'.repeat(5 - r)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4 bg-white rounded-xl shadow px-4 py-3">
            <p className="text-gray-600 text-sm">
              {loading ? 'Loading...' : `${products.length} products found`}
            </p>
            <div className="flex items-center gap-2">
              <label className="text-gray-600 text-sm">Sort by:</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile filter button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden w-full bg-white rounded-xl shadow px-4 py-3 mb-4 text-left text-gray-700 font-medium"
          >
            🔧 {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {showFilters && (
            <div className="md:hidden bg-white rounded-xl shadow p-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 text-sm">Category</h4>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 text-sm">Sort</h4>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow">
              <p className="text-gray-500 text-xl mb-2">No products found</p>
              <button onClick={handleReset} className="text-blue-600 hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <Link
                  to={`/products/${product._id}`}
                  key={product._id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden group"
                >
                  <div className="overflow-hidden">
                    <img
                      src={product.images[0] || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-xs mb-1">{product.category} • {product.brand}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-blue-600 font-bold text-lg">${product.price}</p>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        In Stock
                      </span>
                    </div>
                    <div className="text-yellow-400 text-xs mt-1">
                      {'★'.repeat(Math.round(product.ratings))}
                      {'☆'.repeat(5 - Math.round(product.ratings))}
                      <span className="text-gray-400 ml-1">({product.numReviews})</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductList