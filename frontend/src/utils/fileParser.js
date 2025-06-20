import mammoth from 'mammoth';

export const parseFile = async (file) => {
  try {
    if (file.type === 'application/pdf') {
      // Dynamically import pdf.js from CDN
      const pdfjsLib = await import('https://mozilla.github.io/pdf.js/build/pdf.mjs');

      // Set the worker source to the CDN-hosted worker script
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://mozilla.github.io/pdf.js/build/pdf.worker.mjs';

      const typedArray = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(' ') + '\n';
      }

      return text;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } else if (file.type === 'text/plain') {
      const text = await file.text();
      return text;
    }

    throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT');
  } catch (error) {
    console.error('File parsing error:', error);
    throw error;
  }
};