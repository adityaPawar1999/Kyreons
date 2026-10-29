import { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

export default function ReviewsSection({ product }) {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);
  return (
    <section className="reviews-section" aria-labelledby="reviews-title">
      <div className="reviews-heading">
        <div>
          <p className="eyebrow">KYREONS COMMUNITY / {String(reviews.length).padStart(2, '0')} NOTES</p>
          <h2 id="reviews-title">Worn and loved.</h2>
          <p>Real thoughts from the people who wear it.</p>
        </div>
      </div>
      <div className="reviews-content">
        <aside className="reviews-overview">
          <div className="reviews-score">
            <strong>{product.rating.toFixed(1)}</strong>
            <div><span className="review-stars" role="img" aria-label={`${product.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => index < Math.round(product.rating) ? <StarIcon key={index} /> : <StarBorderIcon key={index} />)}</span><small>AVERAGE RATING</small></div>
          </div>
          <div className="rating-breakdown">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviews.filter((review) => review.rating === stars).length;
              const percent = reviews.length ? (count / reviews.length) * 100 : 0;
              return <div className="rating-row" key={stars}><span>{stars} <b><StarIcon aria-hidden="true" /></b></span><div><i style={{ width: `${percent}%` }} /></div><small>{count}</small></div>;
            })}
          </div>
          <span className="reviews-total">BASED ON {reviews.length} CUSTOMER REVIEWS</span>
        </aside>
        <div className="reviews-list">
          {visibleReviews.map((review) => (
            <article className="review-card" key={review.id}>
              <div className="review-card-top">
                <span className="review-stars" role="img" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => index < review.rating ? <StarIcon key={index} /> : <StarBorderIcon key={index} />)}</span>
                <time dateTime={review.date}>{new Date(`${review.date}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</time>
              </div>
              <p>“{review.comment}”</p>
              <div className="review-author"><strong>{review.name}</strong><span>{review.location}</span></div>
            </article>
          ))}
          {reviews.length > 3 && <button className="reviews-toggle" type="button" onClick={() => setShowAllReviews((value) => !value)} aria-expanded={showAllReviews}>
            {showAllReviews ? <>SHOW LESS <ExpandLessIcon /></> : <>SHOW MORE ({reviews.length - 3}) <ExpandMoreIcon /></>}
          </button>}
        </div>
      </div>
    </section>
  );
}
