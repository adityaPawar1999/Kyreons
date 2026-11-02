import { useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { loginAccount } from '../../services/firebase.js';

const inputClass = 'mt-2 w-full border border-neutral-300 bg-transparent px-3 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-neutral-300';

export default function LoginPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError('');
    try {
      await loginAccount(form.get('email'), form.get('password'));
      const nextRoute = sessionStorage.getItem('kyreons-after-login');
      sessionStorage.removeItem('kyreons-after-login');
      location.hash = nextRoute || 'account/profile';
    } catch (authError) {
      setError(authError.code === 'auth/invalid-credential'
        ? 'Email or password is incorrect.'
        : authError.message || 'Could not log in. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return <section className="mt-7 max-w-xl border border-neutral-200 bg-[var(--bg)] p-5 dark:border-neutral-800 sm:p-8">
    <h2 className="font-display text-2xl text-neutral-900 dark:text-white">Welcome back.</h2>
    <p className="mt-2 text-xs leading-5 text-neutral-500">Log in to view and update your saved details.</p>
    {error && <p className="mt-5 text-sm text-rose-700 dark:text-rose-300" role="alert">{error}</p>}
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <label className="block text-xs text-neutral-600 dark:text-neutral-300">Email address<input className={inputClass} name="email" type="email" autoComplete="email" required /></label>
      <label className="block text-xs text-neutral-600 dark:text-neutral-300">Password<input className={inputClass} name="password" type="password" autoComplete="current-password" required /></label>
      <button className="flex w-full items-center justify-between bg-[#d5ed52] px-5 py-4 text-xs font-bold tracking-[.1em] text-neutral-900 transition-colors hover:bg-[#c4dc42] disabled:opacity-60" disabled={busy}>{busy ? 'LOGGING IN…' : 'LOG IN'}<ArrowForwardIcon /></button>
    </form>
  </section>;
}
