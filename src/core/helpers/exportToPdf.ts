import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import purchase_pdf from "@/components/templates/pdf/purchase_pdf.vue";
import { createApp, h } from "vue";
import Do_pdf from "@/components/templates/pdf/do_pdf.vue";
import Invoice_pdf from "@/components/templates/pdf/invoice_pdf.vue";
import Quotation_pdf from "@/components/templates/pdf/quotation_pdf.vue";

interface Purchaseorder {
  code_po : string;  
}

interface Deliveryorder {
  code_do : string;
}

interface Invoice {
  code_invoice : string;
}

interface Quotation {
  code_quatation : string;
}

export const exportPoPDF = (item: Purchaseorder) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const app = createApp({
        render : () => h(purchase_pdf, {item}),
    });

    const instance = app.mount(container);

    html2canvas(instance.$el).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        pdf.save(`purchase_order_${item.code_po}.pdf`);
    });

    app.unmount();
    document.body.removeChild(container);
}

export const exportDoPDF = (item: Deliveryorder) => {
    // Buat instance Vue baru untuk merender komponen
    const container =  document.createElement('div')
    document.body.appendChild(container)
    const app = createApp({
      render : () => h(Do_pdf, {item})
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
      pdf.save(`DeliveryOrder_${item.code_do}.pdf`);
    });

    app.unmount()
    document.body.removeChild(container);
}

export const exportInvPDF = (item: Invoice) => {
    // Buat instance Vue baru untuk merender komponen
    const container =  document.createElement('div')
    document.body.appendChild(container)
    const app = createApp({
      render : () => h(Invoice_pdf, {item})
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
      pdf.save(`Invoice_${item.code_invoice}.pdf`);
    });

    app.unmount()
    document.body.removeChild(container);
}

export const exportQuoPDF = (item : Quotation) => {
    const container =  document.createElement('div')
      document.body.appendChild(container)        
      const app = createApp({
        render : () => h(Quotation_pdf, {item})
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
        pdf.save(`quotation_${item.code_quatation}.pdf`);
      });

      app.unmount();
      document.body.removeChild(container);
}
