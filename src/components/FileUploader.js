import React, { useRef } from 'react';

// A simple reusable file uploader component
export const FileUploader = ({ label, onFileSelect, acceptedFiles, selectedFile, selectedFiles, multiple = false, icon }) => {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    if (multiple) {
      onFileSelect(Array.from(e.target.files));
    } else {
      onFileSelect(e.target.files[0] || null);
    }
  };

  const getDisplayValue = () => {
    if (multiple) {
        if (selectedFiles && selectedFiles.length > 0) {
            return `${selectedFiles.length} file(s) chosen`;
        }
    } else {
        if (selectedFile) {
            return selectedFile.name;
        }
    }
    return "No file chosen";
  };

  return (
    <div className="file-uploader">
      <label>{label}</label>
      <div className="file-input-wrapper">
        <span className="input-icon">{icon}</span>
        <button type="button" className="choose-file-button" onClick={() => inputRef.current?.click()}>
            {multiple ? "Choose Files" : "Choose File"}
        </button>
        <span className="file-name">{getDisplayValue()}</span>
        <input
          ref={inputRef}
          type="file"
          accept={acceptedFiles}
          onChange={handleFileChange}
          multiple={multiple}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};