import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProductByIdApi } from '../api/productApi'
import { addToCartApi } from '../api/cartApi'
import { setCart } from '../redux/slices/cartSlice'
import axiosInstance from '../api/axiosInstance'

function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewMessage, setReviewMessage] = useState('')
  const [hoveredStar, setHoveredStar] = useState(0)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const fetchProduct = async () => {
    try {
      const { data } = await getProductByIdApi(id)
      setProduct(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    setAdding(true)
    try {
      const { data } = await addToCartApi({
        productId: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        quantity: 1
      })
      dispatch(setCart(data))
      setMessage('✅ Added to cart!')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setMessage('❌ Failed to add to cart')
    } finally {
      setAdding(false)
    }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    setReviewLoading(true)
    try {
      await axiosInstance.post(`/products/${id}/reviews`, { rating, comment })
      setReviewMessage('✅ Review submitted!')
      setComment('')
      setRating(5)
      fetchProduct()
      setTimeout(() => setReviewMessage(''), 3000)
    } catch (error) {
      setReviewMessage('❌ ' + (error.response?.data?.message || 'Failed to submit review'))
    } finally {
      setReviewLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Product not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-4 py-3 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold">🛒 ShopMERN</Link>
          <div className="ml-auto flex gap-4">
            <Link to="/products" className="text-sm hover:text-yellow-300">Products</Link>
            <Link to="/cart" className="text-sm hover:text-yellow-300">🛒 Cart</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link to="/products" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Products
        </Link>

        {/* Product Info */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-8 mb-6">
          <img
            src={product.images[0] || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full md:w-80 h-80 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h2>
            <p className="text-gray-500 mb-2">{product.category} • {product.brand}</p>

            {/* Rating Summary */}
            <div className="flex items-center gap-2 mb-4">
              <div className="text-yellow-400 text-xl">
                {'★'.repeat(Math.round(product.ratings))}
                {'☆'.repeat(5 - Math.round(product.ratings))}
              </div>
              <span className="text-gray-600 text-sm">
                {product.ratings.toFixed(1)} ({product.numReviews} reviews)
              </span>
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>
            <p className="text-3xl font-bold text-blue-600 mb-4">${product.price}</p>
            <p className="text-sm text-gray-500 mb-6">
              {product.stock > 0
                ? `✅ ${product.stock} in stock`
                : '❌ Out of stock'}
            </p>

            {message && (
              <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                {message}
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 w-full md:w-auto"
            >
              {adding ? 'Adding...' : '🛒 Add to Cart'}
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Write Review */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Write a Review</h3>

            {!user ? (
              <p className="text-gray-500">
                Please <Link to="/login" className="text-blue-600 hover:underline">login</Link> to write a review.
              </p>
            ) : (
              <form onSubmit={handleReview} className="flex flex-col gap-4">
                {/* Star Rating */}
                <div>
                  <label className="text-gray-700 font-medium mb-2 block">Your Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="text-3xl transition"
                      >
                        <span className={star <= (hoveredStar || rating) ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : 'Excellent'}
                  </p>
                </div>

                {/* Comment */}
                <div>
                  <label className="text-gray-700 font-medium mb-2 block">Your Review</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Share your experience with this product..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                {reviewMessage && (
                  <div className={`p-3 rounded ${reviewMessage.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {reviewMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>

          {/* All Reviews */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Customer Reviews ({product.numReviews})
            </h3>

            {product.reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="flex flex-col gap-4 max-h-96 overflow-y-auto">
                {product.reviews.map((review) => (
                  <div key={review._id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-800">{review.name}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-yellow-400 text-sm mb-2">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail