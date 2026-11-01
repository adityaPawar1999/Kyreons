import { useEffect, useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LogoutIcon from '@mui/icons-material/Logout';
import { getCustomerProfile, logoutAccount, saveCustomerProfile } from '../../services/firebase.js';
import MyOrdersPage from '../orders/MyOrdersPage.jsx';

const emptyProfile = {
  firstName: '', lastName: '', phone: '', address: '', address2: '', city: '', region: '', postalCode: '', country: 'India',
};
const inputClass = 'mt-2 w-full border border-neutral-300 bg-transparent px-3 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 dark:border-neutral-700 dark:text-white dark:focus:border-neutral-300';
const labelClass = 'block text-xs text-neutral-600 dark:text-neutral-300';

export default function ProfilePage({ user }) {
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

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
    try { await logoutAccount(); location.hash = 'account/login'; }
    catch (logoutError) { setError(logoutError.message || 'Could not log out.'); }
    finally { setBusy(false); }
  }

  return <div className="mt-7 grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)]">
  <section className="min-w-0 border border-neutral-200 bg-[var(--bg)] p-5 dark:border-neutral-800 sm:p-8">
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div><h2 className="font-display text-2xl text-neutral-900 dark:text-white">Your details.</h2><p className="mt-1 text-xs text-neutral-500">{user.email}</p></div>
      <button className="inline-flex items-center gap-2 border border-neutral-300 px-3 py-2 text-[9px] font-semibold tracking-[.08em] text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white" type="button" onClick={handleLogout} disabled={busy}><LogoutIcon fontSize="small" /> LOG OUT</button>
    </div>
    {error && <p className="mb-5 text-sm text-rose-700 dark:text-rose-300" role="alert">{error}</p>}
    {notice && <p className="mb-5 border border-lime-300 bg-lime-50 px-4 py-3 text-sm text-neutral-900 dark:border-lime-800 dark:bg-lime-950/40 dark:text-lime-100" role="status">{notice}</p>}
    {loading ? <p className="py-8 text-sm text-neutral-500">Loading your profile…</p> : <form className="space-y-5" onSubmit={handleSave}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>First name<input className={inputClass} name="firstName" autoComplete="given-name" value={profile.firstName || ''} onChange={(event) => setProfile({ ...profile, firstName: event.target.value })} required /></label>
        <label className={labelClass}>Last name<input className={inputClass} name="lastName" autoComplete="family-name" value={profile.lastName || ''} onChange={(event) => setProfile({ ...profile, lastName: event.target.value })} required /></label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>Email address<input className={`${inputClass} opacity-70`} value={user.email || ''} type="email" autoComplete="email" readOnly /></label>
        <label className={labelClass}>Phone number<input className={inputClass} name="phone" type="tel" autoComplete="tel" value={profile.phone || ''} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} required /></label>
      </div>
      <fieldset className="space-y-4 border-t border-neutral-200 pt-5 dark:border-neutral-800"><legend className="mb-1 font-display text-xl text-neutral-900 dark:text-white">Delivery address</legend>
        <label className={labelClass}>Address<input className={inputClass} name="address" autoComplete="address-line1" value={profile.address || ''} onChange={(event) => setProfile({ ...profile, address: event.target.value })} required /></label>
        <label className={labelClass}>Apartment, suite, etc. <span className="text-neutral-400">(optional)</span><input className={inputClass} name="address2" autoComplete="address-line2" value={profile.address2 || ''} onChange={(event) => setProfile({ ...profile, address2: event.target.value })} /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>City<input className={inputClass} name="city" autoComplete="address-level2" value={profile.city || ''} onChange={(event) => setProfile({ ...profile, city: event.target.value })} required /></label>
          <label className={labelClass}>State / region<input className={inputClass} name="region" autoComplete="address-level1" value={profile.region || ''} onChange={(event) => setProfile({ ...profile, region: event.target.value })} required /></label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>Postal code<input className={inputClass} name="postalCode" autoComplete="postal-code" value={profile.postalCode || ''} onChange={(event) => setProfile({ ...profile, postalCode: event.target.value })} required /></label>
          <label className={labelClass}>Country<select className={inputClass} name="country" autoComplete="country-name" value={profile.country || 'India'} onChange={(event) => setProfile({ ...profile, country: event.target.value })} required><option>India</option></select></label>
        </div>
      </fieldset>
      <button className="flex w-full items-center justify-between bg-[#d5ed52] px-5 py-4 text-xs font-bold tracking-[.1em] text-neutral-900 transition-colors hover:bg-[#c4dc42] disabled:opacity-60" disabled={busy}>{busy ? 'SAVING PROFILE…' : 'SAVE PROFILE'}<ArrowForwardIcon /></button>
    </form>}
  </section>
  <MyOrdersPage compact />
  </div>;
}
