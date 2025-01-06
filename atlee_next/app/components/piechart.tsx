import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";

// Register chart components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

interface PieChartProps {
  data: number[]; // Array of numbers for the pie chart
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  // Prepare data for the Pie chart
  const chartData = {
    labels: data.map((_,i) => `${i} - Weight: ${_}`), // Labels for each section of the pie chart
    datasets: [
      {
        label: "Data Values",
        data: data, // Data for the pie chart
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#FF9F40",
        ], // Different colors for the segments
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="items-center pie-chart-container" style={{ width: "300px", height: "300px" }}>
      <h3 className="text-center">Optimised Weights</h3>
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;
