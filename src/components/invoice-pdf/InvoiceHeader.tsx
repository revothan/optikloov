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
  storeInfoContainer: {
    fontSize: 6,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  label: {
    width: '35',
  },
  colon: {
    width: '8',
  },
  value: {
    flex: 1,
  }
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
        <View style={styles.storeInfoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Alamat</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>Ruko Downtown Drive, kecamatan No.016 Blok DDBLV, Medang,</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}></Text>
            <Text style={styles.colon}></Text>
            <Text style={styles.value}>Kec. Pagedangan, Kabupaten Tangerang, Banten 15334</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Telp/WA</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>0812 8333 5568</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Website</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>optikloov.com</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>optik.loov@gmail.com</Text>
          </View>
        </View>
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