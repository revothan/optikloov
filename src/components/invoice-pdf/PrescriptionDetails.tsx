import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  section: {
    marginBottom: 10,
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "12.5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 5,
    fontSize: 8,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontFamily: "Helvetica-Bold",
  },
  title: {
    fontSize: 12,
    marginBottom: 5,
    fontFamily: "Helvetica-Bold",
  },
  subtitle: {
    fontSize: 10,
    marginTop: 5,
    marginBottom: 3,
    fontFamily: "Helvetica-Bold",
  },
});

interface PrescriptionDetailsProps {
  items: any[];
}

export function PrescriptionDetails({ items }: PrescriptionDetailsProps) {
  const lensItems = items.filter((item) => item.products?.category === "Lensa");

  if (lensItems.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Prescription Details</Text>
      {lensItems.map((item, index) => (
        <View key={index}>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Product</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>PV</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>V FRAME</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>F SIZE</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>PRISM</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.products?.name || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.pv || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.v_frame || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.f_size || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.prism || "-"}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.subtitle}>Right Eye (OD)</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>SPH</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>CYL</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>AXIS</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>ADD</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>MPD</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.right_eye_sph || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.right_eye_cyl || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.right_eye_axis || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.right_eye_add_power || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.right_eye_mpd || "-"}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.subtitle}>Left Eye (OS)</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>SPH</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>CYL</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>AXIS</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>ADD</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>MPD</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.left_eye_sph || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.left_eye_cyl || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.left_eye_axis || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.left_eye_add_power || "-"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.left_eye_mpd || "-"}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}