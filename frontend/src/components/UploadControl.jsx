import React, { useRef } from 'react';
import './UploadControl.css';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function UploadControl({ imageName, onImageSelected, onClear }) {
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      // Non-image (PDF/doc) — for now we just record the filename as context;
      // full document text-extraction can be wired in on the backend later.
      onImageSelected({ imageBase64: null, imageMediaType: null, imageName: file.name });
      return;
    }

    const base64 = await fileToBase64(file);
    onImageSelected({ imageBase64: base64, imageMediaType: file.type, imageName: file.name });
  };

  return (
    <div className="upload-control">
      <button type="button" className="upload-control__btn" onClick={() => inputRef.current?.click()}>
        🖼️ Upload Poster/Image or 📄 Doc/PDF
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,application/pdf,text/plain"
        hidden
        onChange={handleFile}
      />
      {imageName && (
        <span className="upload-control__filename">
          {imageName}
          <button type="button" className="upload-control__clear" onClick={onClear} aria-label="Remove file">
            ×
          </button>
        </span>
      )}
    </div>
  );
}
