import { useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { loginAccount, loginWithGoogle } from '../../services/firebase.js';

const inputClass = 'mt-2 w-full border border-neutral-300 bg-transparent px-3 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-neutral-300';

export default function LoginPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function continueAfterLogin() {
    const nextRoute = sessionStorage.getItem('kyreons-after-login');
    sessionStorage.removeItem('kyreons-after-login');
    location.hash = nextRoute || 'account/profile';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError('');
    const destination = sessionStorage.getItem('kyreons-after-login');
    try {
      await loginAccount(form.get('email'), form.get('password'));
      if (!destination || destination === 'account/profile') {
        sessionStorage.setItem('kyreons-show-welcome', 'true');
        window.dispatchEvent(new Event('kyreons:show-welcome'));
      } else {
        sessionStorage.removeItem('kyreons-show-welcome');
      }
      continueAfterLogin();
    } catch (authError) {
      sessionStorage.removeItem('kyreons-show-welcome');
      setError(authError.code === 'auth/invalid-credential'
        ? 'Email or password is incorrect.'
        : authError.message || 'Could not log in. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleLogin() {
    setBusy(true);
    setError('');
    try {
      await loginWithGoogle();
      sessionStorage.setItem('kyreons-show-welcome', 'true');
      window.dispatchEvent(new Event('kyreons:show-welcome'));
      sessionStorage.removeItem('kyreons-after-login');
      location.hash = 'account/profile';
    } catch (authError) {
      sessionStorage.removeItem('kyreons-show-welcome');
      const messages = {
        'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
        'auth/popup-blocked': 'Allow pop-ups for this site, then try Google sign-in again.',
        'auth/operation-not-allowed': 'Google sign-in is not enabled for this Firebase project.',
        'auth/unauthorized-domain': 'This site is not authorized for Google sign-in in Firebase.',
        'auth/account-exists-with-different-credential': 'An account with this email already exists. Log in using its original sign-in method.',
      };
      setError(messages[authError.code] || authError.message || 'Could not sign in with Google. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return <section className="mt-4 max-w-xl border border-neutral-200 bg-[var(--bg)] p-4 dark:border-neutral-800 sm:mt-5 sm:p-6">
    <h2 className="font-display text-2xl text-neutral-900 dark:text-white">Welcome back.</h2>
    <p className="mt-2 text-xs leading-5 text-neutral-500">Log in to view and update your saved details.</p>
    {error && <p className="mt-5 text-sm text-rose-700 dark:text-rose-300" role="alert">{error}</p>}
    <button type="button" onClick={handleGoogleLogin} disabled={busy} className="mt-4 flex w-full items-center justify-center gap-3 border border-neutral-300 px-5 py-3 text-xs font-semibold text-neutral-800 transition-colors hover:bg-neutral-50 disabled:opacity-60 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-900"><svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.62 5.91c4.45-4.1 7.14-10.15 7.14-17.56Z"/><path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.89l-7.62-5.91c-2.12 1.42-4.84 2.26-8.28 2.26-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"/></svg>{busy ? 'CONNECTING…' : 'CONTINUE WITH GOOGLE'}</button>
    <div className="my-3 flex items-center gap-3 text-[9px] tracking-[.12em] text-neutral-400"><span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />OR LOG IN WITH EMAIL<span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" /></div>
    <form className="mt-3 space-y-3" onSubmit={handleSubmit}>
      <label className="block text-xs text-neutral-600 dark:text-neutral-300">Email address<input className={`${inputClass} py-2.5`} name="email" type="email" autoComplete="email" required /></label>
      <label className="block text-xs text-neutral-600 dark:text-neutral-300">Password<input className={`${inputClass} py-2.5`} name="password" type="password" autoComplete="current-password" required /></label>
      <button className="flex w-full items-center justify-between bg-[#d5ed52] px-5 py-3 text-xs font-bold tracking-[.1em] text-neutral-900 transition-colors hover:bg-[#c4dc42] disabled:opacity-60" disabled={busy}>{busy ? 'LOGGING IN…' : 'LOG IN'}<ArrowForwardIcon /></button>
    </form>
  </section>;
}
