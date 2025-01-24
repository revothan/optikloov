import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { InvoiceHeader } from "./invoice-pdf/InvoiceHeader";
import { CustomerDetails } from "./invoice-pdf/CustomerDetails";
import { ItemsTable } from "./invoice-pdf/ItemsTable";
import { PrescriptionDetails } from "./invoice-pdf/PrescriptionDetails";
import { PaymentDetails } from "./invoice-pdf/PaymentDetails";
import { InvoiceFooter } from "./invoice-pdf/InvoiceFooter";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
});

interface InvoicePDFProps {
  invoice: any;
  items: any[];
  onLoadComplete?: () => Promise<any[]>;
}

export function InvoicePDF({ invoice, items: initialItems, onLoadComplete }: InvoicePDFProps) {
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    const loadItems = async () => {
      if (onLoadComplete) {
        const loadedItems = await onLoadComplete();
        setItems(loadedItems);
      }
    };
    loadItems();
  }, [onLoadComplete]);

  // Group products by product_id to avoid duplication
  const uniqueProducts = items.reduce<Record<string, any>>((acc, item) => {
    if (!acc[item.product_id]) {
      acc[item.product_id] = item;
    }
    return acc;
  }, {});

  // Find prescription details for right and left eyes
  const rightEye = items.find(item => item.eye_side === 'right');
  const leftEye = items.find(item => item.eye_side === 'left');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <InvoiceHeader 
          invoiceNumber={invoice.invoice_number}
          saleDate={invoice.sale_date}
        />

        <CustomerDetails
          name={invoice.customer_name}
          address={invoice.customer_address}
          phone={invoice.customer_phone}
          paymentType={invoice.payment_type}
        />

        <ItemsTable items={Object.values(uniqueProducts)} />

        <PrescriptionDetails
          rightEye={rightEye}
          leftEye={leftEye}
        />

        <PaymentDetails
          totalAmount={invoice.total_amount}
          discountAmount={invoice.discount_amount}
          grandTotal={invoice.grand_total}
          downPayment={invoice.down_payment}
          remainingBalance={invoice.remaining_balance}
        />

        <InvoiceFooter
          acknowledgedBy={invoice.acknowledged_by}
          receivedBy={invoice.received_by}
        />
      </Page>
    </Document>
  );
}