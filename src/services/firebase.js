import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, EmailAuthProvider, linkWithCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, onSnapshot, query, where, runTransaction, serverTimestamp, deleteField } from 'firebase/firestore';

const config = {
   apiKey: "AIzaSyBRJKc3Hzv_m9CgBZ7fg2jHVE9Hqdsn7Rk",
  authDomain: "kyreons.firebaseapp.com",
  projectId: "kyreons",
  storageBucket: "kyreons.firebasestorage.app",
  messagingSenderId: "151194078863",
  appId: "1:151194078863:web:75369211ec61724dffaafa",
  measurementId: "G-CJJ58TLKYJ"
};

const requiredConfig = ['apiKey', 'authDomain', 'projectId', 'appId'];
export const isFirebaseConfigured = requiredConfig.every((key) => Boolean(config[key]));

let auth;
let db;
let authPersistence;
function getFirebase() {
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* values to your environment.');
  const app = getApps()[0] || initializeApp(config);
  auth ||= getAuth(app);
  authPersistence ||= setPersistence(auth, browserLocalPersistence);
  db ||= getFirestore(app);
  return { auth, db };
}

async function ensureLocalAuthPersistence() {
  getFirebase();
  await authPersistence;
}

async function getCustomer() {
  const { auth: firebaseAuth } = getFirebase();
  await ensureLocalAuthPersistence();
  await firebaseAuth.authStateReady();
  return firebaseAuth.currentUser || (await signInAnonymously(firebaseAuth)).user;
}

export async function saveOrder(order) {
  const { db: firestore } = getFirebase();
  const customer = await getCustomer();
  const ref = await addDoc(collection(firestore, 'orders'), {
    ...order,
    email: order.email || customer.email || order.customer?.email || '',
    userId: customer.uid,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, uid: customer.uid };
}

export async function saveNewsletterEmail(email) {
  const { db: firestore } = getFirebase();
  const normalizedEmail = email.trim().toLowerCase();
  await setDoc(doc(firestore, 'newsletterSubscribers', normalizedEmail), {
    email: normalizedEmail,
    createdAt: serverTimestamp(),
  });
}

export async function getMyOrders() {
  const { db: firestore } = getFirebase();
  const customer = await getCustomer();
  const ordersQuery = query(collection(firestore, 'orders'), where('userId', '==', customer.uid));
  const snapshot = await getDocs(ordersQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
}

export function watchMyOrders(onOrders, onError) {
  let active = true;
  let unsubscribe = () => {};
  getCustomer()
    .then((customer) => {
      if (!active) return;
      const ordersQuery = query(collection(db, 'orders'), where('userId', '==', customer.uid));
      unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
        const orders = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        onOrders(orders);
      }, onError);
    })
    .catch(onError);
  return () => {
    active = false;
    unsubscribe();
  };
}

export function watchAuthUser(callback) {
  const { auth: firebaseAuth } = getFirebase();
  let active = true;
  let unsubscribe = () => {};
  ensureLocalAuthPersistence()
    .then(() => {
      if (active) unsubscribe = onAuthStateChanged(firebaseAuth, callback);
    })
    .catch((error) => {
      if (active) console.error('Could not enable persistent sign-in:', error);
    });
  return () => {
    active = false;
    unsubscribe();
  };
}

export async function createAccount(email, password) {
  const { auth: firebaseAuth } = getFirebase();
  await ensureLocalAuthPersistence();
  await firebaseAuth.authStateReady();
  const credential = EmailAuthProvider.credential(email.trim(), password);
  if (firebaseAuth.currentUser?.isAnonymous) {
    return (await linkWithCredential(firebaseAuth.currentUser, credential)).user;
  }
  return (await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password)).user;
}

export async function loginAccount(email, password) {
  const { auth: firebaseAuth } = getFirebase();
  await ensureLocalAuthPersistence();
  await firebaseAuth.authStateReady();
  return (await signInWithEmailAndPassword(firebaseAuth, email.trim(), password)).user;
}

export async function logoutAccount() {
  const { auth: firebaseAuth } = getFirebase();
  await ensureLocalAuthPersistence();
  await signOut(firebaseAuth);
}

function getProfileDocumentId(email, uid) {
  // UID based paths avoid email casing mismatches between Auth tokens and
  // normalized document IDs, and keep the document private to its owner.
  return uid;
}

async function getLegacyCustomerProfile(firestore, uid, emailId) {
  if (emailId === uid) return {};
  const legacySnapshot = await getDoc(doc(firestore, 'customerProfiles', uid));
  return legacySnapshot.exists() ? legacySnapshot.data() : {};
}

export async function getCustomerProfile(uid, email) {
  const { db: firestore } = getFirebase();
  const emailId = getProfileDocumentId(email, uid);
  const snapshot = await getDoc(doc(firestore, 'customerProfiles', emailId));
  if (!snapshot.exists() && emailId !== uid) {
    const legacySnapshot = await getDoc(doc(firestore, 'customerProfiles', uid));
    return legacySnapshot.exists() ? legacySnapshot.data() : null;
  }
  return snapshot.exists() ? snapshot.data() : null;
}

export async function saveCustomerProfile(uid, profile, email) {
  const { db: firestore } = getFirebase();
  const emailId = getProfileDocumentId(email, uid);
  const legacyProfile = await getLegacyCustomerProfile(firestore, uid, emailId);
  await setDoc(doc(firestore, 'customerProfiles', emailId), {
    ...legacyProfile,
    ...profile,
    userId: deleteField(),
    email: email?.trim().toLowerCase() || '',
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function getCustomerCart(uid, email) {
  const { db: firestore } = getFirebase();
  const emailId = getProfileDocumentId(email, uid);
  let snapshot = await getDoc(doc(firestore, 'customerProfiles', emailId));
  if (!snapshot.exists() && emailId !== uid) snapshot = await getDoc(doc(firestore, 'customerProfiles', uid));
  return snapshot.exists() && Array.isArray(snapshot.data().cart) ? snapshot.data().cart : null;
}

export async function saveCustomerCart(uid, email, cart) {
  const { db: firestore } = getFirebase();
  const emailId = getProfileDocumentId(email, uid);
  const legacyProfile = await getLegacyCustomerProfile(firestore, uid, emailId);
  await setDoc(doc(firestore, 'customerProfiles', emailId), {
    ...legacyProfile,
    userId: deleteField(),
    email: email?.trim().toLowerCase() || '',
    cart,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function getSignedInAccount() {
  const { auth: firebaseAuth } = getFirebase();
  await ensureLocalAuthPersistence();
  await firebaseAuth.authStateReady();
  const user = firebaseAuth.currentUser;
  return user && !user.isAnonymous ? user : null;
}

export async function getProductReviews(productId) {
  const { db: firestore } = getFirebase();
  const snapshot = await getDocs(collection(firestore, 'review', String(productId), 'reviews'));
  return snapshot.docs
    .map((reviewDoc) => ({ id: reviewDoc.id, ...reviewDoc.data() }))
    .sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() ?? Date.parse(a.date || '') ?? 0;
      const bTime = b.createdAt?.toMillis?.() ?? Date.parse(b.date || '') ?? 0;
      return bTime - aTime;
    });
}

export async function addProductReview(productId, { rating, comment = '' }) {
  const { db: firestore } = getFirebase();
  const user = await getSignedInAccount();
  if (!user) throw new Error('Please log in to leave a review.');

  let profile = null;
  try {
    profile = await getCustomerProfile(user.uid, user.email);
  } catch {
    // The account name and email remain valid fallbacks if the profile is unavailable.
  }
  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ').trim();
  const name = fullName || profile?.name || user.displayName || user.email?.split('@')[0] || 'Customer';
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const ref = await addDoc(collection(firestore, 'review', String(productId), 'reviews'), {
    userId: user.uid,
    name: String(name).slice(0, 80),
    rating: Number(rating),
    comment: String(comment).trim(),
    date: today,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, userId: user.uid, name, rating: Number(rating), comment: String(comment).trim(), date: today };
}

function getWishlistDocumentId(email, uid) {
  return uid;
}

export async function getCustomerWishlist(uid, email) {
  const { db: firestore } = getFirebase();
  const emailId = getWishlistDocumentId(email, uid);
  const snapshot = await getDoc(doc(firestore, 'customerWishlists', emailId));
  if (!snapshot.exists() && emailId !== uid) {
    const legacySnapshot = await getDoc(doc(firestore, 'customerWishlists', uid));
    return legacySnapshot.exists() && Array.isArray(legacySnapshot.data().productIds) ? legacySnapshot.data().productIds : [];
  }
  return snapshot.exists() && Array.isArray(snapshot.data().productIds) ? snapshot.data().productIds : [];
}

export async function toggleCustomerWishlist(uid, email, productId) {
  const { db: firestore } = getFirebase();
  const emailId = getWishlistDocumentId(email, uid);
  const wishlistRef = doc(firestore, 'customerWishlists', emailId);
  return runTransaction(firestore, async (transaction) => {
    const snapshot = await transaction.get(wishlistRef);
    let source = snapshot;
    if (!snapshot.exists() && emailId !== uid) {
      source = await transaction.get(doc(firestore, 'customerWishlists', uid));
    }
    const current = source.exists() && Array.isArray(source.data().productIds) ? source.data().productIds : [];
    const next = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId];
    transaction.set(wishlistRef, {
      productIds: next,
      updatedAt: serverTimestamp(),
    });
    return next;
  });
}
