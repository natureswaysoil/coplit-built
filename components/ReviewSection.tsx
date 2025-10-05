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

  // Sample reviews - replace with actual reviews from your database
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
            <span className="text-gray-600">
              Based on {reviewCount} reviews
            </span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-green-600">{averageRating}</div>
          <div className="text-sm text-gray-500">Average Rating</div>
        </div>
      </div>

      <div className="space-y-6">
        {displayedReviews.map((review, index) => (
          <div key={index} className="border-l-4 border-green-600 pl-4 py-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {renderStars(review.rating)}
                {review.verified && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    ✓ Verified Purchase
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
            <p className="text-gray-700 mb-2">{review.text}</p>
            <p className="text-sm text-gray-600">— {review.author}</p>
          </div>
        ))}
      </div>

      {allReviews.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
        >
          {showAll ? 'Show Less Reviews' : `Show All ${allReviews.length} Reviews`}
        </button>
      )}

      {/* Review Summary */}
      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-5 gap-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const percentage = stars === 5 ? 85 : stars === 4 ? 12 : 3;
            return (
              <div key={stars} className="flex items-center gap-2">
                <span className="text-sm text-gray-600 w-8">{stars}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-10">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
