import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    marginBottom: 5,
    justifyContent: 'space-between',
  },
  leftSection: {
    width: '60%',
  },
  rightSection: {
    width: '40%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  invoiceText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'right',
  },
  dateText: {
    fontSize: 8,
    marginBottom: 2,
    textAlign: 'right',
  },
  inspectorText: {
    fontSize: 7,
    textAlign: 'right',
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  companyDetails: {
    fontSize: 7,
  },
});

interface InvoiceHeaderProps {
  invoiceNumber: string;
  saleDate: string;
  acknowledgedBy?: string;
}

export function InvoiceHeader({ invoiceNumber, saleDate, acknowledgedBy }: InvoiceHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <Text style={styles.companyName}>Optik Loov</Text>
        <Text style={styles.companyDetails}>
          Jl. Raya Darmo No.116, Surabaya
        </Text>
        <Text style={styles.companyDetails}>
          Telp. (031) 567 8901
        </Text>
        <Text style={styles.companyDetails}>
          Email: optikloov@gmail.com
        </Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.invoiceText}>
          Invoice No: {invoiceNumber}
        </Text>
        <Text style={styles.dateText}>
          Date: {format(new Date(saleDate), "dd MMM yyyy")}
        </Text>
        <Text style={styles.inspectorText}>
          Pemeriksa: {acknowledgedBy || '_________________'}
        </Text>
      </View>
    </View>
  );
}