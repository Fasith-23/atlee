import React, { useState } from "react";

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(selectedFiles);
  };

  const handleFiles = async (fileList: File[]) => {
    // Filter only PDFs
    const pdfFiles = fileList.filter((file) => file.type === "application/pdf");

    if (pdfFiles.length === 0) {
      alert("Only PDF files are allowed.");
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
    await uploadFilesToBackend(pdfFiles);
  };

  const uploadFilesToBackend = async (fileList: File[]) => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file); // FastAPI expects "files"
    });

    setUploading(true);

    try {
      const response = await fetch("http://127.0.0.1:5001/analysis/get-metrics", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Response from backend:", data);
        alert(`Files uploaded successfully: ${data.files.join(", ")}`);
      } else {
        const error = await response.json();
        console.error("Error from backend:", error);
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("An error occurred while uploading files.");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <div
        className="w-full bg-gray-800 p-6 rounded-lg shadow-lg"
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg py-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-gray-500 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v8m4-4H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-400">Drop File Here</p>
          <p className="text-gray-400">- or -</p>
          <label
            htmlFor="fileInput"
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Click to Upload
          </label>
          <input
            id="fileInput"
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      </div>
      <div className="mt-4">
        {uploading && (
          <p className="text-gray-400 text-center">Uploading files...</p>
        )}
        <ul className="mt-4 space-y-2">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-700 p-2 rounded"
            >
              <span className="text-gray-300">{file.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
