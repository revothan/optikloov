import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";

const styles = StyleSheet.create({
  header: {
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    width: '40%',
    textAlign: 'right',
  },
  invoiceText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 10,
  },
  companyName: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  storeInfo: {
    fontSize: 7,
    marginBottom: 1,
  },
});

interface InvoiceHeaderProps {
  invoiceNumber: string;
  saleDate: string;
}

export function InvoiceHeader({ invoiceNumber, saleDate }: InvoiceHeaderProps) {
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
      </View>
    </View>
  );
}