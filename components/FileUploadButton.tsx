import React, { useRef } from 'react';
import styled from 'styled-components';

type FileUploadButtonProps = {
  label?: string;
  helperText?: string;
  accept?: string;
  multiple?: boolean;
  uploadedCount?: number;
  isUploading?: boolean;
  onFilesSelected?: (files: FileList) => void;
};

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  label = 'Browse files to upload',
  helperText = 'Click to select files',
  accept = 'image/*',
  multiple = true,
  uploadedCount = 0,
  isUploading = false,
  onFilesSelected,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFilesSelected?.(event.target.files);
      event.target.value = '';
    }
  };

  return (
    <StyledWrapper>
      <div className="container" onClick={handleClick}>
        <div className="header">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15"
              stroke="#264143"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p>{label}</p>
          <span className="badge">
            {isUploading ? 'Uploading…' : `${uploadedCount} added`}
          </span>
        </div>
        <button type="button" className="footer" onClick={handleClick}>
          <span>{helperText}</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="#264143"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <input
          id="file"
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
        />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container {
    height: 240px;
    width: 280px;
    border-radius: 16px;
    box-shadow: 4px 4px 30px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    gap: 10px;
    background-color: rgba(38, 65, 67, 0.05);
    border: 1px dashed rgba(38, 65, 67, 0.4);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .container:hover {
    transform: translateY(-2px);
    box-shadow: 6px 6px 30px rgba(0, 0, 0, 0.15);
  }

  .header {
    flex: 1;
    width: 100%;
    border: 2px dashed rgba(38, 65, 67, 0.4);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.8);
    gap: 8px;
    text-align: center;
    padding: 12px;
  }

  .header svg {
    height: 72px;
  }

  .header p {
    text-align: center;
    color: #1f2a2e;
    font-weight: 600;
  }

  .badge {
    font-size: 12px;
    color: #6b7280;
  }

  .footer {
    background-color: rgba(38, 65, 67, 0.08);
    width: 100%;
    min-height: 42px;
    padding: 8px 12px;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #1f2a2e;
    border: none;
    font-weight: 600;
    gap: 8px;
  }

  .footer span {
    flex: 1;
    text-align: left;
  }

  .footer svg {
    height: 20px;
    width: 20px;
  }

  #file {
    display: none;
  }
`;

export default FileUploadButton;