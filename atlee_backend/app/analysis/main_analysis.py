# # -*- coding: utf-8 -*-
# """Main.ipynb

# Automatically generated by Colab.

# Original file is located at
#     https://colab.research.google.com/drive/1v_WMvZBwN_DKBZTwVo42yG2MAMsUbHmJ
# """

# import pandas as pd
# import networkx as nx
# from text_to_kg import TextToKG
# from rag_framework import RAGFramework

# # Initialize classes
# text_to_kg = TextToKG()
# rag = RAGFramework()

# # Step 1: Read the CSV file
# csv_file_path = "corpus.csv"  # Replace with your CSV file path
# df = pd.read_csv(csv_file_path)

# # Ensure the necessary columns exist in the CSV
# if not all(col in df.columns for col in ["text", "e_score", "s_score", "g_score"]):
#     raise ValueError("CSV must contain 'text', 'e_score', 's_score', and 'g_score' columns.")

# # Step 2: Generate knowledge graphs and add to the RAG framework
# for index, row in df.iterrows():
#     text_chunk = row["text"]
#     e_score, s_score, g_score = row["e_score"], row["s_score"], row["g_score"]

#     # Generate the knowledge graph for the text
#     graph = text_to_kg.generate_knowledge_graph([text_chunk])

#     # Compute the average ESG score
#     esg_score = (e_score + s_score + g_score) / 3

#     # Add to the RAG framework
#     rag.add_corpus(graph, text_chunk, esg_score)

# # Step 3: Process input PDF
# pdf_file_path = "input.pdf"  # Replace with your PDF file path
# text_corpus = text_to_kg.extract_text_from_pdf(pdf_file_path).split("\n")

# # Generate knowledge graph for the input text
# input_graph = text_to_kg.generate_knowledge_graph(text_corpus)
# input_text = " ".join(text_corpus)

# # Step 4: Compute ESG score for input
# weighted_esg = rag.compute_weighted_esg(input_graph, input_text)
# print(f"Weighted ESG Score for input PDF: {weighted_esg:.2f}")