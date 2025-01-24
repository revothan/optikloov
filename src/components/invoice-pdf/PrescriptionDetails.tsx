import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  prescription: {
    marginTop: 10,
    marginBottom: 10,
    padding: 8,
    border: '1 solid #999',
  },
  prescriptionTitle: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  productTitle: {
    fontSize: 10,
    marginTop: 5,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  table: {
    width: "100%",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    paddingVertical: 3,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    fontSize: 8,
    padding: 2,
  },
  commonDetails: {
    flexDirection: "row",
    marginTop: 5,
    fontSize: 8,
  },
  commonDetail: {
    flex: 1,
  },
});

interface PrescriptionDetailsProps {
  items: any[];
}

export function PrescriptionDetails({ items }: PrescriptionDetailsProps) {
  // Filter items to only show those with prescription details (Lensa category)
  const lensItems = items.filter(item => item.products?.category === 'Lensa');
  
  if (lensItems.length === 0) return null;

  return (
    <View style={styles.prescription}>
      <Text style={styles.prescriptionTitle}>Prescription Details</Text>
      
      {lensItems.map((item, index) => (
        <View key={index}>
          <Text style={styles.productTitle}>{item.products?.name}</Text>
          
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Eye</Text>
              <Text style={styles.tableCell}>SPH</Text>
              <Text style={styles.tableCell}>CYL</Text>
              <Text style={styles.tableCell}>AXIS</Text>
              <Text style={styles.tableCell}>ADD</Text>
            </View>
            
            {item.eyes.right && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Right Eye (OD)</Text>
                <Text style={styles.tableCell}>{item.eyes.right.sph ?? '-'}</Text>
                <Text style={styles.tableCell}>{item.eyes.right.cyl ?? '-'}</Text>
                <Text style={styles.tableCell}>{item.eyes.right.axis ?? '-'}</Text>
                <Text style={styles.tableCell}>{item.eyes.right.add_power ?? '-'}</Text>
              </View>
            )}
            
            {item.eyes.left && (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Left Eye (OS)</Text>
                <Text style={styles.tableCell}>{item.eyes.left.sph ?? '-'}</Text>
                <Text style={styles.tableCell}>{item.eyes.left.cyl ?? '-'}</Text>
                <Text style={styles.tableCell}>{item.eyes.left.axis ?? '-'}</Text>
                <Text style={styles.tableCell}>{item.eyes.left.add_power ?? '-'}</Text>
              </View>
            )}
          </View>

          <View style={styles.commonDetails}>
            <Text style={styles.commonDetail}>PD: {item.eyes.right?.pd || item.eyes.left?.pd || '-'}</Text>
            <Text style={styles.commonDetail}>SH: {item.eyes.right?.sh || item.eyes.left?.sh || '-'}</Text>
            <Text style={styles.commonDetail}>PRISM: {item.eyes.right?.prism || item.eyes.left?.prism || '-'}</Text>
            <Text style={styles.commonDetail}>V FRAME: {item.eyes.right?.v_frame || item.eyes.left?.v_frame || '-'}</Text>
            <Text style={styles.commonDetail}>F SIZE: {item.eyes.right?.f_size || item.eyes.left?.f_size || '-'}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}