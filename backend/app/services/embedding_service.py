from functools import lru_cache
from sentence_transformers import SentenceTransformer, util

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

@lru_cache(maxsize=1)
def get_embedding_model() -> SentenceTransformer:
    return SentenceTransformer(MODEL_NAME)


def generate_embeddings(texts: list[str]):
    cleaned_texts = [
        text.strip()
        for text in texts
        if text and text.strip()
    ]

    if not cleaned_texts:
        raise ValueError("At least one non-empty text is required")

    model = get_embedding_model()

    return model.encode(
        cleaned_texts,
        convert_to_tensor=True,
        normalize_embeddings=True
    )


def calculate_similarity(embedding_a, embedding_b) -> float:
    similarity = util.cos_sim(
        embedding_a,
        embedding_b
    ).item()

    return round(
        max(0.0, min(1.0, similarity)) * 100,
        2
    )


def calculate_semantic_similarity(
    text_a: str,
    text_b: str
) -> float:
    if not text_a or not text_a.strip():
        raise ValueError("First text cannot be empty")

    if not text_b or not text_b.strip():
        raise ValueError("Second text cannot be empty")

    embeddings = generate_embeddings([
        text_a,
        text_b
    ])

    return calculate_similarity(
        embeddings[0],
        embeddings[1]
    )
