import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";

const styles = StyleSheet.create({
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
  companyName: {
    fontSize: 12,
    marginBottom: 2,
    textAlign: 'center',
  },
});

interface InvoiceHeaderProps {
  invoiceNumber: string;
  saleDate: string;
}

export function InvoiceHeader({ invoiceNumber, saleDate }: InvoiceHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Invoice #{invoiceNumber}</Text>
      <Text style={styles.companyName}>OPTIK LOOV</Text>
      <Text style={{ textAlign: 'center', fontSize: 8 }}>
        Date: {format(new Date(saleDate), "dd MMM yyyy")}
      </Text>
    </View>
  );
}