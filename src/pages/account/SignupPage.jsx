import { useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { createAccount, saveCustomerProfile } from '../../services/firebase.js';

const inputClass = 'mt-2 w-full border border-neutral-300 bg-transparent px-3 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-neutral-300';
const labelClass = 'block text-xs text-neutral-600 dark:text-neutral-300';

function getSignupErrorMessage(error) {
  switch (error.code) {
    case 'auth/email-already-in-use':
    case 'auth/credential-already-in-use':
      return 'An account already uses this email. Log in instead.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/weak-password':
      return 'Choose a stronger password (at least 6 characters).';
    case 'auth/operation-not-allowed':
      return 'Email and password sign-up is disabled for this Firebase project.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a while, then try again.';
    case 'permission-denied':
      return 'Your account was created, but the profile was not saved. Publish the project Firestore rules, then retry saving your profile.';
    default:
      return error.message || 'Could not create your account. Please try again.';
  }
}

export default function SignupPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [createdUser, setCreatedUser] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (form.get('password') !== form.get('confirmPassword')) {
      setError('Passwords do not match.');
      return;
    }

    setBusy(true);
    setError('');
    try {
      const user = createdUser || await createAccount(form.get('email'), form.get('password'));
      if (!createdUser) setCreatedUser(user);
      const firstName = form.get('firstName').trim();
      const lastName = form.get('lastName').trim();
      const profile = {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        phone: form.get('phone').trim(),
        address: form.get('address').trim(),
        address2: form.get('address2').trim(),
        city: form.get('city').trim(),
        region: form.get('region').trim(),
        postalCode: form.get('postalCode').trim(),
        country: form.get('country'),
      };
      await saveCustomerProfile(user.uid, profile, user.email || '');
      location.hash = 'account/profile';
    } catch (authError) {
      setError(getSignupErrorMessage(authError));
    } finally {
      setBusy(false);
    }
  }

  return <section className="mt-7 max-w-2xl border border-neutral-200 bg-[var(--bg)] p-5 dark:border-neutral-800 sm:p-8">
    <h2 className="font-display text-2xl text-neutral-900 dark:text-white">Create your account.</h2>
    <p className="mt-2 text-xs leading-5 text-neutral-500">Your contact and delivery details will be ready for your next order.</p>
    {error && <p className="mt-5 text-sm text-rose-700 dark:text-rose-300" role="alert">{error}</p>}
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>First name<input className={inputClass} name="firstName" autoComplete="given-name" required /></label>
        <label className={labelClass}>Last name<input className={inputClass} name="lastName" autoComplete="family-name" required /></label>
      </div>
      <label className={labelClass}>Email address<input className={inputClass} name="email" type="email" autoComplete="email" required /></label>
      <label className={labelClass}>Phone number<input className={inputClass} name="phone" type="tel" autoComplete="tel" required /></label>
      <label className={labelClass}>Password<input className={inputClass} name="password" type="password" autoComplete="new-password" minLength={6} required /><span className="mt-1 block text-[10px] text-neutral-500">At least 6 characters.</span></label>
      <label className={labelClass}>Confirm password<input className={inputClass} name="confirmPassword" type="password" autoComplete="new-password" minLength={6} required /></label>
      <fieldset className="space-y-4 border-t border-neutral-200 pt-5 dark:border-neutral-800">
        <legend className="mb-1 font-display text-xl text-neutral-900 dark:text-white">Delivery address</legend>
        <label className={labelClass}>Address<input className={inputClass} name="address" autoComplete="address-line1" required /></label>
        <label className={labelClass}>Apartment, suite, etc. <span className="text-neutral-400">(optional)</span><input className={inputClass} name="address2" autoComplete="address-line2" /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>City<input className={inputClass} name="city" autoComplete="address-level2" required /></label>
          <label className={labelClass}>State / region <span className="text-neutral-400">(optional)</span><input className={inputClass} name="region" autoComplete="address-level1" /></label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>Postal code <span className="text-neutral-400">(optional)</span><input className={inputClass} name="postalCode" autoComplete="postal-code" /></label>
          <label className={labelClass}>Country<select className={inputClass} name="country" autoComplete="country-name" defaultValue="India" required><option>India</option></select></label>
        </div>
      </fieldset>
      <button className="flex w-full items-center justify-between bg-[#d5ed52] px-5 py-4 text-xs font-bold tracking-[.1em] text-neutral-900 transition-colors hover:bg-[#c4dc42] disabled:opacity-60" disabled={busy}>{busy ? (createdUser ? 'SAVING PROFILE…' : 'CREATING ACCOUNT…') : (createdUser ? 'RETRY SAVING PROFILE' : 'CREATE ACCOUNT')}<ArrowForwardIcon /></button>
    </form>
  </section>;
}
