
import { PERFUMES, TRANSLATIONS, CONTACT_INFO } from '../constants';

/**
 * GOOGLE APPS SCRIPT SETUP:
 * 1. Paste the Code.gs content in your Google Sheet script editor.
 * 2. Deploy as Web App, set access to "Anyone".
 * 3. Copy the full "Web App URL" and ensure it is pasted in SHEET_API_URL below.
 */

const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzIuVBhNwhEhLw-zRxJ8ODNJY7nb30m1Re6YXXsi-B9HKY-9_nrBsv5h9zOpvNh-CM/exec'; 

export const dataService = {
  async getSiteData() {
    // Check if the URL is still the default placeholder or empty
    if (!SHEET_API_URL || SHEET_API_URL.includes('PASTE_YOUR_URL_HERE')) {
      console.warn("SHEET_API_URL is not configured. Using local constants.");
      return { perfumes: PERFUMES, translations: TRANSLATIONS, contacts: CONTACT_INFO };
    }

    try {
      const response = await fetch(SHEET_API_URL);
      if (!response.ok) throw new Error("Fetch failed");
      const data = await response.json();
      
      // If the sheet is empty or has no perfumes, return defaults
      if (!data || !data.perfumes || data.perfumes.length === 0) {
        console.log("Sheet is empty, using default content.");
        return { perfumes: PERFUMES, translations: TRANSLATIONS, contacts: CONTACT_INFO };
      }

      return data;
    } catch (error) {
      console.error("Data Load Error (Falling back to defaults):", error);
      return { perfumes: PERFUMES, translations: TRANSLATIONS, contacts: CONTACT_INFO };
    }
  },

  async updateSiteData(data: { perfumes: any, translations: any, contacts: any }) {
    if (!SHEET_API_URL || SHEET_API_URL.includes('PASTE_YOUR_URL_HERE')) {
      alert("Please configure the SHEET_API_URL in services/dataService.ts");
      return { status: 'error' };
    }

    try {
      // POST to Apps Script using no-cors to avoid redirect issues
      await fetch(SHEET_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // Update session storage for immediate UI refresh across components
      sessionStorage.setItem('perfumes', JSON.stringify(data.perfumes));
      sessionStorage.setItem('translations', JSON.stringify(data.translations));
      sessionStorage.setItem('contacts', JSON.stringify(data.contacts));
      
      return { status: 'success' };
    } catch (error) {
      console.error("Sync Error:", error);
      throw error;
    }
  }
};
