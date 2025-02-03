import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { CustomerDetails } from "./CustomerDetails";
import { PrescriptionDetails } from "./PrescriptionDetails";
import { InvoiceHeader } from "./InvoiceHeader";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10, // Increased base font size
  },
  bottomSection: {
    flexDirection: "row",
    marginTop: 8,
  },
  notesSection: {
    width: "100%",
  },
  notesContainer: {
    padding: 8,
    border: "1 solid #999",
    minHeight: 40,
  },
  notesTitle: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    fontSize: 12, // Increased font size for notes title
  },
  notesText: {
    color: "#666",
    fontSize: 10, // Increased font size for notes content
  },
});

interface JobOrderPDFProps {
  invoice: any;
  items: any[];
}

export function JobOrderPDF({ invoice, items }: JobOrderPDFProps) {
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
        />

        <PrescriptionDetails items={items} />

        <div style={styles.bottomSection}>
          <div style={styles.notesSection}>
            <div style={styles.notesContainer}>
              <text style={styles.notesTitle}>Notes:</text>
              <text style={styles.notesText}>{notesText}</text>
            </div>
          </div>
        </div>
      </Page>
    </Document>
  );
}