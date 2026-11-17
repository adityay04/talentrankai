from io import BytesIO
import fitz
from docx import Document

class ResumeParserError(Exception):
    pass

def extract_pdf_text(file_bytes: bytes) -> str:
    try:
        with fitz.open(
            stream=file_bytes,
            filetype="pdf"
        ) as document:
            pages = [
                page.get_text("text")
                for page in document
            ]

        return "\n".join(pages).strip()

    except Exception as exc:
        raise ResumeParserError(
            "Unable to read PDF document"
        ) from exc


def extract_docx_text(file_bytes: bytes) -> str:
    try:
        document = Document(BytesIO(file_bytes))

        paragraphs = [
            paragraph.text
            for paragraph in document.paragraphs
            if paragraph.text.strip()
        ]

        table_content = []

        for table in document.tables:
            for row in table.rows:
                cells = [
                    cell.text.strip()
                    for cell in row.cells
                    if cell.text.strip()
                ]

                if cells:
                    table_content.append(" | ".join(cells))

        return "\n".join(
            paragraphs + table_content
        ).strip()

    except Exception as exc:
        raise ResumeParserError(
            "Unable to read DOCX document"
        ) from exc


def extract_resume_text(
    file_bytes: bytes,
    file_extension: str
) -> str:

    extension = file_extension.lower()

    if extension == ".pdf":
        text = extract_pdf_text(file_bytes)

    elif extension == ".docx":
        text = extract_docx_text(file_bytes)

    else:
        raise ResumeParserError(
            "Unsupported file format"
        )

    if not text:
        raise ResumeParserError(
            "No readable text found in document. The document may be scanned."
        )

    return text
