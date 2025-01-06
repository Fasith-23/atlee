"use client";
import Analyse from "./components/analyse";


export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] p-8">
      
        {/* Drag-and-Drop File Upload */}
        <div className="mb-6 w-full">
          <div className="text-xl text-center font-black mb-4">ATLEE</div>
          <Analyse />
        </div>
        
        
      
    </div>
  );
}
