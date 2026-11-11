import { useEffect } from 'react';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LoginPage from './LoginPage.jsx';
import SignupPage from './SignupPage.jsx';
import ProfilePage from './ProfilePage.jsx';

export default function AccountPage({ mode = 'home', cart, user, authReady }) {

  useEffect(() => {
    if (authReady && user && !user.isAnonymous && mode !== 'signup' && !sessionStorage.getItem('kyreons-after-login') && location.hash !== '#account/profile') {
      location.hash = 'account/profile';
    }
  }, [authReady, user, mode]);

  const hasAccount = user && !user.isAnonymous;
  const activeMode = mode === 'signup' ? 'signup' : 'login';
  const compactLogin = mode === 'login';
  const compactAuth = compactLogin || mode === 'signup';
  const signupInProgress = mode === 'signup' && sessionStorage.getItem('kyreons-signup-in-progress') === 'true';
  const showAuth = !hasAccount || signupInProgress;

  useEffect(() => {
    if (authReady && hasAccount && mode === 'signup' && !signupInProgress) {
      location.hash = 'account/profile';
    }
  }, [authReady, hasAccount, mode, signupInProgress]);

  return <main className={`mx-auto ${compactLogin ? 'max-w-6xl' : 'max-w-5xl'} px-5 sm:px-8 ${hasAccount && mode !== 'signup' ? 'min-h-[58vh] pb-12 pt-0 md:pb-16' : compactLogin ? 'min-h-[calc(90svh-108px)] py-4 sm:min-h-[calc(90svh-140px)] sm:py-5' : compactAuth ? 'min-h-[58vh] py-4 sm:py-5' : 'min-h-[58vh] py-12 md:py-16'}`}>
    {showAuth && <div className="max-w-2xl">
      <p className="flex items-center gap-2 text-[9px] font-semibold tracking-[.17em] text-neutral-500"><PersonOutlinedIcon fontSize="small" /> YOUR KYREONS / ACCOUNT</p>
      <h1 className={`font-display font-medium tracking-[-.07em] text-neutral-900 dark:text-white ${compactAuth ? 'mt-2 text-4xl sm:text-5xl' : 'mt-4 text-5xl sm:text-6xl'}`}>Your account.</h1>
      {!compactAuth && <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-600 dark:text-neutral-300">Manage your sign-in details and delivery information.</p>}
    </div>}

    {!authReady ? <p className="mt-8 text-sm text-neutral-500">Loading your account…</p> : hasAccount && !signupInProgress ? <ProfilePage user={user} cart={cart} /> : <>
      <div className={`${compactAuth ? 'mt-4' : 'mt-8'} flex max-w-xl gap-2 border-b border-neutral-300 dark:border-neutral-700`} aria-label="Account pages">
        {!hasAccount && <a className={`border-b-2 px-3 py-3 text-[9px] font-semibold tracking-[.12em] ${activeMode === 'login' ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white' : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`} href="#account/login">LOG IN</a>}
        {!hasAccount && <a className={`border-b-2 px-3 py-3 text-[9px] font-semibold tracking-[.12em] ${activeMode === 'signup' ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white' : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`} href="#account/signup">SIGN UP</a>}
      </div>
      <div className={compactLogin ? 'grid gap-4 lg:grid-cols-2 lg:items-stretch' : ''}>
        {activeMode === 'signup' ? <SignupPage /> : <LoginPage />}
        {compactLogin && <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#191b17] p-8 text-white lg:flex" aria-label="Account benefits">
          <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full border border-[#d5ed52]/30" aria-hidden="true"><span className="absolute inset-8 rounded-full border border-[#d5ed52]/25" /><span className="absolute inset-16 rounded-full bg-[#d5ed52]/10" /></div>
          <div className="relative"><p className="text-[9px] font-semibold tracking-[.2em] text-[#d5ed52]">YOUR KYREONS / ACCOUNT</p><span className="mt-10 grid h-12 w-12 place-items-center bg-[#d5ed52] font-display text-xl font-semibold text-neutral-900">K</span></div>
          <div className="relative"><h2 className="max-w-sm font-display text-4xl font-medium leading-[.98] tracking-[-.07em]">Your essentials, in one place.</h2><p className="mt-4 max-w-sm text-sm leading-6 text-white/65">Keep your contact details, delivery address and order history together in your Kyreons account.</p><div className="mt-8 border-t border-white/15 pt-4 text-[9px] font-semibold tracking-[.15em] text-white/45">PROFILE&nbsp;&nbsp; / &nbsp;&nbsp;DELIVERY&nbsp;&nbsp; / &nbsp;&nbsp;ORDERS</div></div>
        </aside>}
      </div>
    </>}
  </main>;
}
