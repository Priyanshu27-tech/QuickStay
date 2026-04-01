import React, { useEffect, useState } from "react"
import { useAppContext } from "../context/AppContext"
import toast from "react-hot-toast"

const Testimonial = () => {
  const { axios, user } = useAppContext()
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get("/api/reviews")
      if (data.success) setReviews(data.reviews)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => { fetchReviews() }, [])

  const submitReview = async (e) => {
    e.preventDefault()
    if (!user) { toast.error("Login to add a review"); return }
    if (!comment) { toast.error("Please write a review"); return }

    setLoading(true)
    try {
      const { data } = await axios.post("/api/reviews", {
        rating: Number(rating),
        comment
      })
      if (data.success) {
        toast.success("Review added!")
        setComment("")
        setRating(5)
        fetchReviews()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Error submitting review")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id="testimonials" className="pt-28 px-6 md:px-20">
      <h1 className="text-4xl font-bold text-center mb-10">Guest Experiences</h1>

      {/* Add Review Form */}
      <form onSubmit={submitReview} className="max-w-xl mx-auto mb-12 space-y-4 border rounded-xl p-6 shadow-sm bg-white">
        <h2 className="text-xl font-semibold text-gray-700">Share Your Experience</h2>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border p-2 w-full rounded outline-none"
        >
          <option value="5">5 ⭐⭐⭐⭐⭐</option>
          <option value="4">4 ⭐⭐⭐⭐</option>
          <option value="3">3 ⭐⭐⭐</option>
          <option value="2">2 ⭐⭐</option>
          <option value="1">1 ⭐</option>
        </select>
        <textarea
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="border w-full p-3 rounded outline-none resize-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-all disabled:opacity-60 w-full"
        >
          {loading ? "Submitting..." : "Add Review"}
        </button>
      </form>

      {/* Reviews Grid */}
      {reviews.length === 0 ? (
        <p className="text-center text-gray-400 py-10">No reviews yet. Be the first!</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 pb-16">
          {reviews.map((review) => (
            <div key={review._id} className="border p-6 rounded-lg shadow-sm bg-white">
              <p className="text-yellow-500 mb-2 text-lg">
                {"⭐".repeat(review.rating)}
              </p>
              <p className="text-gray-600 mb-3">{review.comment}</p>
              <p className="font-semibold text-gray-800">{review.user?.name}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Testimonial