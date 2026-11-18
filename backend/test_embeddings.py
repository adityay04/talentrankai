from sentence_transformers import SentenceTransformer, util
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

sentences = [
    "I develop REST APIs using Python and FastAPI.",
    "I build backend services using Python.",
    "I design user interfaces using React and CSS.",
    "I work with PostgreSQL databases and SQL."
]

embeddings = model.encode(sentences, convert_to_tensor=True)

for index, sentence in enumerate(sentences):
    print(f"\nSentence {index + 1}: {sentence}")
    print(f"Embedding shape: {embeddings[index].shape}")

print("\nSemantic Similarity:")

similarity = util.cos_sim(embeddings, embeddings)

for i in range(len(sentences)):
    for j in range(i + 1, len(sentences)):
        score = similarity[i][j].item()
        print(f"Sentence {i + 1} vs Sentence {j + 1}: {score:.4f}")
