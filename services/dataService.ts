
import { PERFUMES, TRANSLATIONS, CONTACT_INFO } from '../constants';

/**
 * 🚀 HOW TO MAKE DATA APPEAR IN THE SHEET TABLE:
 * 
 * 1. Open your Google Sheet.
 * 2. Go to Extensions -> Apps Script.
 * 3. Paste the code below into Code.gs:
 * 
 * function doGet() {
 *   var scriptProp = PropertiesService.getScriptProperties();
 *   var data = scriptProp.getProperty('siteData');
 *   return ContentService.createTextOutput(data || JSON.stringify({})).setMimeType(ContentService.MimeType.JSON);
 * }
 * 
 * function doPost(e) {
 *   var dataString = e.postData.contents;
 *   var data = JSON.parse(dataString);
 *   var ss = SpreadsheetApp.getActiveSpreadsheet();
 *   
 *   // Save for app retrieval
 *   PropertiesService.getScriptProperties().setProperty('siteData', dataString);
 *   
 *   // Update "Perfumes" sheet visually
 *   var sheet = ss.getSheetByName("Perfumes") || ss.insertSheet("Perfumes");
 *   sheet.clear();
 *   sheet.appendRow(["ID", "Brand", "Name", "Category", "Description", "Image URL"]);
 *   if(data.perfumes) {
 *     data.perfumes.forEach(function(p) {
 *       sheet.appendRow([p.id, p.brand, p.name, p.category, p.description, p.image]);
 *     });
 *   }
 *   
 *   // Update "Contacts" sheet visually
 *   var contactSheet = ss.getSheetByName("Contacts") || ss.insertSheet("Contacts");
 *   contactSheet.clear();
 *   contactSheet.appendRow(["Platform", "Link/Value"]);
 *   if(data.contacts) {
 *     contactSheet.appendRow(["Phone", data.contacts.phone]);
 *     contactSheet.appendRow(["Instagram", data.contacts.instagram]);
 *     contactSheet.appendRow(["Telegram", data.contacts.telegram]);
 *   }
 * 
 *   return ContentService.createTextOutput(JSON.stringify({"status": "success"})).setMimeType(ContentService.MimeType.JSON);
 * }
 * 
 * 4. Click 'Deploy' -> 'New Deployment' -> 'Web App'.
 * 5. Set 'Who has access' to 'Anyone'.
 * 6. Copy the NEW URL and paste it below.
 */

const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbx7YuziVzEBI9NiynYpXNMMou7g_PFELvnzSVIorxa7gdIkYwqbfnBEedCzIE1_l8B2/exec'; 

export const dataService = {
  async getSiteData() {
    if (!SHEET_API_URL) {
      return { perfumes: PERFUMES, translations: TRANSLATIONS, contacts: CONTACT_INFO };
    }

    try {
      const response = await fetch(SHEET_API_URL);
      if (!response.ok) throw new Error("Fetch failed");
      const data = await response.json();
      
      if (!data || !data.perfumes || data.perfumes.length === 0) {
        return { perfumes: PERFUMES, translations: TRANSLATIONS, contacts: CONTACT_INFO };
      }

      return data;
    } catch (error) {
      console.error("Data Load Error:", error);
      return { perfumes: PERFUMES, translations: TRANSLATIONS, contacts: CONTACT_INFO };
    }
  },

  async updateSiteData(data: { perfumes: any, translations: any, contacts: any }) {
    if (!SHEET_API_URL) {
      alert("SHEET_API_URL is missing!");
      return { status: 'error' };
    }

    try {
      // POST to Google Apps Script
      await fetch(SHEET_API_URL, {
        method: 'POST',
        mode: 'no-cors', 
        body: JSON.stringify(data),
      });

      // Update local cache immediately
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
