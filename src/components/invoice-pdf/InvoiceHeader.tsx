import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";

const styles = StyleSheet.create({
  header: {
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
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
    marginBottom: 2,
    fontWeight: 'bold',
  },
  storeInfo: {
    fontSize: 6,
    marginBottom: 1,
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
        <Text style={styles.companyName}>OPTIK LOOV</Text>
        <Text style={styles.storeInfo}>
          Alamat: Ruko Downtown Drive, kecamatan No.016 Blok DDBLV, Medang,
        </Text>
        <Text style={styles.storeInfo}>
          Kec. Pagedangan, Kabupaten Tangerang, Banten 15334
        </Text>
        <Text style={styles.storeInfo}>Telp/WA: 0812 8333 5568</Text>
        <Text style={styles.storeInfo}>Website: optikloov.com</Text>
        <Text style={styles.storeInfo}>Email: optik.loov@gmail.com</Text>
      </View>
      
      <View style={styles.rightSection}>
        <Text style={styles.invoiceText}>
          Invoice No. {invoiceNumber}
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