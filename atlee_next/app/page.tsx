"use client";
import FileUpload from "./components/fileUpload";

export default function Home() {
  // const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  // const [uploading, setUploading] = useState(false);

  // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setSelectedFiles(e.target.files);
  // };

  // const handleUpload = async () => {
  //   if (!selectedFiles || selectedFiles.length === 0) {
  //     alert("Please select at least one PDF file.");
  //     return;
  //   }

  //   setUploading(true);
  //   const formData = new FormData();

  //   Array.from(selectedFiles).forEach((file) => {
  //     formData.append("files", file);
  //   });

  //   try {
  //     const response = await fetch("http://127.0.0.1:5001/analysis/get-metrics", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log("Response:", data);
  //       alert("Files uploaded successfully: " + data.files.join(", "));
  //     } else {
  //       const error = await response.json();
  //       console.error("Error:", error);
  //       alert(`Error: ${error.detail}`);
  //     }
  //   } catch (error) {
  //     console.error("Upload failed:", error);
  //     alert("An error occurred while uploading files.");
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Upload PDF Files</h1>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        {/* Drag-and-Drop File Upload */}
        <div className="mb-6">
          <FileUpload />
        </div>

        
      </div>
    </div>
  );
}
