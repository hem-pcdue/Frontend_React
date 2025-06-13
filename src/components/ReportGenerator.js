import React, { useState } from 'react';
import './ReportGenerator.css';
import { generateReport } from '../api/reportService';
import { FileUploader } from './FileUploader'; // We'll create this sub-component next

const ReportGenerator = () => {
  const [docxFile, setDocxFile] = useState(null);
  const [jsonFiles, setJsonFiles] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // --- Client-side validation ---
    if (!docxFile || !excelFile || jsonFiles.length === 0) {
      setError('Please upload all required files.');
      return;
    }

    setIsLoading(true);
    try {
      const reportBlob = await generateReport(docxFile, jsonFiles, excelFile);

      // Create a link to download the file
      const url = window.URL.createObjectURL(reportBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      // The backend suggests a filename, but we can set a fallback.
      a.download = `Generated_Report_${new Date().toISOString().split('T')[0]}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      // Optionally reset the form
      setDocxFile(null);
      setJsonFiles([]);
      setExcelFile(null);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="report-generator-container">
      <header className="app-header">
        {/* You can replace this with an <img> tag if you have a logo file */}
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
              label="Upload Project Data File (.xlsx)"
              onFileSelect={(file) => setExcelFile(file)}
              acceptedFiles=".xlsx,.xls"
              selectedFile={excelFile}
              icon="" // Document icon
            />
            
            {error && <p className="error-message">{error}</p>}

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