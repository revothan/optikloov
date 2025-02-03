import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { CustomerDetails } from "./CustomerDetails";
import { PrescriptionDetails } from "./PrescriptionDetails";

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
    width: "100%",
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