import { Document, Page, Text, StyleSheet, View } from "@react-pdf/renderer";
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
  bottomSection: {
    flexDirection: "row",
    marginTop: 4,
  },
  notesSection: {
    width: "40%", // Keep consistent width
  },
  notesContainer: {
    padding: 4,
    border: "1 solid #999",
    minHeight: 40, // Ensure consistent height
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
    paddingLeft: 20, // Add consistent spacing from notes
  },
});

interface InvoicePDFProps {
  invoice: any;
  items: any[];
}

export function InvoicePDF({ invoice, items }: InvoicePDFProps) {
  // Always show notes section, but with blank content if no notes
  const notesText = invoice.notes || "-";

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

