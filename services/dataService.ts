
import { PERFUMES, TRANSLATIONS, CONTACT_INFO } from '../constants';

const MOCK_API_BASE = 'https://jsonplaceholder.typicode.com/posts';

export const dataService = {
  // We simulate fetching the site state from a "database"
  async getSiteData() {
    try {
      // In a real app, this would be one or multiple GET requests
      // Here we simulate a delay and check if we have "cached" session data
      const response = await fetch(`${MOCK_API_BASE}/1`);
      const data = await response.json();
      
      // We check session storage first to simulate "updates" during the current session
      const sessionPerfumes = sessionStorage.getItem('perfumes');
      const sessionTrans = sessionStorage.getItem('translations');
      const sessionContacts = sessionStorage.getItem('contacts');

      return {
        perfumes: sessionPerfumes ? JSON.parse(sessionPerfumes) : PERFUMES,
        translations: sessionTrans ? JSON.parse(sessionTrans) : TRANSLATIONS,
        contacts: sessionContacts ? JSON.parse(sessionContacts) : CONTACT_INFO
      };
    } catch (error) {
      console.error("API Fetch Error:", error);
      return { perfumes: PERFUMES, translations: TRANSLATIONS, contacts: CONTACT_INFO };
    }
  },

  async updateSiteData(data: { perfumes: any, translations: any, contacts: any }) {
    console.log("Posting data to Fake API...", data);
    
    // Simulate a POST request to the fake API
    const response = await fetch(MOCK_API_BASE, {
      method: 'POST',
      body: JSON.stringify({
        title: 'Site Update',
        body: data,
        userId: 1,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    if (!response.ok) throw new Error("Failed to post to API");

    // Since it's a fake API, it doesn't actually save. 
    // We use sessionStorage to simulate "all users" seeing the update in the current session.
    sessionStorage.setItem('perfumes', JSON.stringify(data.perfumes));
    sessionStorage.setItem('translations', JSON.stringify(data.translations));
    sessionStorage.setItem('contacts', JSON.stringify(data.contacts));
    
    return await response.json();
  }
};
