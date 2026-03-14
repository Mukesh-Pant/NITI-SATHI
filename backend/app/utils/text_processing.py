import re
import unicodedata


def normalize_text(text: str) -> str:
    """Normalize text, especially important for Nepali Unicode consistency."""
    # Unicode NFC normalization for consistent Nepali encoding
    text = unicodedata.normalize("NFC", text)

    # Remove excessive whitespace while preserving paragraph breaks
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Clean up common PDF artifacts
    text = re.sub(r"(\w)-\n(\w)", r"\1\2", text)  # Fix hyphenated line breaks

    return text.strip()
