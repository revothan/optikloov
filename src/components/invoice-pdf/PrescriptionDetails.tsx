import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  prescription: {
    marginTop: 5,
    marginBottom: 5,
    padding: 5,
    border: '1 solid #999',
  },
  prescriptionTitle: {
    fontSize: 10,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  productTitle: {
    fontSize: 8,
    marginTop: 3,
    marginBottom: 3,
    fontWeight: 'bold',
  },
  table: {
    width: "100%",
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    paddingVertical: 2,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    fontSize: 7,
    padding: 1,
  },
  commonDetails: {
    flexDirection: "row",
    marginTop: 3,
    fontSize: 7,
  },
  commonDetail: {
    flex: 1,
  },
});

interface PrescriptionDetailsProps {
  items: any[];
}

export function PrescriptionDetails({ items }: PrescriptionDetailsProps) {
  const formatValue = (value: number | null, type: 'sph' | 'cyl' | 'add' | 'mpd') => {
    if (value === null) return type === 'mpd' ? "0" : "0.00";
    
    // For MPD, return whole number
    if (type === 'mpd') {
      return Math.round(value).toString();
    }
    
    const absValue = Math.abs(value).toFixed(2);
    
    switch (type) {
      case 'sph':
        return value >= 0 ? `+${absValue}` : `-${absValue}`;
      case 'cyl':
        return value === 0 ? "0.00" : `-${absValue}`;
      case 'add':
        return value === 0 ? "0.00" : `+${absValue}`;
      default:
        return value.toFixed(2);
    }
  };

  const lensItems = items.filter(item => 
    item.products?.category === 'Lensa' && 
    (item.left_eye_sph || item.left_eye_cyl || item.left_eye_axis || item.left_eye_add_power || item.left_eye_mpd ||
     item.right_eye_sph || item.right_eye_cyl || item.right_eye_axis || item.right_eye_add_power || item.right_eye_mpd ||
     item.sh || item.prism || item.v_frame || item.f_size)
  );
  
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
              <Text style={styles.tableCell}>MPD</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Right Eye (OD)</Text>
              <Text style={styles.tableCell}>{formatValue(item.right_eye_sph, 'sph')}</Text>
              <Text style={styles.tableCell}>{formatValue(item.right_eye_cyl, 'cyl')}</Text>
              <Text style={styles.tableCell}>{item.right_eye_axis || "0"}</Text>
              <Text style={styles.tableCell}>{formatValue(item.right_eye_add_power, 'add')}</Text>
              <Text style={styles.tableCell}>{formatValue(item.right_eye_mpd, 'mpd')}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Left Eye (OS)</Text>
              <Text style={styles.tableCell}>{formatValue(item.left_eye_sph, 'sph')}</Text>
              <Text style={styles.tableCell}>{formatValue(item.left_eye_cyl, 'cyl')}</Text>
              <Text style={styles.tableCell}>{item.left_eye_axis || "0"}</Text>
              <Text style={styles.tableCell}>{formatValue(item.left_eye_add_power, 'add')}</Text>
              <Text style={styles.tableCell}>{formatValue(item.left_eye_mpd, 'mpd')}</Text>
            </View>
          </View>

          <View style={styles.commonDetails}>
            <Text style={styles.commonDetail}>SH: {item.sh || "0"}</Text>
            <Text style={styles.commonDetail}>PRISM: {item.prism || "0"}</Text>
            <Text style={styles.commonDetail}>V FRAME: {item.v_frame || "-"}</Text>
            <Text style={styles.commonDetail}>F SIZE: {item.f_size || "-"}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}