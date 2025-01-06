import React, { useState, useRef } from "react";
import BarChart from "./barchart";// Import the custom bar chart
import MapChart from "./mapchart";
import PieChart from "./piechart";
import PieDataTable from "./piedatatable";

interface ChartData {
  TS: number;
  ESG:number[];
  Risk: number;
  ROI: number;
  Pdf: string;
  
}

interface PieData {
  TS: number;          // Timestamp or identifier
  ESG: number[];       // Array of ESG values
  Risk: number;        // Risk value
  ROI: number;         // ROI value
  Pdf: string;         // PDF identifier or string
}

type PieStructure = [PieData, number][];

const Analyse: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [features, setFeatures] = useState<number[]>([0, 0, 0]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [weightsData, setWeightsData] = useState<PieStructure | null >(null); // Store response from get-weights

  const chartAndMapRef = useRef<HTMLDivElement | null>(null); // Ref for scrolling

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
    const pdfFiles = fileList.filter((file) => file.type === "application/pdf");

    if (pdfFiles.length === 0) {
      alert("Only PDF files are allowed.");
      return;
    }

    await uploadFilesToBackend(pdfFiles);
  };

  const uploadFilesToBackend = async (fileList: File[]) => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file);
    });

    setUploading(true);

    try {
      const response = await fetch("http://127.0.0.1:5001/analysis/get-metrics", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        if (data && data.message) {
          alert("Files ANALYSED successfully!");
        } else {
          alert("No data returned from the backend.");
        }
      } else {
        const error = await response.json();
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

  const handleInputChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = parseFloat(value) || 0; // Ensure value is a number
    setFeatures(newFeatures);
  };

  const handleAnalyse = async () => {
    console.log("Sending data to backend:", features);
  
    try {
      const response = await fetch("http://127.0.0.1:5001/analysis/get-esg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ features }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Backend response:2", data);
        setChartData(data);
      } else {
        console.error("Failed to fetch data. Status:", response.status);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Fetch data from get-weights API
  const handleFetchWeights = async () => {
    try {
      const riskTol = parseFloat(inputValue);

    if (isNaN(riskTol)) {
      alert("Please enter a valid number for risk tolerance.");
      return;
    }

    const response = await fetch("http://127.0.0.1:5001/analysis/get-weights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ risk_tol: riskTol }), // Send risk_tol as a number
    });
      if (response.ok) {
        const data:PieStructure = await response.json();
        console.log("Weights received:", data);
        setWeightsData(data); // Store the weights data
      } else {
        console.error("Error fetching weights:", response.statusText);
        alert("Failed to fetch weights.");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("An error occurred while fetching weights.");
    }
  };
  
  const piestructData = weightsData?.map(item => item[1]) || [];
  const pieData2 = weightsData?.map(item => item[0]) || [];
  return (
    <div>
      {/* File Upload and ESG Features Section */}
      <div className="flex flex-row justify-evenly">
        {/* File Upload Section */}
        <div
          className="bg-white rounded-lg shadow p-6 mb-6 w-full"
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
        >
          <h2 className="text-lg font-semibold mb-4 text-center">UPLOAD PDF FILES FOR ANALYSIS</h2>
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
            <p className="text-sm mt-2">Drop File Here</p>
            <p className="text-gray-400 text-sm mt-2">- or -</p>
            <label
              htmlFor="fileInput"
              className="text-blue-500 cursor-pointer text-sm mt-2 hover:underline"
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

        {/* ESG Features Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 w-1/2">
          <div className="mb-4 justify-between">
            {["Environment", "Social", "Governance"].map((feature, index) => (
              <div key={feature} className="flex flex-col items-center">
                <label htmlFor={`${feature}`} className="text-sm font-semibold mb-2">
                  {feature}
                </label>
                <input
                  id={`feature-${feature}`}
                  type="number"
                  placeholder="Enter value"
                  className="rounded-md p-2 bg-gray-100 text-center w-full"
                  value={features[index]} // Controlled input
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
              onClick={handleAnalyse}
            >
              Calculate
            </button>
          </div>
        </div>
      </div>

      {/* Loading Spinner */}
      {uploading && (
        <div className="flex justify-center mt-4">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-blue-600"></div>
        </div>
      )}

      {/* Chart and Map Section - Initially below but scrolls into view after Analyse */}
      {/* Chart and Map Section - Initially below but scrolls into view after Analyse */}
      <div
        className="bg-white rounded-lg shadow p-6 mb-6 grid grid-cols-2 gap-4"
        ref={chartAndMapRef} // Reference for scrolling
      >
        <div className="flex items-center justify-center bg-white rounded-lg shadow mb-6">
          <BarChart data={chartData}/>
        </div>
        <div className="flex bg-white rounded-lg shadow p-6 mb-6 w-full">
        <h3 className="text-lg font-semibold p-2">Risk Tolerance</h3>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputValueChange}
          className="p-2 border-2 w-full  border-gray-300 rounded-md"
          placeholder="Enter Risk Tolerance"
        />
        <button
          onClick={handleFetchWeights}
          style={{marginLeft:'1rem'}}
          className="ml-4 bg-black text-white p-2 rounded-md hover:bg-gray-800"
        >
          Get Weights
        </button>

        {/* Display received weights data */}
        
      </div>
      {weightsData ? (
        <div className="flex items-center justify-center">
        
          <div className="bg-white rounded-lg shadow p-6 mb-6"> 
          <PieDataTable pieData={pieData2} />
            
          <PieChart data={piestructData} />
            </div>
            <MapChart />
         
        </div>
         ) : (
          <p className="text-gray-500 text-center">No data to display. Fetch weights to view the map and charts.</p>
        )}
      </div>
    </div>
  );
};

export default Analyse;
