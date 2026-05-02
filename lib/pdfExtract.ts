/**
 * Extract all text content from a PDF file using pdf.js.
 * Runs entirely client-side – no file is uploaded to a server.
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');

  // Use the bundled worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items
      .map((item: any) => item.str)
      .join(' ');
    pages.push(strings);
  }

  return pages.join('\n');
}
