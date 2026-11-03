import { useEffect, useMemo, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { addProductReview, getProductReviews } from '../../services/firebase.js';

function ReviewDate({ value }) {
  if (!value) return null;
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
  const date = Number.isNaN(parsed.getTime()) ? value : new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(parsed).replace(/ /g, '-').toLowerCase();
  return <time dateTime={value}>{date}</time>;
}

function ReviewStars({ rating, label }) {
  return <span className="review-stars" role="img" aria-label={label || `${rating} out of 5 stars`}>
    {Array.from({ length: 5 }, (_, index) => index < rating
      ? <StarIcon key={index} />
      : <StarBorderIcon key={index} />)}
  </span>;
}

export default function ReviewsSection({ product, isSignedIn = false }) {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [remoteReviews, setRemoteReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    getProductReviews(product.id)
      .then((items) => { if (active) setRemoteReviews(items); })
      .catch((error) => console.error('Could not load product reviews:', error));
    return () => { active = false; };
  }, [product.id]);

  const reviews = useMemo(() => {
    const local = Array.isArray(product.reviews) ? product.reviews : [];
    const localIds = new Set(local.map((item) => item.id).filter(Boolean));
    return [...remoteReviews.filter((item) => !localIds.has(item.id)), ...local];
  }, [product.reviews, remoteReviews]);
  const average = reviews.length
    ? reviews.reduce((total, item) => total + (Number(item.rating) || 0), 0) / reviews.length
    : Number(product.rating) || 0;
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    if (!isSignedIn) {
      setMessage('Log in to post a review.');
      return;
    }
    if (!rating) {
      setMessage('Choose a star rating first.');
      return;
    }
    const trimmedComment = comment.trim();
    if (trimmedComment.length > 0 && trimmedComment.length < 3) {
      setMessage('Write at least 3 characters, or leave the comment empty to post only a rating.');
      return;
    }
    if (trimmedComment.length > 1000) {
      setMessage('Comments must be 1,000 characters or fewer.');
      return;
    }
    setPosting(true);
    try {
      const saved = await addProductReview(product.id, { rating, comment: trimmedComment });
      setRemoteReviews((current) => [saved, ...current]);
      setRating(0);
      setComment('');
      setMessage('Your review has been posted.');
    } catch (error) {
      console.error('Could not post product review:', error);
      setMessage(error.code === 'permission-denied'
        ? 'Firestore denied this review. Publish rules that allow signed-in users to create review documents, including empty comments and auto-generated IDs.'
        : error.message || 'Could not post your review. Please try again.');
    } finally {
      setPosting(false);
    }
  }

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
            <strong>{average.toFixed(1)}</strong>
            <div><ReviewStars rating={Math.round(average)} label={`${average.toFixed(1)} out of 5 stars`} /><small>AVERAGE RATING</small></div>
          </div>
          <div className="rating-breakdown">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviews.filter((review) => Number(review.rating) === stars).length;
              const percent = reviews.length ? (count / reviews.length) * 100 : 0;
              return <div className="rating-row" key={stars}><span>{stars} <b><StarIcon aria-hidden="true" /></b></span><div><i style={{ width: `${percent}%` }} /></div><small>{count}</small></div>;
            })}
          </div>
          <span className="reviews-total">BASED ON {reviews.length} CUSTOMER REVIEWS</span>
        </aside>
        <div className="reviews-list">
          <form className="review-form" onSubmit={handleSubmit}>
            <div className="review-form-heading">
              <div><span className="eyebrow">YOUR EXPERIENCE</span><h3>Add a review</h3></div>
              {!isSignedIn && <a href="#account/login">LOG IN TO REVIEW <span aria-hidden="true">↗</span></a>}
            </div>
            <fieldset className="review-rating-picker" disabled={posting}>
              <legend>Your star rating</legend>
              <div>{[1, 2, 3, 4, 5].map((stars) => <button key={stars} type="button" onClick={() => setRating(stars)} aria-label={`${stars} star${stars > 1 ? 's' : ''}`} aria-pressed={rating === stars}><span aria-hidden="true">{stars <= rating ? <StarIcon /> : <StarBorderIcon />}</span></button>)}</div>
            </fieldset>
            <label className="review-comment-label" htmlFor={`review-comment-${product.id}`}>Comment <span>(optional)</span></label>
            <textarea id={`review-comment-${product.id}`} value={comment} onChange={(event) => setComment(event.target.value)} maxLength={1000} placeholder="Share what you think, or post a rating on its own…" disabled={posting} />
            <div className="review-form-footer"><small>{comment.length}/1000</small><button type="submit" disabled={posting || !isSignedIn}>{posting ? 'POSTING…' : 'POST REVIEW'} <span aria-hidden="true">↗</span></button></div>
            {message && <p className={`review-form-message${message.includes('posted') ? ' is-success' : ''}`} role="status">{message}</p>}
          </form>

          <div className="review-list-items">
            {visibleReviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="review-card-top">
                  <div className="review-card-author"><strong>{review.name || 'Customer'}</strong><ReviewStars rating={Number(review.rating) || 0} /></div>
                  <ReviewDate value={review.date} />
                </div>
                {review.comment && <p>{review.comment}</p>}
              </article>
            ))}
            {!reviews.length && <p className="reviews-empty">No reviews yet. Be the first to share your rating.</p>}
          </div>
          {reviews.length > 3 && <button className="reviews-toggle" type="button" onClick={() => setShowAllReviews((value) => !value)} aria-expanded={showAllReviews}>
            {showAllReviews ? <>SHOW LESS <ExpandLessIcon /></> : <>SHOW MORE ({reviews.length - 3}) <ExpandMoreIcon /></>}
          </button>}
        </div>
      </div>
    </section>
  );
}
