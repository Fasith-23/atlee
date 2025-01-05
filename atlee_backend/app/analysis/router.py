from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List

analysis_router = APIRouter()

@analysis_router.post("/get-metrics")
async def get_metrics(files: List[UploadFile] = File(...)):
    # Ensure that at least one file is provided
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")
    
    # Filter only PDF files
    pdf_files = [file for file in files if file.content_type == "application/pdf"]

    if not pdf_files:
        raise HTTPException(status_code=400, detail="No PDF files provided")

    # Process the PDF files (e.g., save to disk, process, etc.)
    file_names = []
    for pdf in pdf_files:
        content = await pdf.read()  # Read file content
        file_names.append(pdf.filename)
        # Example: Save the file (uncomment to enable)
        # with open(f"uploads/{pdf.filename}", "wb") as f:
        #     f.write(content)

    print("Received PDF files:", file_names)

    return {"message": "PDF files received", "files": file_names}
