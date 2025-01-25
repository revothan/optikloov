import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatPrice } from "@/lib/utils";

const styles = StyleSheet.create({
  table: {
    display: "flex",
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
    fontSize: 8,
    padding: 2,
  },
  productCell: {
    flex: 2,
  },
  brandCell: {
    flex: 1,
  },
  numberCell: {
    flex: 1,
    textAlign: 'right',
  },
  mpdCell: {
    flex: 0.8,
    textAlign: 'right',
  },
});

interface ItemsTableProps {
  items: any[];
}

export function ItemsTable({ items }: ItemsTableProps) {
  return (
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={[styles.tableCell, styles.productCell]}>Product</Text>
        <Text style={[styles.tableCell, styles.brandCell]}>Brand</Text>
        <Text style={[styles.tableCell, styles.mpdCell]}>MPD R</Text>
        <Text style={[styles.tableCell, styles.mpdCell]}>MPD L</Text>
        <Text style={[styles.tableCell, styles.numberCell]}>Qty</Text>
        <Text style={[styles.tableCell, styles.numberCell]}>Price</Text>
        <Text style={[styles.tableCell, styles.numberCell]}>Disc</Text>
        <Text style={[styles.tableCell, styles.numberCell]}>Total</Text>
      </View>
      {items.map((item: any, index: number) => (
        <View key={index} style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.productCell]}>{item.products?.name || '-'}</Text>
          <Text style={[styles.tableCell, styles.brandCell]}>{item.products?.brand || '-'}</Text>
          <Text style={[styles.tableCell, styles.mpdCell]}>{item.mpd_right || '-'}</Text>
          <Text style={[styles.tableCell, styles.mpdCell]}>{item.mpd_left || '-'}</Text>
          <Text style={[styles.tableCell, styles.numberCell]}>{item.quantity}</Text>
          <Text style={[styles.tableCell, styles.numberCell]}>{formatPrice(item.price)}</Text>
          <Text style={[styles.tableCell, styles.numberCell]}>{formatPrice(item.discount)}</Text>
          <Text style={[styles.tableCell, styles.numberCell]}>{formatPrice(item.total)}</Text>
        </View>
      ))}
    </View>
  );
}