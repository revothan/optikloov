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
    padding: 20,
    fontSize: 10,
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

  // Group items by product_id and eye_side
  const groupedItems = items.reduce((acc, item) => {
    const key = item.product_id;
    if (!acc[key]) {
      acc[key] = {
        ...item,
        eyes: {}
      };
    }
    acc[key].eyes[item.eye_side] = {
      sph: item.sph,
      cyl: item.cyl,
      axis: item.axis,
      add_power: item.add_power,
      pd: item.pd,
      sh: item.sh,
      prism: item.prism,
      v_frame: item.v_frame,
      f_size: item.f_size
    };
    return acc;
  }, {});

  const uniqueProducts = Object.values(groupedItems);

  return (
    <Document>
      <Page size="A5" style={styles.page}>
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

        <ItemsTable items={uniqueProducts} />

        <PrescriptionDetails items={uniqueProducts} />

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