import { useState } from 'react';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { sendContactMessage } from '../../services/firebase.js';

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const submitInquiry = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    if (String(form.get('companyWebsite') || '').trim()) {
      formElement.reset();
      setStatus('Thanks for reaching out. Your message has been sent to the Kyreons team.');
      return;
    }
    const lastSubmittedAt = Number(window.localStorage.getItem('kyreons-contact-last-submit') || 0);
    const cooldownRemaining = 45000 - (Date.now() - lastSubmittedAt);
    if (cooldownRemaining > 0) {
      setError(`Please wait ${Math.ceil(cooldownRemaining / 1000)} seconds before sending another message.`);
      return;
    }
    setSubmitting(true);
    setStatus('');
    setError('');

    try {
      await sendContactMessage({
        name: form.get('name'),
        email: form.get('email'),
        topic: form.get('topic'),
        orderNumber: form.get('order'),
        message: form.get('message'),
      });
      window.localStorage.setItem('kyreons-contact-last-submit', String(Date.now()));
      formElement.reset();
      setStatus('Thanks for reaching out. Your message has been sent to the Kyreons team.');
    } catch (sendError) {
      console.error('Could not send contact message:', sendError);
      if (sendError?.code === 'permission-denied') {
        setError('Firebase denied this message. Publish the latest Kyreons firestore.rules, then try again.');
      } else if (sendError?.code === 'unavailable' || sendError?.code === 'network-request-failed') {
        setError('Firebase is temporarily unreachable. Check your internet connection and try again.');
      } else {
        setError(`Your message could not be sent${sendError?.code ? ` (${sendError.code})` : ''}. Please try again.`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="contact-page section-shell">
      <div className="contact-intro">
        <p className="eyebrow">HERE WHEN YOU NEED US / CONTACT</p>
        <h1>Let’s talk<br /><span>it through.</span></h1>
        <p>Have a question about a piece, need an order update, or looking for the perfect fit? Send us a message and our team will get back to you as soon as possible.</p>
        <p>We can help with sizing, product details, shipping, returns, and anything else you need.</p>
      </div>

      <form className="contact-form" onSubmit={submitInquiry}>
        <p className="eyebrow">SEND A MESSAGE</p>
        <input className="contact-trap" type="text" name="companyWebsite" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <div className="contact-fields">
          <label>Your name
            <input name="name" autoComplete="name" required maxLength={100} placeholder="How should we call you?" />
          </label>
          <label>Email address
            <input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" />
          </label>
          <label>What can we help with?
            <select name="topic" defaultValue="Order question">
              <option>Order question</option>
              <option>Product and sizing</option>
              <option>Shipping and returns</option>
              <option>Something else</option>
            </select>
          </label>
          <label>Order number <span className="contact-optional">OPTIONAL</span>
            <input name="order" maxLength={40} placeholder="e.g. KYR-00123" />
          </label>
          <label className="contact-message">Your message
            <textarea name="message" required minLength={5} maxLength={3000} rows="5" placeholder="Tell us a little more..." />
          </label>
        </div>
        <button className="contact-submit" type="submit" disabled={submitting}>
          {submitting ? 'SENDING…' : 'SEND YOUR MESSAGE'} <ArrowOutwardIcon />
        </button>
        {status && <p className="contact-status" role="status">{status}</p>}
        {error && <p className="contact-status" role="alert">{error}</p>}
      </form>
    </section>
  );
}
