import { useState } from 'react';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

const CONTACT_EMAIL = 'kyreons.studio@gmail.com';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const submitInquiry = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Kyreons enquiry: ${form.get('topic')}`);
    const body = encodeURIComponent(`Name: ${form.get('name')}\nEmail: ${form.get('email')}\nOrder number: ${form.get('order') || 'Not provided'}\n\n${form.get('message')}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
    event.currentTarget.reset();
  };

  return 
  (
  <section className="contact-page section-shell">
    <div className="contact-intro">
      <p className="eyebrow">HERE WHEN YOU NEED US / CONTACT</p>
      <h1>Let's talk<br />
      <span>it through.</span>
      </h1>
      <h1>We’re Here to Help</h1>
<p>Have a question about a piece, need an update on your order, or looking for the perfect fit? We’re here to make your experience seamless. Whether you need help with sizing, product details, shipping, returns, or anything else, our team is ready to assist you. Send us a message, and we’ll get back to you as soon as possible. At KYREONS, we believe great style deserves great service.</p>
      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL} <ArrowOutwardIcon /></a>
      </div>
      <form className="contact-form" onSubmit={submitInquiry}
      ><p className="eyebrow">SEND A MESSAGE</p>
      <div className="contact-fields">
        <label>Your name
          <input name="name" autoComplete="name" required placeholder="How should we call you?" />
        </label>
        <label>Email address
          <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
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
            <input name="order" placeholder="e.g. KYR-00123" />
          </label>
          <label className="contact-message">Your message
            <textarea name="message" required rows="5" placeholder="Tell us a little more..." />
          </label>
        </div>
        <button className="contact-submit" type="submit">SEND YOUR MESSAGE <ArrowOutwardIcon /></button>
        {sent && (
          <p className="contact-status" role="status">
            Your email app should open with your message ready to send.
          </p>
        )}
      </form>
    </section>
  );
}
