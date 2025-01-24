import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  prescription: {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    border: '1 solid #999',
  },
  prescriptionTitle: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  table: {
    display: "flex",
    width: "100%",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    paddingVertical: 5,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
});

interface PrescriptionDetailsProps {
  rightEye?: any;
  leftEye?: any;
}

export function PrescriptionDetails({ rightEye, leftEye }: PrescriptionDetailsProps) {
  if (!rightEye && !leftEye) return null;

  return (
    <View style={styles.prescription}>
      <Text style={styles.prescriptionTitle}>Prescription Details</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Eye</Text>
          <Text style={styles.tableCell}>SPH</Text>
          <Text style={styles.tableCell}>CYL</Text>
          <Text style={styles.tableCell}>AXIS</Text>
          <Text style={styles.tableCell}>ADD</Text>
          <Text style={styles.tableCell}>SH</Text>
          <Text style={styles.tableCell}>PRISM</Text>
        </View>
        {rightEye && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Right Eye (OD)</Text>
            <Text style={styles.tableCell}>{rightEye.sph || '-'}</Text>
            <Text style={styles.tableCell}>{rightEye.cyl || '-'}</Text>
            <Text style={styles.tableCell}>{rightEye.axis || '-'}</Text>
            <Text style={styles.tableCell}>{rightEye.add_power || '-'}</Text>
            <Text style={styles.tableCell}>{rightEye.sh || '-'}</Text>
            <Text style={styles.tableCell}>{rightEye.prism || '-'}</Text>
          </View>
        )}
        {leftEye && (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Left Eye (OS)</Text>
            <Text style={styles.tableCell}>{leftEye.sph || '-'}</Text>
            <Text style={styles.tableCell}>{leftEye.cyl || '-'}</Text>
            <Text style={styles.tableCell}>{leftEye.axis || '-'}</Text>
            <Text style={styles.tableCell}>{leftEye.add_power || '-'}</Text>
            <Text style={styles.tableCell}>{leftEye.sh || '-'}</Text>
            <Text style={styles.tableCell}>{leftEye.prism || '-'}</Text>
          </View>
        )}
      </View>
      
      <View style={[styles.table, { marginTop: 10 }]}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>PD</Text>
          <Text style={styles.tableCell}>V FRAME</Text>
          <Text style={styles.tableCell}>F SIZE</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{rightEye?.pd || leftEye?.pd || '-'}</Text>
          <Text style={styles.tableCell}>{rightEye?.v_frame || leftEye?.v_frame || '-'}</Text>
          <Text style={styles.tableCell}>{rightEye?.f_size || leftEye?.f_size || '-'}</Text>
        </View>
      </View>
    </View>
  );
}