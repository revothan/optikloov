import { Document, Page, Text, StyleSheet, View } from "@react-pdf/renderer";
import { CustomerDetails } from "./CustomerDetails";
import { PrescriptionDetails } from "./PrescriptionDetails";
import { InvoiceHeader } from "./InvoiceHeader";

const styles = StyleSheet.create({
  page: {
    padding: 16,
    fontSize: 7,
  },
  title: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 8,
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
  branch: string; // Add branch to props
}

const JobOrderPDF = ({ invoice, items, branch }: JobOrderPDFProps) => {
  const notesText = invoice.notes || "-";

  return (
    <Document>
      <Page size="A5" orientation="landscape" style={styles.page}>
        <Text style={styles.title}>JOB ORDER</Text>
        <InvoiceHeader
          invoiceNumber={invoice.invoice_number}
          saleDate={invoice.sale_date}
          acknowledgedBy={invoice.acknowledged_by}
          branch={branch} // Pass the branch prop
        />
        <CustomerDetails
          name={invoice.customer_name}
          email={invoice.customer_email}
          address={invoice.customer_address}
          phone={invoice.customer_phone}
        />
        <PrescriptionDetails items={items} />
        <View style={styles.bottomSection}>
          <View style={styles.notesSection}>
            <View style={styles.notesContainer}>
              <Text style={styles.notesTitle}>Notes:</Text>
              <Text style={styles.notesText}>{notesText}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default JobOrderPDF;
