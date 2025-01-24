import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatPrice } from "@/lib/utils";

const styles = StyleSheet.create({
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

interface ItemsTableProps {
  items: any[];
}

export function ItemsTable({ items }: ItemsTableProps) {
  return (
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={styles.tableCell}>Product</Text>
        <Text style={styles.tableCell}>Brand</Text>
        <Text style={styles.tableCell}>Quantity</Text>
        <Text style={styles.tableCell}>Price</Text>
        <Text style={styles.tableCell}>Discount</Text>
        <Text style={styles.tableCell}>Total</Text>
      </View>
      {items.map((item: any, index: number) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.tableCell}>{item.products?.name || '-'}</Text>
          <Text style={styles.tableCell}>{item.products?.brand || '-'}</Text>
          <Text style={styles.tableCell}>{item.quantity}</Text>
          <Text style={styles.tableCell}>{formatPrice(item.price)}</Text>
          <Text style={styles.tableCell}>{formatPrice(item.discount)}</Text>
          <Text style={styles.tableCell}>{formatPrice(item.total)}</Text>
        </View>
      ))}
    </View>
  );
}