import React, { useState, useEffect } from 'react';
import './ReportGenerator.css';
import { generateReport } from '../api/reportService';
import { FileUploader } from './FileUploader';

const ReportGenerator = () => {
  const [docxFile, setDocxFile] = useState(null);
  const [jsonFiles, setJsonFiles] = useState([]);
  const [excelFiles, setExcelFiles] = useState([]); // Changed to handle multiple files
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(''); // New state for the download link
  const [reportFileName, setReportFileName] = useState(''); // New state for the filename

  // Effect to clean up the blob URL when the component unmounts or the URL changes
  useEffect(() => {
    return () => {
      if (downloadUrl) {
        window.URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Clear previous download link before starting a new request
    setDownloadUrl(''); 
    setReportFileName('');

    // --- Client-side validation ---
    if (!docxFile || excelFiles.length === 0 || jsonFiles.length === 0) {
      setError('Please upload all required files.');
      return;
    }

    setIsLoading(true);
    try {
      const reportBlob = await generateReport(docxFile, jsonFiles, excelFiles);

      // Create a URL for the blob and store it in state for the download button
      const url = window.URL.createObjectURL(reportBlob);
      const fileName = `Generated_Report_${new Date().toISOString().split('T')[0]}.docx`;
      
      setDownloadUrl(url);
      setReportFileName(fileName);

      // Reset the form fields on success
      setDocxFile(null);
      setJsonFiles([]);
      setExcelFiles([]);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="report-generator-container">
      <header className="app-header">
        <div className="logo">SFRE</div>
        <p>Generatore di rapporti</p>
      </header>
      <main className="main-content">
        <div className="card">
          <div className="card-header">
            <span className="icon-doc"></span>
            <h2>Automated Report Generator</h2>
          </div>
          <p className="description">
            Upload your DOCX template, JSON technical specifications, and Excel project data. The system will generate the final report.
          </p>

          <form onSubmit={handleSubmit}>
            <FileUploader
              label="Upload Report Template (.docx)"
              onFileSelect={(file) => setDocxFile(file)}
              acceptedFiles=".docx"
              selectedFile={docxFile}
              icon="" // Cloud upload icon
            />
            <FileUploader
              label="Upload Technical Specification JSON File(s)"
              onFileSelect={(files) => setJsonFiles(files)}
              acceptedFiles=".json"
              selectedFiles={jsonFiles}
              multiple
              icon="" // Document icon
            />
            <FileUploader
              label="Upload Project Data File(s) (.xlsx)"
              onFileSelect={(files) => setExcelFiles(files)}
              acceptedFiles=".xlsx,.xls"
              selectedFiles={excelFiles}
              multiple // Allow multiple Excel files
              icon="" // Document icon
            />
            
            {error && <p className="error-message">{error}</p>}

            {/* Conditionally render download button after successful generation */}
            {downloadUrl && (
              <div className="download-section">
                <p className="success-message">Report generated successfully!</p>
                <a 
                  href={downloadUrl} 
                  download={reportFileName}
                  className="download-button"
                >
                  <span className="icon-download">📥</span> Download Report
                </a>
              </div>
            )}

            <button type="submit" className="generate-button" disabled={isLoading}>
              {isLoading ? (
                'Generating...'
              ) : (
                <>
                  <span className="icon-sparkle">✨</span> Generate Report
                </>
              )}
            </button>
          </form>
        </div>
      </main>
      <footer className="app-footer">
        <p>© 2025 SFRE Report Gen. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ReportGenerator;