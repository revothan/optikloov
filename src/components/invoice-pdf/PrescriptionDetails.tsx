import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  section: {
    margin: 10,
    padding: 10,
    border: "1px solid #000",
    borderRadius: 5,
  },
  title: {
    fontSize: 12,
    marginBottom: 5,
    fontWeight: "bold",
  },
  itemContainer: {
    marginBottom: 10,
  },
  productInfo: {
    marginBottom: 5,
  },
  itemDetails: {
    fontSize: 10,
  },
  prescriptionTable: {
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
  },
  tableCol: {
    width: "12.5%",
    padding: 5,
    borderRight: "1px solid #000",
  },
  headerCell: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    textAlign: "center",
  },
  tableCell: {
    fontSize: 8,
    textAlign: "center",
  },
  productName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
});

const formatPrescriptionValue = (value: number | null | undefined, type: 'sph' | 'add' | 'cyl' | 'mpd' | 'pv' | 'prism' | 'dbl' | 'other'): string => {
  if (value === null || value === undefined) return "-";
  
  if (typeof value !== 'number') return String(value);

  // Special handling for MPD, PV, Prism, and DBL - no fixed decimal places
  if (type === 'mpd' || type === 'pv' || type === 'prism' || type === 'dbl') {
    return value === 0 ? "0" : String(value);
  }

  // For other types, show 2 decimal places
  return value === 0 ? "0.00" : value.toFixed(2);
};

export function PrescriptionDetails({ items }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Prescription Details</Text>
      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.product?.name || "-"}</Text>
            <Text style={styles.itemDetails}>
              Frame Size: {item.f_size || "-"} | V-Frame: {item.v_frame || "-"}
            </Text>
            <Text style={styles.itemDetails}>
              PV: {formatPrescriptionValue(item.pv, 'pv')}
            </Text>
          </View>

          {/* Prescription Table */}
          <View style={styles.prescriptionTable}>
            <View style={styles.tableHeader}>
              <View style={styles.tableCol}>
                <Text style={styles.headerCell}></Text>
              </View>
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
              <View style={styles.tableCol}>
                <Text style={styles.headerCell}>PRISM</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headerCell}>DBL</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>R</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.right_eye?.sph, 'sph')}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.right_eye?.cyl, 'cyl')}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.right_eye?.axis || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.right_eye?.add_power, 'add')}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.right_eye?.mpd, 'mpd')}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.prism, 'prism')}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.right_eye?.dbl, 'dbl')}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>L</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.left_eye?.sph, 'sph')}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.left_eye?.cyl, 'cyl')}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.left_eye?.axis || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.left_eye?.add_power, 'add')}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.left_eye?.mpd, 'mpd')}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.prism, 'prism')}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{formatPrescriptionValue(item.left_eye?.dbl, 'dbl')}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}