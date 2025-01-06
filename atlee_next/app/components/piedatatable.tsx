// PieDataTable.tsx
import React from "react";

// Define the structure of PieData
interface PieData {
  TS: number;
  ESG: number[];
  Risk: number;
  ROI: number;
  Pdf: string;
}

interface PieDataTableProps {
  pieData: PieData[]; // Array of PieData to display in the table
}

const PieDataTable: React.FC<PieDataTableProps> = ({ pieData }) => {
  return (
    <div className="mb-6">
      <h3 className="text-center">Pie Data Table</h3>
      <table
        border={1}
        style={{
          width: "100%",
          textAlign: "left",
          borderCollapse: "collapse",
          border: "1px solid #dcdcdc", // Faint solid border for table
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #dcdcdc", padding: "8px" }}>Pdf</th>
            <th style={{ border: "1px solid #dcdcdc", padding: "8px" }}>Risk</th>
            <th style={{ border: "1px solid #dcdcdc", padding: "8px" }}>ROI</th>
          </tr>
        </thead>
        <tbody>
          {pieData.map((data, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #dcdcdc", padding: "8px" }}>{data.Pdf}</td>
              <td style={{ border: "1px solid #dcdcdc", padding: "8px" }}>{data.Risk}</td>
              <td style={{ border: "1px solid #dcdcdc", padding: "8px" }}>{data.ROI}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PieDataTable;
