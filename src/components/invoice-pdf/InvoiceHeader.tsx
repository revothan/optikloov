import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";

const styles = StyleSheet.create({
  header: {
    marginBottom: 10,
  },
  invoiceInfo: {
    textAlign: 'right',
    marginBottom: 10,
  },
  invoiceText: {
    fontSize: 8,
  },
  companyName: {
    fontSize: 10,
    marginBottom: 2,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  storeInfo: {
    fontSize: 7,
    marginBottom: 1,
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
      <View style={styles.invoiceInfo}>
        <Text style={styles.invoiceText}>
          Invoice No. {invoiceNumber}
        </Text>
        <Text style={styles.invoiceText}>
          Date: {format(new Date(saleDate), "dd MMM yyyy")}
        </Text>
      </View>
      
      <Text style={styles.companyName}>OPTIK LOOV</Text>
      <Text style={styles.storeInfo}>
        Alamat: Ruko Downtown Drive, kecamatan No.016 Blok DDBLV, Medang,
      </Text>
      <Text style={styles.storeInfo}>
        Kec. Pagedangan, Kabupaten Tangerang, Banten 15334
      </Text>
      <Text style={styles.storeInfo}>WhatsApp: 0812 8333 5568</Text>
      <Text style={styles.storeInfo}>Website: optikloov.com</Text>
      <Text style={styles.storeInfo}>Email: optik.loov@gmail.com</Text>
    </View>
  );
}