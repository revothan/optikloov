import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  section: {
    marginVertical: 6,
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    minHeight: 16,
  },
  tableCol: {
    width: "20%",
    borderLeftWidth: 0.5,
    borderLeftColor: "#000",
    justifyContent: "center",
    padding: 2,
  },
  tableCell: {
    fontSize: 7,
    textAlign: "center",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  headerCell: {
    fontSize: 7,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
  },
  title: {
    fontSize: 8,
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
  },
  subtitle: {
    fontSize: 7,
    marginTop: 4,
    marginBottom: 2,
    fontFamily: "Helvetica-Bold",
  },
  productName: {
    fontSize: 7,
    marginBottom: 4,
    color: "#666",
  },
});

const formatPrescriptionValue = (value: number | null | undefined, type: 'sph' | 'add' | 'cyl' | 'other'): string => {
  if (value === null || value === undefined) return "-";
  
  if (typeof value !== 'number') return String(value);

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
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.pv, 'other')}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.v_frame || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.f_size || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.prism, 'other')}</Text>
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
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.right_eye_mpd, 'other')}</Text>
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
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.left_eye_mpd, 'other')}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}