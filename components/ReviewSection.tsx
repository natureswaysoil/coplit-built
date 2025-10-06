
import { useState } from 'react';

interface Review {
  rating: number;
  title: string;
  text: string;
  author: string;
  verified: boolean;
  date: string;
}

interface ReviewSectionProps {
  productCategory?: string;
  averageRating?: number;
  reviewCount?: number;
}

export default function ReviewSection({ 
  productCategory = 'Fertilizer',
  averageRating = 4.8,
  reviewCount = 127
}: ReviewSectionProps) {
  const [showAll, setShowAll] = useState(false);

  const allReviews: Review[] = [
    {
      rating: 5,
      title: 'Amazing results in just 2 weeks!',
      text: 'My tomato plants have never looked better. The leaves are deep green and the growth is incredible. This organic fertilizer really works!',
      author: 'Sarah M.',
      verified: true,
      date: '2024-09-15'
    },
    {
      rating: 5,
      title: 'Finally, an organic option that works',
      text: "I've tried many organic fertilizers and this is the first one that actually delivers results comparable to synthetic options. My garden is thriving!",
      author: 'John D.',
      verified: true,
      date: '2024-09-20'
    },
    {
      rating: 4,
      title: 'Great product, noticeable difference',
      text: 'Used this on my vegetable garden and saw improvement within a week. Plants are healthier and producing more. Would definitely recommend.',
      author: 'Maria G.',
      verified: true,
      date: '2024-09-25'
    },
    {
      rating: 5,
      title: 'Transformed my clay soil',
      text: "My soil was hard as a rock. After using this amendment, it's now loose and workable. My plants are so much happier!",
      author: 'Robert K.',
      verified: true,
      date: '2024-09-10'
    },
    {
      rating: 5,
      title: 'Best soil conditioner I\'ve used',
      text: 'The biochar and humic acid really make a difference. Water retention improved dramatically and my plants are thriving.',
      author: 'Linda P.',
      verified: true,
      date: '2024-09-18'
    }
  ];

  const displayedReviews = showAll ? allReviews : allReviews.slice(0, 3);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)} out of 5
        </span>
      </div>
    );
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-4">
            {renderStars(averageRating)}
            <span className="text-gray-600">Based on {reviewCount} reviews</span>
          </div>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
          Write a Review
        </button>
      </div>

      <div className="space-y-6">
        {displayedReviews.map((review, index) => (
          <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                {renderStars(review.rating)}
                <h3 className="font-semibold text-lg mt-2">{review.title}</h3>
              </div>
              {review.verified && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified Purchase
                </span>
              )}
            </div>
            <p className="text-gray-700 mb-2">{review.text}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium">{review.author}</span>
              <span>•</span>
              <span>{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        ))}
      </div>

      {allReviews.length > 3 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-green-600 hover:text-green-700 font-semibold"
          >
            {showAll ? 'Show Less' : `Show All ${reviewCount} Reviews`}
          </button>
        </div>
      )}
    </section>
  );
}
