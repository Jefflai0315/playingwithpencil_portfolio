/**
 * Utility functions for handling form submissions
 */

/**
 * Submits form data to Google Sheets via a Google Apps Script web app
 * @param {Object} formData - The form data to submit
 * @param {string} scriptUrl - The URL of the Google Apps Script web app
 * @returns {Promise} - A promise that resolves when the submission is complete
 */
export const submitToGoogleSheets = async (formData, scriptUrl) => {
  try {
    // Format the data as needed for your Google Sheet
    const payload = {
      name: formData.name,
      email: formData.email,
      mobileNumber: formData.mobileNumber || "Not provided",
      message: formData.message,
      hasPhotos: formData.photos && formData.photos.length > 0 ? "Yes" : "No",
      photoCount: formData.photos ? formData.photos.length : 0,
      timestamp: new Date().toISOString(),
    };

    // Make the request to the Google Apps Script web app
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to submit to Google Sheets");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Google Sheets submission error:", error);
    throw error;
  }
};

/**
 * Sends form data via email using EmailJS or similar service
 * @param {Object} formData - The form data to submit
 * @returns {Promise} - A promise that resolves when the email is sent
 */
export const sendViaEmail = async (formData) => {
  try {
    // NOTE: You will need to set up an email service like EmailJS
    // This is a placeholder implementation

    // Example using EmailJS
    // First, install EmailJS: npm install @emailjs/browser

    // import emailjs from '@emailjs/browser';

    // const serviceId = 'YOUR_EMAILJS_SERVICE_ID';
    // const templateId = 'YOUR_EMAILJS_TEMPLATE_ID';
    // const userId = 'YOUR_EMAILJS_USER_ID';

    // const templateParams = {
    //   name: formData.name,
    //   email: formData.email,
    //   mobile: formData.mobileNumber || 'Not provided',
    //   message: formData.message,
    //   hasPhotos: formData.photos && formData.photos.length > 0 ? 'Yes' : 'No'
    // };

    // const result = await emailjs.send(serviceId, templateId, templateParams, userId);
    // return result;

    // For now, just log the data and return a mock success
    console.log("Email would be sent with:", formData);
    return { status: 200, text: "Email sent successfully" };
  } catch (error) {
    console.error("Email submission error:", error);
    throw error;
  }
};

/**
 * Processes files for submission
 * @param {File[]} files - Array of file objects
 * @returns {Promise<Object>} - Object containing processed files data
 */
export const processFiles = async (files) => {
  // This function would handle file uploads to a server or cloud storage
  // For now, it's a placeholder that returns the files count

  return {
    count: files.length,
    // You could return URLs, IDs, or other information here
  };
};

/**
 * Creates a Google Apps Script to receive form submissions
 *
 * NOTE: This is not a function, but a code example to create a Google Apps Script
 * that will receive form submissions and add them to a Google Sheet.
 *
 * Here's what you should do:
 * 1. Go to https://script.google.com/
 * 2. Create a new project
 * 3. Paste the following code into the editor:
 *
 * function doPost(e) {
 *   try {
 *     // Parse the incoming JSON data
 *     var data = JSON.parse(e.postData.contents);
 *
 *     // Get the active spreadsheet and sheet
 *     var ss = SpreadsheetApp.getActiveSpreadsheet();
 *     var sheet = ss.getSheetByName("Commissions") || ss.insertSheet("Commissions");
 *
 *     // Set up headers if they don't exist
 *     if (sheet.getLastRow() === 0) {
 *       sheet.appendRow([
 *         "Timestamp", "Name", "Email", "Mobile Number",
 *         "Message", "Has Photos", "Photo Count"
 *       ]);
 *     }
 *
 *     // Append the data to the sheet
 *     sheet.appendRow([
 *       data.timestamp,
 *       data.name,
 *       data.email,
 *       data.mobileNumber,
 *       data.message,
 *       data.hasPhotos,
 *       data.photoCount
 *     ]);
 *
 *     // Return success
 *     return ContentService.createTextOutput(JSON.stringify({
 *       'result': 'success',
 *       'message': 'Data added to spreadsheet'
 *     }))
 *     .setMimeType(ContentService.MimeType.JSON);
 *   } catch (error) {
 *     // Return error
 *     return ContentService.createTextOutput(JSON.stringify({
 *       'result': 'error',
 *       'message': error.toString()
 *     }))
 *     .setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 *
 * 4. Deploy as a web app:
 *    - Click on Deploy > New deployment
 *    - Select "Web app" as the type
 *    - Set "Who has access" to "Anyone"
 *    - Click "Deploy"
 *    - Copy the web app URL and use it in your React app
 */
