from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from app.analysis.analysis_handler import AnalysisHandler
from pydantic import BaseModel

analysis_router = APIRouter()
analysis_handler = AnalysisHandler()

@analysis_router.post("/get-metrics")
async def get_metrics(files: List[UploadFile] = File(...)):
    # Ensure that at least one file is provided
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")
    
    # Filter only PDF files
    pdf_files = [file for file in files if file.content_type == "application/pdf"]

    if not pdf_files:
        raise HTTPException(status_code=400, detail="No PDF files provided")

    metrics= analysis_handler.get_metrics(pdf_files)
    # Process the PDF files (e.g., save to disk, process, etc.)
    
        # Example: Save the file (uncomment to enable)
        # with open(f"uploads/{pdf.filename}", "wb") as f:
        #     f.write(content)

    # print("Received PDF files:", file_names)
    

    return {"message": "PDF files received"}

class FeaturesRequest(BaseModel):
    features: List[float]  # Expecting a list of numbers (float or int)

@analysis_router.post("/get-esg")
async def get_esg(request: FeaturesRequest):
    esg=analysis_handler.get_esg(request.features)
    print("Received features:", request.features)
    return esg

class RiskToleranceRequest(BaseModel):
    risk_tol: float

@analysis_router.post("/get-weights")
async def get_weights(request: RiskToleranceRequest):
    # Extract the risk tolerance value from the request
    risk_tol = request.risk_tol
    
    # Call your analysis handler with the provided risk tolerance
    weights = analysis_handler.get_weights(risk_tol)
    
    return weights
