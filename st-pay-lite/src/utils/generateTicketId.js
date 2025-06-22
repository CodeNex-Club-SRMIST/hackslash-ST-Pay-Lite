import firebaseService from './firebase';

const generateTicketId = async () => {
  const maxAttempts = 100;
  const usedIds = new Set();
  let attempts = 0;

  while (attempts < maxAttempts) {
    // Generate a 4-digit number (0000–9999)
    const numericId = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    if (usedIds.has(numericId)) {
      attempts++;
      continue;
    }

    try {
      // Ensure ticketId is a string
      const ticketId = numericId;
      const existingTicket = await firebaseService.getTicketById(ticketId);
      if (!existingTicket) {
        return ticketId; // Unique ID found
      }
      usedIds.add(ticketId);
      attempts++;
    } catch (error) {
      console.error('Error checking ticket ID:', error);
      throw new Error('Failed to verify ticket ID uniqueness: ' + error.message);
    }
  }

  throw new Error('All 4-digit ticket IDs (0000–9999) are in use. Please clear old tickets in Firestore.');
};

export default generateTicketId;