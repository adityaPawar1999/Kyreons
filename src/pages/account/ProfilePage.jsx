import { useEffect, useRef, useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import { getCustomerProfile, logoutAccount, saveCustomerCart, saveCustomerProfile } from '../../services/firebase.js';
import MyOrdersPage from '../orders/MyOrdersPage.jsx';

const emptyProfile = {
  firstName: '', lastName: '', phone: '', address: '', address2: '', city: '', region: '', postalCode: '', country: 'India',
};
const inputClass = 'mt-2 w-full border-0 border-b border-neutral-300 bg-neutral-50/80 px-3 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-[#a8bc38] focus:bg-white dark:border-neutral-700 dark:bg-neutral-950/60 dark:text-white dark:focus:border-[#d5ed52] dark:focus:bg-neutral-950';

function ProfileField({ icon: Icon, label, children, className = '' }) {
  return <label className={`block min-w-0 text-[11px] font-medium tracking-[.03em] text-neutral-600 dark:text-neutral-300 ${className}`}>
    <span className="flex items-center gap-2"><Icon className="!h-[17px] !w-[17px] text-neutral-400" aria-hidden="true" />{label}</span>
    {children}
  </label>;
}

export default function ProfilePage({ user, cart }) {
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showWelcome, setShowWelcome] = useState(() => sessionStorage.getItem('kyreons-show-welcome') === 'true');
  const welcomeDialogRef = useRef(null);

  function closeWelcome() {
    sessionStorage.removeItem('kyreons-show-welcome');
    setShowWelcome(false);
  }

  useEffect(() => {
    function showWelcome() {
      if (sessionStorage.getItem('kyreons-show-welcome') === 'true') setShowWelcome(true);
    }
    window.addEventListener('kyreons:show-welcome', showWelcome);
    return () => window.removeEventListener('kyreons:show-welcome', showWelcome);
  }, []);

  useEffect(() => {
    if (!showWelcome) return undefined;
    const dialog = welcomeDialogRef.current;
    const focusable = () => [...(dialog?.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])') || [])].filter((element) => !element.disabled);
    focusable()[0]?.focus();
    function handleDialogKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        sessionStorage.removeItem('kyreons-show-welcome');
        setShowWelcome(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', handleDialogKeyDown);
    return () => document.removeEventListener('keydown', handleDialogKeyDown);
  }, [showWelcome]);

  useEffect(() => {
    let active = true;
    getCustomerProfile(user.uid, user.email).then((saved) => {
      if (!active) return;
      if (saved) {
        const names = (saved.name || '').split(' ');
        setProfile({
          ...emptyProfile,
          ...saved,
          firstName: saved.firstName || names.shift() || '',
          lastName: saved.lastName || names.join(' '),
        });
      }
    }).catch((loadError) => {
      if (active) setError(`Could not load your profile: ${loadError.code || loadError.message}`);
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user.uid]);

  async function handleSave(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const details = Object.fromEntries(form.entries());
    details.name = `${details.firstName} ${details.lastName}`.trim();
    setBusy(true); setError(''); setNotice('');
    try {
      await saveCustomerProfile(user.uid, details, user.email || '');
      setProfile(details);
      setNotice('Your profile has been saved.');
    } catch (saveError) {
      setError(`Could not save your profile: ${saveError.code || saveError.message}`);
    } finally { setBusy(false); }
  }

  async function handleLogout() {
    setBusy(true); setError('');
    try {
      let cartSaveFailed = false;
      try { await saveCustomerCart(user.uid, user.email, cart); }
      catch { cartSaveFailed = true; }
      await logoutAccount();
      sessionStorage.removeItem('kyreons-show-welcome');
      setShowWelcome(false);
      if (cartSaveFailed) window.dispatchEvent(new CustomEvent('kyreons:toast', { detail: 'Logged out, but your cart could not be synced.' }));
      location.hash = 'account/login';
    }
    catch (logoutError) { setError(logoutError.message || 'Could not log out.'); }
    finally { setBusy(false); }
  }

  const initials = `${profile.firstName?.[0] || user.email?.[0] || 'K'}${profile.lastName?.[0] || ''}`.toUpperCase();
  const welcomeName = profile.firstName || user.displayName?.trim().split(/\s+/)[0] || 'there';

  return <div className="mt-0 space-y-7">
    {showWelcome && <div className="fixed inset-0 z-[120] grid place-items-center bg-black/55 px-5 py-6 backdrop-blur-sm" role="presentation"><section ref={welcomeDialogRef} className="relative w-full max-w-md border border-neutral-200 bg-[var(--bg)] p-7 text-center shadow-2xl dark:border-neutral-700 sm:p-10" role="dialog" aria-modal="true" aria-labelledby="welcome-title"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#d5ed52] font-display text-xl font-semibold text-neutral-900">K</span><p className="mt-6 text-[9px] font-semibold tracking-[.2em] text-neutral-500">KYREONS / ACCOUNT</p><h2 id="welcome-title" className="mt-3 font-display text-4xl font-medium tracking-[-.07em] text-neutral-900 dark:text-white">Welcome, {welcomeName}.</h2><p className="mt-3 text-sm leading-6 text-neutral-500">You’re signed in and your account is ready.</p><button type="button" className="mt-7 flex w-full items-center justify-center bg-[#d5ed52] px-5 py-4 text-[10px] font-bold tracking-[.12em] text-neutral-900 transition-colors hover:bg-[#c4dc42]" onClick={closeWelcome}>CONTINUE TO YOUR ACCOUNT<ArrowForwardIcon className="ml-3 !h-4 !w-4" /></button></section></div>}
    <div className="relative h-[287px] overflow-hidden bg-neutral-200 sm:h-[273px] lg:h-[301px]">
      <img className="absolute inset-0 h-full w-full object-cover object-[center_42%]" src="https://images.unsplash.com/photo-1636047250452-6772f6144b3d?auto=format&fit=crop&w=1800&q=80" alt="Streetwear editorial portrait in a graphic T-shirt" />
      <span className="absolute right-3 top-3 bg-black/45 px-2 py-1 text-[8px] font-semibold tracking-[.14em] text-white"><a href="https://unsplash.com/photos/a-man-wearing-a-t-shirt-that-says-out-of-the-ordinary--7oth7kZEo8" target="_blank" rel="noreferrer">PHOTO: MUHAMMAD REZA PAHLEVI / UNSPLASH</a></span>
      <section className="absolute inset-0 flex flex-col items-start justify-between gap-5 overflow-hidden bg-[#d5ed52]/75 px-6 py-7 text-neutral-900 sm:flex-row sm:items-end sm:px-9 sm:py-9">
        <div className="pointer-events-none absolute -right-5 -top-10 select-none font-display text-[180px] font-semibold leading-none tracking-[-.12em] text-neutral-900/[.045]" aria-hidden="true">K</div>
        <div className="relative">
          <p className="flex items-center gap-2 text-[9px] font-semibold tracking-[.18em]"><span className="h-[7px] w-[7px] rounded-full bg-neutral-900" /> KYREONS / YOUR ACCOUNT</p>
          <h2 className="mt-5 font-display text-[clamp(46px,6vw,68px)] font-semibold leading-[.85] tracking-[-.095em]">Your account.</h2>
          <p className="mt-3 max-w-2xl text-xs leading-5 text-neutral-800">Manage your personal details, delivery address and orders. Keep your contact information up to date, choose where your next order should arrive, and check its progress whenever you need.</p>
        </div>
        <div className="relative inline-flex items-center gap-2 border-b border-neutral-900/35 pb-2 text-[10px] font-semibold text-neutral-900"><span className="grid h-7 w-7 place-items-center bg-neutral-900 font-display text-[10px] text-[#d5ed52]">{initials}</span><span className="max-w-[190px] truncate">{user.email}</span></div>
      </section>
    </div>

    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,.8fr)]">
      <section className="min-w-0 border-y border-neutral-300 bg-transparent dark:border-neutral-700">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 px-5 py-5 dark:border-neutral-800 sm:px-8">
          <div><p className="text-[9px] font-semibold tracking-[.15em] text-neutral-500">ACCOUNT PROFILE</p><h3 className="mt-1 font-display text-2xl tracking-[-.04em] text-neutral-900 dark:text-white">Your details</h3></div>
        </header>
        <div className="p-5 sm:p-8">
          {error && <p className="mb-5 border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300" role="alert">{error}</p>}
          {notice && <p className="mb-5 border border-[#d5ed52] bg-[#d5ed52]/20 px-4 py-3 text-sm text-neutral-900 dark:bg-[#d5ed52]/10 dark:text-lime-100" role="status">{notice}</p>}
          {loading ? <div className="space-y-4 py-4" role="status"><div className="h-4 w-36 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" /><div className="h-12 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" /><div className="h-12 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" /></div> : <form className="space-y-8" onSubmit={handleSave}>
            <section>
              <div className="mb-5 flex items-center gap-3"><span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" /><p className="text-[9px] font-semibold tracking-[.16em] text-neutral-400">PERSONAL INFORMATION</p><span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" /></div>
              <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                <ProfileField icon={PersonOutlinedIcon} label="First name"><input className={inputClass} name="firstName" autoComplete="given-name" value={profile.firstName || ''} onChange={(event) => setProfile({ ...profile, firstName: event.target.value })} placeholder="Your first name" required /></ProfileField>
                <ProfileField icon={PersonOutlinedIcon} label="Last name"><input className={inputClass} name="lastName" autoComplete="family-name" value={profile.lastName || ''} onChange={(event) => setProfile({ ...profile, lastName: event.target.value })} placeholder="Your last name" required /></ProfileField>
                <ProfileField icon={AlternateEmailIcon} label="Email address"><input className={`${inputClass} cursor-not-allowed opacity-65`} value={user.email || ''} type="email" autoComplete="email" readOnly /></ProfileField>
                <ProfileField icon={PhoneIphoneIcon} label="Phone number"><input className={inputClass} name="phone" type="tel" autoComplete="tel" value={profile.phone || ''} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} placeholder="+91 00000 00000" required /></ProfileField>
              </div>
            </section>

            <fieldset className="border-t border-neutral-200 pt-7 dark:border-neutral-800">
              <legend className="sr-only">Delivery address</legend>
              <div className="mb-5"><p className="text-[9px] font-semibold tracking-[.15em] text-neutral-500">FOR THE DELIVERY</p><h4 className="mt-1 font-display text-xl tracking-[-.03em] text-neutral-900 dark:text-white">Your address</h4></div>
              <div className="space-y-5">
                <ProfileField icon={HomeOutlinedIcon} label="Street address"><input className={inputClass} name="address" autoComplete="address-line1" value={profile.address || ''} onChange={(event) => setProfile({ ...profile, address: event.target.value })} placeholder="House number and street" required /></ProfileField>
                <ProfileField icon={ApartmentOutlinedIcon} label={<>Apartment, suite, etc. <span className="font-normal text-neutral-400">· optional</span></>}><input className={inputClass} name="address2" autoComplete="address-line2" value={profile.address2 || ''} onChange={(event) => setProfile({ ...profile, address2: event.target.value })} placeholder="Flat, floor or building" /></ProfileField>
                <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  <ProfileField icon={LocationCityOutlinedIcon} label="City"><input className={inputClass} name="city" autoComplete="address-level2" value={profile.city || ''} onChange={(event) => setProfile({ ...profile, city: event.target.value })} placeholder="City" required /></ProfileField>
                  <ProfileField icon={PinDropOutlinedIcon} label="State / region"><input className={inputClass} name="region" autoComplete="address-level1" value={profile.region || ''} onChange={(event) => setProfile({ ...profile, region: event.target.value })} placeholder="State or region" required /></ProfileField>
                  <ProfileField icon={PinDropOutlinedIcon} label="Postal code"><input className={inputClass} name="postalCode" autoComplete="postal-code" value={profile.postalCode || ''} onChange={(event) => setProfile({ ...profile, postalCode: event.target.value })} placeholder="Postal code" required /></ProfileField>
                  <ProfileField icon={PublicOutlinedIcon} label="Country"><select className={inputClass} name="country" autoComplete="country-name" value={profile.country || 'India'} onChange={(event) => setProfile({ ...profile, country: event.target.value })} required><option>India</option></select></ProfileField>
                </div>
              </div>
            </fieldset>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-800">
              <p className="text-[10px] text-neutral-500">Your delivery details stay with your account.</p>
              <button className="group inline-flex w-full items-center justify-between gap-8 bg-[#d5ed52] px-6 py-4 text-[10px] font-bold tracking-[.12em] text-neutral-900 transition-colors hover:bg-[#c4dc42] disabled:cursor-wait disabled:opacity-60 sm:w-auto" disabled={busy}><span>{busy ? 'SAVING YOUR DETAILS…' : 'SAVE PROFILE'}</span><ArrowForwardIcon className="transition-transform group-hover:translate-x-1" /></button>
            </div>
          </form>}
        </div>
      </section>
      <aside className="min-w-0 border-t border-neutral-300 pt-5 dark:border-neutral-700 sm:pt-7">
        <MyOrdersPage compact />
      </aside>
    </div>
    <div className="flex justify-end border-t border-neutral-300 pt-5 dark:border-neutral-700">
      <button className="inline-flex items-center gap-2 border border-neutral-300 px-4 py-2.5 text-[9px] font-semibold tracking-[.08em] text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white" type="button" onClick={handleLogout} disabled={busy}><LogoutIcon fontSize="small" /> LOG OUT</button>
    </div>
  </div>;
}
