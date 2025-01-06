import numpy as np
from typing import List
from pydantic import BaseModel
from pulp import LpProblem, LpMaximize, LpVariable, lpSum, LpStatus, value
from math import log
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import pdfplumber
from transformers import pipeline
import io
from concurrent.futures import ThreadPoolExecutor

content_global=[]

class AnalysisHandler:
    def __init__(self):
        pass

    def get_metrics(self, pdf_files):
        def split_text_into_chunks(text, max_chunk_size=1000):
            words = text.split()
            chunks = []
            current_chunk = []
            current_length = 0

            for word in words:
                if current_length + len(word) + 1 <= max_chunk_size:
                    current_chunk.append(word)
                    current_length += len(word) + 1
                else:
                    chunks.append(" ".join(current_chunk))
                    current_chunk = [word]
                    current_length = len(word) + 1

            if current_chunk:
                chunks.append(" ".join(current_chunk))

            return chunks

        # Load the summarization pipeline once (shared across threads)
        summarizer = pipeline("summarization", model="t5-small", tokenizer="t5-small", device=0)

        def summarize_large_text(text, max_chunk_size=1000):
            chunks = split_text_into_chunks(text, max_chunk_size)
            summaries = []
            for chunk in chunks:
                summary = summarizer(chunk, max_length=100, min_length=30, do_sample=False)
                summaries.append(summary[0]['summary_text'])
            return " ".join(summaries)

        def extract_and_summarize(pdf):
            pdf_name = pdf.filename
            with pdfplumber.open(io.BytesIO(pdf.file.read())) as pdf_file:
                text = ""
                for page in pdf_file.pages:
                    text += page.extract_text()
            summary = summarize_large_text(text)
            return pdf_name, summary

        self.file_names = []

        # Use ThreadPoolExecutor for parallel processing
        with ThreadPoolExecutor() as executor:
            results = executor.map(extract_and_summarize, pdf_files)

        # Collect results
        for file_name, content in results:
            self.file_names.append(file_name)
            content_global.append(content)

        return
    
    def get_esg(self,features):
        def cosine_similarity_sklearn(embedding1, embedding2):
            # Reshape embeddings to 2D arrays for sklearn (if not already)
            embedding1 = np.asarray(embedding1).reshape(1, -1)
            embedding2 = np.asarray(embedding2).reshape(1, -1)

            # Use Sklearn's cosine_similarity function
            similarity = cosine_similarity(embedding1, embedding2)[0][0]
            return similarity
        self.esg=[]
        for i in range(len(self.file_names)):
            top_n=5
            csv_path = "/Users/fasith/Projects/Hackathons/IndrustiAI/atlee/atlee_backend/app/analysis/dataset (1).csv"

            df = pd.read_csv(csv_path)

            # Ensure necessary columns exist
            required_columns = ['Embedding', 'e_score', 's_score', 'g_score', 'ROI']
            missing_columns = [col for col in required_columns if col not in df.columns]
            if missing_columns:
                raise KeyError(f"Missing required columns in the CSV file: {missing_columns}")

            # Convert 'Embedding' column from string representation to NumPy arrays
            df['Embedding'] = df['Embedding'].apply(eval).apply(np.array)

            # Load the pre-trained embedding model
            model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

            # Generate the embedding for the input content
            content_embedding = model.encode(content_global[i])

            # Calculate cosine similarity for each embedding in the CSV
            df['Similarity'] = df['Embedding'].apply(
                lambda emb: cosine_similarity([content_embedding], [emb])[0][0]
            )

            # Get the top N rows based on similarity
            es=0
            ss=0
            gs=0
            roi=0
            rs=0
            top_matches = df.nlargest(top_n, 'Similarity')[[ 'e_score', 's_score', 'g_score', 'ROI', 'Risk_score','Similarity']]
            for _,r in top_matches.iterrows():
                es+=r['Similarity']*r['e_score']
                ss+=r['Similarity']*r['s_score']
                gs+=r['Similarity']*r['g_score']
                roi+=r["Similarity"]*r['ROI']
                rs+=r['Similarity']*r['Risk_score']
            t={"TS":round(ss*features[1]+es*features[0]+gs*features[2],2),"ESG":[round(es,2),round(ss,2),round(gs,2)],"Risk":round(rs,2),"ROI":round(roi,2), "Pdf":self.file_names[i]}
            self.esg.append(t)
        # self.esg=[{"TS":1,"ESG":[1,2,3],"Risk":2,"ROI":4, "Pdf":"ffff"},{"TS":2,"ESG":[1,4,3],"Risk":5,"ROI":1, "Pdf":"fgff"}]
        return  self.esg
    
    def get_weights(self, risk_tolerance):
        prob = LpProblem("Portfolio_Optimization", LpMaximize)
        weights = [LpVariable(f"w_{i}", lowBound=0) for i in range(len(self.file_names))]

        # Objective function
        objective = lpSum(weights[i] * (self.esg[i]["TS"] + self.esg[i]["ROI"]) for i in range(len(self.file_names)))
        prob += objective

        # Risk constraint
        prob += lpSum(weights[i] * self.esg[i]['Risk'] for i in range(len(self.file_names))) <= risk_tolerance

        # Budget constraint
        prob += lpSum(weights) == 1

        # Each weight should not exceed 2 * (1 / len(self.file_names))
        max_weight = 2 * (1 / len(self.file_names)**0.5)
        for i in range(len(weights)):
            prob += weights[i] <= max_weight, f"Max_Weight_Constraint_{i}"

        # Solve the problem
        prob.solve()

        # Results
        optimal_weights = [w.varValue for w in weights]

        self.esg1 = self.esg

        self.esg1 = [[self.esg1[i], optimal_weights[i]] for i in range(len(self.esg1)) if optimal_weights[i] > 0]

        self.esg1 = sorted(self.esg1, key=lambda x: x[1])
        return self.esg1
    