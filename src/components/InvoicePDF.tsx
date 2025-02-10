import { Document, Page, Text, StyleSheet, View } from "@react-pdf/renderer";
import { InvoiceHeader } from "./invoice-pdf/InvoiceHeader";
import { CustomerDetails } from "./invoice-pdf/CustomerDetails";
import { ItemsTable } from "./invoice-pdf/ItemsTable";
import { PaymentDetails } from "./invoice-pdf/PaymentDetails";
import { InvoiceFooter } from "./invoice-pdf/InvoiceFooter";

const styles = StyleSheet.create({
  page: {
    padding: 16,
    fontSize: 7,
  },
  bottomSection: {
    flexDirection: "row",
    marginTop: 4,
  },
  notesSection: {
    width: "40%",
  },
  notesContainer: {
    padding: 4,
    border: "1 solid #999",
    minHeight: 40,
  },
  notesTitle: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  notesText: {
    color: "#666",
  },
  paymentSection: {
    flex: 1,
    paddingLeft: 20,
  },
});

interface InvoicePDFProps {
  invoice: {
    invoice_number: string;
    sale_date: string;
    acknowledged_by?: string;
    customer_name: string;
    customer_email?: string;
    customer_address?: string;
    customer_phone?: string;
    payment_type?: string;
    notes?: string;
    total_amount: number;
    discount_amount: number;
    grand_total: number;
    down_payment?: number;
    remaining_balance?: number;
    branch: string; // Make sure branch is included in the type
  };
  items: any[];
}

export function InvoicePDF({ invoice, items }: InvoicePDFProps) {
  const notesText = invoice.notes || "-";

  return (
    <Document>
      <Page size="A5" orientation="landscape" style={styles.page}>
        <InvoiceHeader
          invoiceNumber={invoice.invoice_number}
          saleDate={invoice.sale_date}
          acknowledgedBy={invoice.acknowledged_by}
          branch={invoice.branch} // Pass the branch information
        />
        <CustomerDetails
          name={invoice.customer_name}
          email={invoice.customer_email}
          address={invoice.customer_address}
          phone={invoice.customer_phone}
          paymentType={invoice.payment_type}
        />
        <ItemsTable items={items} />
        <View style={styles.bottomSection}>
          <View style={styles.notesSection}>
            <View style={styles.notesContainer}>
              <Text style={styles.notesTitle}>Notes:</Text>
              <Text style={styles.notesText}>{notesText}</Text>
            </View>
          </View>
          <View style={styles.paymentSection}>
            <PaymentDetails
              totalAmount={invoice.total_amount}
              discountAmount={invoice.discount_amount}
              grandTotal={invoice.grand_total}
              downPayment={invoice.down_payment}
              remainingBalance={invoice.remaining_balance}
            />
          </View>
        </View>
        <InvoiceFooter />
      </Page>
    </Document>
  );
}

