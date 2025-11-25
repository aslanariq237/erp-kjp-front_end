import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import purchase_pdf from "@/components/templates/pdf/purchase_pdf.vue";
import { createApp, h } from "vue";
import { nextTick } from "vue";
import Do_pdf from "@/components/templates/pdf/do_pdf.vue";
import Invoice_pdf from "@/components/templates/pdf/invoice_pdf.vue";
import Quotation_pdf from "@/components/templates/pdf/quotation_pdf.vue";
import Tandaterima_pdf from "@/components/templates/pdf/tandaterima_pdf.vue";
import Jasakirim_pdf from "@/components/templates/pdf/jasakirim_pdf.vue";

interface Purchaseorder {
  code_po: string;
}

interface Deliveryorder {
  code_do: string;
}

interface Invoice {
  code_invoice: string;
}

interface Quotation {
  code_quatation: string;
}
interface Tandaterima {
  code_tandater: string;
}

interface JasaKirim {
  code_jasakirim: string;
}

const ROWS_PER_PAGE = 12;
const ROws_PER_PAGE_DO = 5;
const Rows_PER_PAGE_DO_2 = 4;

export const exportPoPDF = async (item) => {
  if (!item || item.length === 0) {
    console.warn('No Items To Export');
    return;
  }

  await generateSinglePoPdf(item);
}
const generateSinglePoPdf = async (item) => {
  var totalRows = item.detail_po.length;
  var totalPages = Math.ceil(totalRows / ROWS_PER_PAGE);
  var pdf = new jsPDF('p', 'mm', 'A4');
  var imgWidth = 210
  var imgHeight = 297;

  let currentPage = 1;

  while (currentPage <= totalPages) {
    const startRow = (currentPage - 1) * ROWS_PER_PAGE;
    const endRow = Math.min(startRow + ROWS_PER_PAGE, totalRows);
    const rowsToShow = item.detail_po.slice(startRow, endRow);
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;
    const remainingRows = totalRows - startRow;

    const pdfProps = {
      item,
      partialMode: totalPages > 1,
      pageNumber: currentPage,
      totalPages,
      rowsToShow,
      showHeader: isFirstPage,
      showFooter: isLastPage,
    };

    const container = document.createElement('div');
    container.style.width = '794px';
    container.style.height = '1123px';
    document.body.appendChild(container);

    const app = createApp({
      render: () => h(purchase_pdf, pdfProps),
    });

    const instance = app.mount(container);

    try {
      const canvas = await html2canvas(instance.$el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
      });

      const imgData = canvas.toDataURL('img/png');
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (currentPage > 1) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      currentPage++;
    } catch (error) {
      console.error('Error Generating Page', error);
    } finally {
      app.onUnmount();
      document.body.removeChild(container);
    }
  }
  pdf.save(`purchase_order_${item.code_po}.pdf`);
}

export const exportDoPDF = async(item: Deliveryorder) => {
  if (!item || item.length === 0) {
    console.warn('No Items To Export');
    return;
  }

  await generateSingleDoPdf(item);
}

const generateSingleDoPdf = async (item) => {
  var totalRows = item.detail_do.length;
  let maxTextLen = 0

  const TEXT_LENGTH_THRESHOLD = 120;
  if (Array.isArray(item.point)) {
    maxTextLen = item.point.reduce((max, d) => {
      const txt = (d.alamat || '').toString();
      return Math.max(max, txt.length);
    }, 0);
  }else if(item.point && typeof item.point.alamat === 'string') {
    maxTextLen = item.point.alamat.length;
  }

  let rowsPerPage = ROws_PER_PAGE_DO;
  if (maxTextLen > TEXT_LENGTH_THRESHOLD) {
    rowsPerPage = Rows_PER_PAGE_DO_2;
  }
  var totalPages = Math.ceil(totalRows / rowsPerPage);
  var pdf = new jsPDF('p', 'mm', 'A4');
  var imgWidth = 210
  var imgHeight = 297;
 
  let currentPage = 1;
  while (currentPage <= totalPages) {
    const startRow = (currentPage - 1) * rowsPerPage;
    const endRow = Math.min(startRow + rowsPerPage, totalRows);
    const rowsToShow = item.detail_do.slice(startRow, endRow);
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;
    const remainingRows = totalRows - startRow;

    const pdfProps = {
      item,
      partialMode: totalPages > 1,
      pageNumber: currentPage,
      totalPages,
      rowsToShow,
      showHeader: isFirstPage,
      showFooter: isLastPage,
    };

    const container = document.createElement('div');
    container.style.width = '794px';
    container.style.height = '1123px';
    document.body.appendChild(container);

    const app = createApp({
      render : () => h(Do_pdf, pdfProps),
    });

    const instance = app.mount(container);

    try {
      const canvas = await html2canvas(instance.$el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
      });

      const imgData = canvas.toDataURL('img/png');
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (currentPage > 1) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      currentPage++;
    } catch (error) {
      console.error('Error Generating Page', error);
    } finally {
      app.onUnmount();
      document.body.removeChild(container);
    }
  }
  pdf.save(`delivery_order_${item.code_do}.pdf`);
}

export const exportInvPDF = async (item: Invoice) => {
  if (!item || item.length === 0) {
    console.warn('No Items To Export');
    return;
  }

  await generateSingleInvPdf(item);
};

const generateSingleInvPdf = async(item) => {
  var totalRows = item.detail_inv.length;
  var totalPages = Math.ceil(totalRows / ROWS_PER_PAGE);
  var pdf = new jsPDF('p', 'mm', 'A4');
  var imgWidth = 210
  var imgHeight = 297;

  let currentPage = 1;
  while (currentPage <= totalPages) {
    const startRow = (currentPage - 1) * ROWS_PER_PAGE;
    const endRow = Math.min(startRow + ROWS_PER_PAGE, totalRows);
    const rowsToShow = item.detail_inv.slice(startRow, endRow);
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;
    const remainingRows = totalRows - startRow;

    const pdfProps = {
      item,
      partialMode: totalPages > 1,
      pageNumber: currentPage,
      totalPages,
      rowsToShow,
      showHeader: isFirstPage,
      showFooter: isLastPage,
    };

    const container = document.createElement('div');
    container.style.width = '794px';
    container.style.height = '1123px';
    document.body.appendChild(container);

    const app = createApp({
      render : () => h(Invoice_pdf, pdfProps),
    });

    const instance = app.mount(container);

    try {
      const canvas = await html2canvas(instance.$el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
      });

      const imgData = canvas.toDataURL('img/png');
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (currentPage > 1) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      currentPage++;
    } catch (error) {
      console.error('Error Generating Page', error);
    } finally {
      app.onUnmount();
      document.body.removeChild(container);
    }
  }
  pdf.save(`invoice_${item.code_invoice}.pdf`);
}

export const exportQuoPDF = async (item) => {
  if (!item || item.length === 0) {
    console.warn('No Items To Export');
    return;
  }

  await generateSingleQuoPdf(item);
}

const generateSingleQuoPdf = async (item) => {
  var totalRows = item.detail_quo.length;
  var totalPages = Math.ceil(totalRows / ROWS_PER_PAGE);
  var pdf = new jsPDF('p', 'mm', 'A4');
  var imgWidth = 210
  var imgHeight = 297;

  let currentPage = 1;
  while(currentPage <= totalPages) {
    const startRow = (currentPage - 1) * ROWS_PER_PAGE;
    const endRow = Math.min(startRow + ROWS_PER_PAGE, totalRows);
    const rowsToShow = item.detail_quo.slice(startRow, endRow);
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;
    const remainingRows = totalRows - startRow;

    const pdfProps = {
      item,
      partialMode: totalPages > 1,
      pageNumber: currentPage,
      totalPages,
      rowsToShow,
      showHeader: isFirstPage,
      showFooter: isLastPage,
    };

    const container = document.createElement('div');
    container.style.width = '794px';
    container.style.height = '1123px';
    document.body.appendChild(container);

    const app = createApp({
      render : () => h(Quotation_pdf, pdfProps),
    });

    const instance = app.mount(container);

    try {
      const canvas = await html2canvas(instance.$el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
      });

      const imgData = canvas.toDataURL('img/png');
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (currentPage > 1) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      currentPage++;
    } catch (error) {
      console.error('Error Generating Page', error);
    } finally {
      app.onUnmount();
      document.body.removeChild(container);
    }
  }
  pdf.save(`quotation_${item.code_quatation}.pdf`);
}

export const exportTTPDF = (item: Tandaterima) => {
  const container = document.createElement('div')
  container.style.width = '794px';
  container.style.height = '1123px';
  document.body.appendChild(container)
  const app = createApp({
    render: () => h(Tandaterima_pdf, { item })
  });

  const instance = app.mount(container);

  // Gunakan html2canvas untuk mengonversi elemen ke gambar
  html2canvas(instance.$el).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Tambahkan gambar ke PDF
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Simpan PDF
    pdf.save(`tandaterima_${item.code_tandater}.pdf`);
  });

  app.unmount();
  document.body.removeChild(container);
}

export const exportJasaKirimPDF = (item: JasaKirim) => {
  const container = document.createElement('div')
  container.style.width = '794px';
  container.style.height = '1123px';
  document.body.appendChild(container)

  const app = createApp({
    render: () => h(Jasakirim_pdf, { item }),
  });

  const instance = app.mount(container);

  html2canvas(instance.$el).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    pdf.save(`purchase_order_jasa_kirim_${item.code_jasakirim}.pdf`);
  });

  app.unmount();
  document.body.removeChild(container);
}
