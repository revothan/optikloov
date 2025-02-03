import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  section: {
    marginVertical: 4,
  },
  table: {
    width: "100%",
    border: "1 solid #000",
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "0.5 solid #000",
    minHeight: 14,
  },
  tableCol: {
    width: "20%",
    justifyContent: "center",
    padding: 2,
  },
  tableCell: {
    fontSize: 8,
    textAlign: "center",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
  },
  headerCell: {
    fontSize: 8,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
  },
  title: {
    fontSize: 10,
    marginBottom: 2,
    fontFamily: "Helvetica-Bold",
  },
  subtitle: {
    fontSize: 9,
    marginTop: 2,
    marginBottom: 1,
    fontFamily: "Helvetica-Bold",
  },
  productName: {
    fontSize: 8,
    marginBottom: 2,
    color: "#666",
  },
});

const formatPrescriptionValue = (value: number | null | undefined, type: 'sph' | 'add' | 'cyl' | 'mpd' | 'pv' | 'prism' | 'other'): string => {
  if (value === null || value === undefined) return "-";
  
  if (typeof value !== 'number') return String(value);

  // Special handling for MPD, PV, and Prism - no fixed decimal places
  if (type === 'mpd' || type === 'pv' || type === 'prism') {
    return value === 0 ? "0" : String(value);
  }

  const absValue = Math.abs(value).toFixed(2);

  switch (type) {
    case 'sph':
      return value === 0 ? "0.00" : value > 0 ? `+${absValue}` : `-${absValue}`;
    case 'add':
      return value === 0 ? "0.00" : `+${absValue}`;
    case 'cyl':
      return value === 0 ? "0.00" : `-${absValue}`;
    default:
      return value === 0 ? "0.00" : absValue;
  }
};

export function PrescriptionDetails({ items }: { items: any[] }) {
  const lensItems = items.filter((item) => item.products?.category === "Lensa");

  if (lensItems.length === 0) return null;

  return (
    <View style={styles.section}>
      {lensItems.map((item, index) => (
        <View key={index} style={{ marginBottom: index < lensItems.length - 1 ? 8 : 0 }}>
          <Text style={styles.title}>Prescription Details</Text>
          <Text style={styles.productName}>{item.products?.name || "-"}</Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}>
                <Text style={styles.headerCell}>PV</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headerCell}>V FRAME</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headerCell}>F SIZE</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headerCell}>PRISM</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headerCell}>QTY</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.pv, 'pv')}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.v_frame || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.f_size || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.prism, 'prism')}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.quantity || "-"}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.subtitle}>Right Eye (OD)</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}>
                <Text style={styles.headerCell}>SPH</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headerCell}>CYL</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headerCell}>AXIS</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headerCell}>ADD</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headerCell}>MPD</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.right_eye_sph, 'sph')}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.right_eye_cyl, 'cyl')}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.right_eye_axis || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.right_eye_add_power, 'add')}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.right_eye_mpd, 'mpd')}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.subtitle}>Left Eye (OS)</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}>
                <Text style={styles.headerCell}>SPH</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headerCell}>CYL</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headerCell}>AXIS</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headerCell}>ADD</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headerCell}>MPD</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.left_eye_sph, 'sph')}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.left_eye_cyl, 'cyl')}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.left_eye_axis || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.left_eye_add_power, 'add')}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.left_eye_mpd, 'mpd')}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}