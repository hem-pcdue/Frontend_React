import axios from 'axios';

// Get the base URL from environment variables
// in src/api/reportService.js
const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/generate-report`;

/**
 * Uploads files to the backend and initiates report generation.
 * @param {File} docxFile - The .docx template file.
 * @param {File[]} jsonFiles - An array of .json specification files.
 * @param {File} excelFile - The .xlsx project data file.
 * @returns {Promise<Blob>} A promise that resolves with the generated report file as a Blob.
 */
export const generateReport = async (docxFile, jsonFiles, excelFile) => {
  const formData = new FormData();

  // The backend code iterates through all files, so the keys don't have to be unique,
  // but giving them descriptive names is good practice.
  formData.append('template', docxFile, docxFile.name);
  formData.append('data', excelFile, excelFile.name);
  jsonFiles.forEach((file, index) => {
    formData.append(`spec_${index}`, file, file.name);
  });

  try {
    const response = await axios.post(API_URL, formData, {
      // This is crucial: we expect a file (blob) back from the server
      responseType: 'blob',
      headers: {
        // Axios will automatically set the 'Content-Type' to 'multipart/form-data'
        // when you pass a FormData object.
      },
    });
    return response.data;
  } catch (error) {
    // If the server returns a JSON error, it will be in the error response blob.
    // We need to parse it to get the message.
    if (error.response && error.response.data) {
      const errorBlob = error.response.data;
      const errorText = await errorBlob.text();
      try {
        const errorJson = JSON.parse(errorText);
        // Re-throw a new error with the server's message
        throw new Error(errorJson.error || 'An unknown error occurred during upload.');
      } catch (parseError) {
         // If the error response wasn't JSON, throw a generic message.
         throw new Error('Failed to generate report. The server returned an invalid error response.');
      }
    }
    // Handle network errors or other issues
    throw new Error('Network error or server is not responding.');
  }
};