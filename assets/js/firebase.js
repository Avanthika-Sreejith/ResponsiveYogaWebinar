const firebaseConfig = {
    apiKey: "AIzaSyCVRyZsbLqC6EB8Z57ijQOvhL8TXnqLoAw",
    authDomain: "responsive-yoga-webinar.firebaseapp.com",
    projectId: "responsive-yoga-webinar",
    storageBucket: "responsive-yoga-webinar.firebasestorage.app",
    messagingSenderId: "927472085270",
    appId: "1:927472085270:web:beb6ab633cf22ee87d4837"
  };

let firestoreDb = null;

function initFirebase() {
  if (!firebaseConfig.projectId || typeof window.firebase === 'undefined') {
    return null;
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  firestoreDb = firebase.firestore();
  return firestoreDb;
}

async function saveRegistration(registration) {
  const db = initFirebase();

  if (db) {
    try {
      await db.collection('webinar_registrations').add({
        ...registration,
        createdAt: new Date().toISOString()
      });
      return { success: true, message: 'Registration stored in Firebase.' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Firebase save failed. The form will use local fallback.' };
    }
  }

  const key = 'webinar-registrations';
  const saved = JSON.parse(localStorage.getItem(key) || '[]');
  saved.push({ ...registration, createdAt: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(saved));
  return { success: true, message: 'Registration saved locally. Update Firebase config to enable cloud storage.' };
}

window.firebaseService = { saveRegistration };
