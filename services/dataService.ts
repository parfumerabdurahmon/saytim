
import { PERFUMES, TRANSLATIONS, CONTACT_INFO } from '../constants';

/**
 * ⚠️ ATTENTION:
 * You do NOT need to click "Add a service" in Google Apps Script.
 * 
 * 1. Just paste the following into the 'Code.gs' editor window in Google Sheets:
 * 
 * function doGet() {
 *   var scriptProp = PropertiesService.getScriptProperties();
 *   var data = scriptProp.getProperty('siteData');
 *   var output = data ? data : JSON.stringify({});
 *   return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JSON);
 * }
 * 
 * function doPost(e) {
 *   var data = e.postData.contents;
 *   var scriptProp = PropertiesService.getScriptProperties();
 *   scriptProp.setProperty('siteData', data);
 *   return ContentService.createTextOutput(JSON.stringify({"status": "success"})).setMimeType(ContentService.MimeType.JSON);
 * }
 * 
 * 2. Click "Deploy" -> "New Deployment" -> "Web App".
 * 3. Set "Who has access" to "Anyone".
 * 4. Copy the URL and paste it below.
 */

// PASTE YOUR GOOGLE WEB APP URL HERE
const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzIuVBhNwhEhLw-zRxJ8ODNJY7nb30m1Re6YXXsi-B9HKY-9_nrBsv5h9zOpvNh-CM/exec'; 

export const dataService = {
  async getSiteData() {
    if (!SHEET_API_URL || SHEET_API_URL === 'https://script.google.com/macros/s/AKfycbzIuVBhNwhEhLw-zRxJ8ODNJY7nb30m1Re6YXXsi-B9HKY-9_nrBsv5h9zOpvNh-CM/exec') {
      console.warn("SHEET_API_URL is empty. Using local constants.");
      return { perfumes: PERFUMES, translations: TRANSLATIONS, contacts: CONTACT_INFO };
    }

    try {
      const response = await fetch(SHEET_API_URL);
      if (!response.ok) throw new Error("Fetch failed");
      const data = await response.json();
      
      if (!data || !data.perfumes) {
        return { perfumes: PERFUMES, translations: TRANSLATIONS, contacts: CONTACT_INFO };
      }

      return data;
    } catch (error) {
      console.error("Data Load Error:", error);
      return { perfumes: PERFUMES, translations: TRANSLATIONS, contacts: CONTACT_INFO };
    }
  },

  async updateSiteData(data: { perfumes: any, translations: any, contacts: any }) {
    if (!SHEET_API_URL || SHEET_API_URL === 'https://script.google.com/macros/s/AKfycbzIuVBhNwhEhLw-zRxJ8ODNJY7nb30m1Re6YXXsi-B9HKY-9_nrBsv5h9zOpvNh-CM/exec') {
      alert("Please paste your Google Web App URL into services/dataService.ts");
      return { status: 'error' };
    }

    try {
      await fetch(SHEET_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

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
