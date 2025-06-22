import { initializeApp, setLogLevel } from 'firebase/app';
import { 
  getFirestore, 
  connectFirestoreEmulator, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

setLogLevel('debug');

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Firebase initialization failed:', error);
  throw new Error('Failed to initialize Firebase. Check configuration.');
}

const db = getFirestore(app);
const auth = getAuth(app);

if (window.location.hostname === 'localhost') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

// Sign in anonymously for local testing
signInAnonymously(auth).catch((error) => {
  console.error('Anonymous sign-in failed:', error);
});

const firebaseService = {
  db,
  auth,

  addTicket: async function (ticket) {
    try {
      if (!ticket.ticketId || !ticket.busId) {
        throw new Error('Invalid ticket data: ticketId and busId are required');
      }
      // Check for existing ticket
      const existingTicket = await this.getTicketById(ticket.ticketId);
      if (existingTicket) {
        throw new Error(`Ticket with ID ${ticket.ticketId} already exists`);
      }
      const newTicket = { ...ticket, createdAt: new Date().toISOString() };
      const docRef = await addDoc(collection(db, 'tickets'), newTicket);
      return { ...newTicket, id: docRef.id };
    } catch (error) {
      console.error('Error adding ticket:', error);
      throw new Error(`Failed to add ticket: ${error.message}`);
    }
  },

  getTickets: async function () {
    try {
      const querySnapshot = await getDocs(collection(db, 'tickets'));
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting tickets:', error);
      throw new Error(`Failed to retrieve tickets: ${error.message}`);
    }
  },

  updateTicket: async function (ticketId, updates) {
    try {
      if (!ticketId) throw new Error('Invalid ticketId');

      const ticketQuery = query(collection(db, 'tickets'), where('ticketId', '==', ticketId));
      const querySnapshot = await getDocs(ticketQuery);

      if (querySnapshot.empty) throw new Error('Ticket not found');

      const ticketDoc = querySnapshot.docs[0];
      const ticketRef = doc(db, 'tickets', ticketDoc.id);
      await updateDoc(ticketRef, { ...updates, updatedAt: new Date().toISOString() });

      return { id: ticketDoc.id, ...ticketDoc.data(), ...updates };
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw new Error(`Failed to update ticket: ${error.message}`);
    }
  },

  getTicketById: async function (ticketId) {
    try {
      if (!ticketId) throw new Error('Invalid ticketId');

      const ticketQuery = query(collection(db, 'tickets'), where('ticketId', '==', ticketId));
      const querySnapshot = await getDocs(ticketQuery);

      if (querySnapshot.empty) return null;

      const ticketDoc = querySnapshot.docs[0];
      return { id: ticketDoc.id, ...ticketDoc.data() };
    } catch (error) {
      console.error('Error getting ticket by ID:', error);
      throw new Error(`Failed to retrieve ticket: ${error.message}`);
    }
  }
};

export default firebaseService;