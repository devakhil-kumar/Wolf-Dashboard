// exportPdf.js — snapshot a DOM node to a downloadable PDF (manual snapshot export).
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Capture an element and save it as a PDF.
 * @param {HTMLElement} node - element to snapshot
 * @param {string} fileName - output file name (without extension)
 */
export async function exportNodeToPdf(node, fileName = 'report') {
  if (!node) return;

  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');

  // Landscape A4 fits wide store-comparison layouts better.
  const pdf = new jsPDF('landscape', 'pt', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Paginate vertically if the snapshot is taller than one page.
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position -= pageHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${fileName}.pdf`);
}
