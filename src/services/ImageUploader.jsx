import React, { useRef, useState } from 'react';
import { Button } from '../components/UI';

const ImageUploader = ({ onUpload }) => {
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "smartmall-images"); // your preset name
    data.append("cloud_name", "drsskhom5");    // your Cloudinary cloud name    // Replace this

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/drsskhom5/image/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      onUpload(result.secure_url); // send the image URL to parent
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        ref={fileInputRef}
        className="hidden"
      />

      <button type='button' onClick={triggerFileInput} disabled={uploading}
      className='px-4 py-2 rounded-md font-medium transition-colors cursor-pointer border border-blue-600 text-blue-600 hover:bg-blue-50'>
        {uploading ? "Uploading..." : "Select Image"}
      </button>
    </div>
  );
};

export default ImageUploader;

