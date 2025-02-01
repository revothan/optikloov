import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { InvoiceHeader } from "./invoice-pdf/InvoiceHeader";
import { CustomerDetails } from "./invoice-pdf/CustomerDetails";
import { ItemsTable } from "./invoice-pdf/ItemsTable";
import { PrescriptionDetails } from "./invoice-pdf/PrescriptionDetails";
import { PaymentDetails } from "./invoice-pdf/PaymentDetails";
import { InvoiceFooter } from "./invoice-pdf/InvoiceFooter";

const styles = StyleSheet.create({
  page: {
    padding: 16,
    fontSize: 7,
  },
  notes: {
    marginTop: 10,
    padding: 10,
    fontSize: 8,
  }
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

  return (
    <Document>
      <Page size="A5" orientation="landscape" style={styles.page}>
        <InvoiceHeader 
          invoiceNumber={invoice.invoice_number}
          saleDate={invoice.sale_date}
          acknowledgedBy={invoice.acknowledged_by}
        />

        <CustomerDetails
          name={invoice.customer_name}
          email={invoice.customer_email}
          address={invoice.customer_address}
          phone={invoice.customer_phone}
          paymentType={invoice.payment_type}
        />

        <ItemsTable items={items} />

        <PrescriptionDetails items={items} />

        <PaymentDetails
          totalAmount={invoice.total_amount}
          discountAmount={invoice.discount_amount}
          grandTotal={invoice.grand_total}
          downPayment={invoice.down_payment}
          remainingBalance={invoice.remaining_balance}
        />

        {invoice.notes && (
          <Text style={styles.notes}>
            Notes: {invoice.notes}
          </Text>
        )}

        <InvoiceFooter />
      </Page>
    </Document>
  );
}