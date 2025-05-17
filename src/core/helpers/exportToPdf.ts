import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import purchase_pdf from "@/components/templates/pdf/purchase_pdf.vue";
import { createApp, h } from "vue";
import Do_pdf from "@/components/templates/pdf/do_pdf.vue";
import Invoice_pdf from "@/components/templates/pdf/invoice_pdf.vue";
import Quotation_pdf from "@/components/templates/pdf/quotation_pdf.vue";
import Tandaterima_pdf from "@/components/templates/pdf/tandaterima_pdf.vue";

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
interface Tandaterima {
  code_tandater : string;
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

export const exportInvPDF = async (item: Invoice) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    const app = createApp({
        render: () => h(Invoice_pdf, { item })
    });

    const instance = app.mount(container);

    // Tunggu hingga rendering selesai
    await new Promise(resolve => setTimeout(resolve, 100));

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10; // margin dalam mm
    
    try {
        const canvas = await html2canvas(instance.$el, {
            scale: 2, // meningkatkan kualitas
            logging: false,
            useCORS: true,
            allowTaint: true
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;
        let page = 1;

        // Tambahkan halaman pertama
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Tambahkan halaman baru jika konten terlalu panjang
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            page++;
        }

        pdf.save(`Invoice_${item.code_invoice}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
    } finally {
        app.unmount();
        document.body.removeChild(container);
    }
};

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
export const exportTTPDF = (item : Tandaterima) => {
    const container =  document.createElement('div')
      document.body.appendChild(container)        
      const app = createApp({
        render : () => h(Tandaterima_pdf, {item})
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
