const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function validatePdf(file) {
  if (!file) {
    throw new Error("Please select a PDF file.");
  }

  if (!file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("Only PDF files are allowed.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("PDF size must not exceed 5 MB.");
  }

  if (file.size === 0) {
    throw new Error("The selected PDF is empty.");
  }

  const header = await file.slice(0, 5).arrayBuffer();
  const signature = new TextDecoder().decode(header);

  if (signature !== "%PDF-") {
    throw new Error("Invalid PDF file. Please select a valid PDF.");
  }

  return true;
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
