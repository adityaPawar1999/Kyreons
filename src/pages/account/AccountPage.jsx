import { useEffect, useState } from 'react';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LoginPage from './LoginPage.jsx';
import SignupPage from './SignupPage.jsx';
import ProfilePage from './ProfilePage.jsx';
import { watchAuthUser } from '../../services/firebase.js';

export default function AccountPage({ mode = 'home', cart }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    try {
      return watchAuthUser((activeUser) => {
        setUser(activeUser);
        setAuthReady(true);
      });
    } catch (error) {
      setAuthError(error.message || 'Could not connect to your account.');
      setAuthReady(true);
      return undefined;
    }
  }, []);

  useEffect(() => {
    if (authReady && user && !user.isAnonymous && mode !== 'signup' && !sessionStorage.getItem('kyreons-after-login') && location.hash !== '#account/profile') {
      location.hash = 'account/profile';
    }
  }, [authReady, user, mode]);

  const hasAccount = user && !user.isAnonymous;
  const activeMode = mode === 'signup' ? 'signup' : 'login';

  return <main className={`mx-auto min-h-[58vh] max-w-5xl px-5 sm:px-8 ${hasAccount && mode !== 'signup' ? 'pb-12 pt-0 md:pb-16' : 'py-12 md:py-16'}`}>
    {(!hasAccount || mode === 'signup') && <div className="max-w-2xl">
      <p className="flex items-center gap-2 text-[9px] font-semibold tracking-[.17em] text-neutral-500"><PersonOutlinedIcon fontSize="small" /> YOUR KYREONS / ACCOUNT</p>
      <h1 className="mt-4 font-display text-5xl font-medium tracking-[-.07em] text-neutral-900 dark:text-white sm:text-6xl">Your account.</h1>
      <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-600 dark:text-neutral-300">Manage your sign-in details and delivery information.</p>
    </div>}

    {!authReady ? <p className="mt-8 text-sm text-neutral-500">Loading your account…</p> : authError ? <p className="mt-8 text-sm text-rose-700 dark:text-rose-300" role="alert">{authError}</p> : hasAccount && mode !== 'signup' ? <ProfilePage user={user} cart={cart} /> : <>
      <div className="mt-8 flex max-w-xl gap-2 border-b border-neutral-300 dark:border-neutral-700" aria-label="Account pages">
        <a className={`border-b-2 px-3 py-3 text-[9px] font-semibold tracking-[.12em] ${activeMode === 'login' ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white' : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`} href="#account/login">LOG IN</a>
        <a className={`border-b-2 px-3 py-3 text-[9px] font-semibold tracking-[.12em] ${activeMode === 'signup' ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white' : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`} href="#account/signup">SIGN UP</a>
      </div>
      {activeMode === 'signup' ? <SignupPage /> : <LoginPage />}
    </>}
  </main>;
}
