import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis,Legend, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Data {
  TS: number;
  ESG: number[];
  Risk: number;
  ROI: number;
  Pdf: string;
}

interface BarChartProps {
  data: Data[];
}

const CustomBarChart: React.FC<BarChartProps> = ({ data }) => {
  const [selectedItem, setSelectedItem] = useState<Data | null>(null); // Track the selected item

  // Format data into the structure required for the BarChart
  const chartData = data.map((item) => ({
    TS: item.TS,
    Risk: item.Risk,
    ROI: item.ROI,
    Pdf: item.Pdf,
    ESG1: item.ESG[0], // First ESG value
    ESG2: item.ESG[1], // Second ESG value
    ESG3: item.ESG[2], // Third ESG value
  }));

  // Handle bar click to select an item
  const handleBarClick = (state: { activePayload?: { payload: Data }[] }) => {
    const activePayload = state.activePayload;

    // Safely check if activePayload exists and has data
    if (activePayload && activePayload[0]?.payload) {
      const clickedItem = activePayload[0].payload;
      const selectedData = data.find(item => item.TS === clickedItem.TS);
      setSelectedItem(selectedData || null);
    }
  };

  // Reset to the main chart
  const resetChart = () => {
    setSelectedItem(null); // Clear the selected item
  };

  // If an item is selected, show the horizontal bar chart with ESG values and display ROI/Risk
  if (selectedItem) {
    const esgData = [
      { name: 'Title', value: selectedItem.Pdf},
      { name: 'E', value: selectedItem.ESG[0] },
      { name: 'S', value: selectedItem.ESG[1] },
      { name: 'G', value: selectedItem.ESG[2] },
    ];

    return (
      <div className='w-full '>
        <button
          onClick={resetChart}
          className="px-4  bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Main Chart
        </button>
        <div className="flex flex-row justify-normal ">
          {/* Horizontal Bar Chart */}
          
            <ResponsiveContainer width="80%" style={{marginLeft:'2rem', marginBottom:'2rem', padding:'0.25rem'}} height={200} className={'bg-white rounded-lg shadow px-16 text-center w-full'}>
              <BarChart layout="vertical" data={esgData}>
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis type="number" domain={[0, 10]} />

                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d">
                  {esgData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.name === 'E' ? '#8884d8' : entry.name === 'S' ? '#ff7300' : '#ff0000'}
                    />
                  ))}
                </Bar>
                <text
                  x={550} 
                  y={20} 
                  textAnchor="middle" 
                  fontSize={24} 
                  fontWeight="bold" 
                  fill="#333"
                >
                  {esgData[0].value}
                </text>
              </BarChart>
            </ResponsiveContainer>
          
          {/* ROI and Risk Display */}
          <div  style={{ fontSize: '2rem', marginLeft: '5rem',  marginRight: '5rem' }} className=" flex flex-col items-center ml-20 justify-center ">
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem', width: '12rem'}} className="bg-white rounded-lg shadow px-16 text-center w-full">ROI
            <div style={{ fontSize: '2rem'}} className=" text-center ">{selectedItem.ROI}</div> </div>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }} className="bbg-white rounded-lg shadow px-16 text-center w-full">Risk
            <div style={{ fontSize: '2rem'}} className=" text-center ">{selectedItem.Risk}</div> </div>
          </div>
        </div>
      </div>
    );
  }

  // If no item is selected, show the main bar chart
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} onClick={handleBarClick}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Pdf" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Risk" fill="#8884d8" name="Risk" />
        <Bar dataKey="ROI" fill="#82ca9d" name="ROI" />
        <Bar dataKey="TS" fill="#ff7300" name="Total Score" />
        <text
      x={700} 
      y={20} 
      textAnchor="middle" 
      fontSize={24} 
      fontWeight="bold" 
      fill="#333"
    >
      Predicted ESG Metrics
    </text>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;
