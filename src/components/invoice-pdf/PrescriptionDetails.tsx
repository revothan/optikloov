import { Text, View, StyleSheet } from "@react-pdf/renderer";
const styles = StyleSheet.create({
  section: {
    margin: 6,
    padding: 6,
    border: "1px solid #000",
    borderRadius: 3,
  },
  title: {
    fontSize: 10,
    marginBottom: 3,
    fontWeight: "bold",
  },
  itemContainer: {
    marginBottom: 6,
  },
  productInfo: {
    marginBottom: 3,
  },
  productName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  commonDetails: {
    marginBottom: 3,
    fontSize: 7,
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
    width: "16.66%",
    padding: 3,
    borderRight: "1px solid #000",
  },
  headerCell: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    textAlign: "center",
  },
  tableCell: {
    fontSize: 7,
    textAlign: "center",
  },
});

const formatValue = (
  value: number | null | undefined,
  type: "sph" | "add" | "cyl" | "axis" | "mpd" | "pv" | "prism" | "dbl",
): string => {
  if (value === null || value === undefined || value === 0) {
    switch (type) {
      case "sph":
      case "add":
      case "cyl":
        return "0.00";
      case "axis":
        return "0";
      default:
        return "-";
    }
  }

  if (typeof value !== "number") return String(value);

  switch (type) {
    case "sph":
    case "add":
      // Format to 2 decimal places first
      const formatted = Math.abs(value).toFixed(2);
      // Then add sign for non-zero values
      return value === 0
        ? "0.00"
        : value > 0
          ? `+${formatted}`
          : `-${formatted}`;

    case "cyl":
      // Always negative or zero for CYL
      return value === 0 ? "0.00" : value.toFixed(2);

    case "axis":
      return Math.round(value).toString();

    case "dbl":
      // Round to whole number with NO decimal places
      return Math.round(value).toString();

    case "mpd":
    case "pv":
    case "prism":
      // Show as is
      return value.toString();

    default:
      return value.toFixed(2);
  }
};

export function PrescriptionDetails({ items }) {
  const lensaItems = items.filter(
    (item) =>
      item.products?.category === "Lensa" &&
      (item.right_eye_mpd !== null || item.left_eye_mpd !== null),
  );

  if (lensaItems.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Prescription Details</Text>
      {lensaItems.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.products?.name || "-"}</Text>
            <Text style={styles.commonDetails}>
              Frame Size: {item.f_size || "-"} | V-Frame: {item.v_frame || "-"}{" "}
              | PV: {formatValue(item.pv, "pv")} | PRISM:{" "}
              {formatValue(item.prism, "prism")} | DBL:{" "}
              {formatValue(item.dbl, "dbl")}
            </Text>
          </View>

          <View style={styles.prescriptionTable}>
            <View style={styles.tableHeader}>
              <View style={styles.tableCol}>
                <Text style={styles.headerCell}>Eye</Text>
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
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>R</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {formatValue(item.right_eye_sph, "sph")}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {formatValue(item.right_eye_cyl, "cyl")}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {formatValue(item.right_eye_axis, "axis")}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {formatValue(item.right_eye_add_power, "add")}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {formatValue(item.right_eye_mpd, "mpd")}
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>L</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {formatValue(item.left_eye_sph, "sph")}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {formatValue(item.left_eye_cyl, "cyl")}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {formatValue(item.left_eye_axis, "axis")}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {formatValue(item.left_eye_add_power, "add")}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {formatValue(item.left_eye_mpd, "mpd")}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

