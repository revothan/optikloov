import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { formatPrice } from "@/lib/utils";

const styles = StyleSheet.create({
  table: {
    width: "100%",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    paddingVertical: 3, // Increased padding
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: 'bold',
  },
  tableCell: {
    fontSize: 9, // Increased from 7
    padding: 2, // Increased padding
  },
  productCell: {
    flex: 2,
    fontSize: 9, // Increased from 7
    fontFamily: 'Helvetica-Bold',
  },
  brandCell: {
    flex: 1,
    fontSize: 9, // Increased from 7
  },
  numberCell: {
    flex: 1,
    textAlign: 'left',
    fontSize: 9, // Increased from 7
  },
  priceCell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    fontSize: 9, // Increased from 7
  },
});

interface ItemsTableProps {
  items: any[];
}

export function ItemsTable({ items }: ItemsTableProps) {
  const formatPriceWithAlignment = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  return (
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={[styles.tableCell, styles.productCell]}>Product</Text>
        <Text style={[styles.tableCell, styles.brandCell]}>Brand</Text>
        <Text style={[styles.tableCell, styles.numberCell]}>Qty</Text>
        <Text style={[styles.tableCell, styles.numberCell]}>Price</Text>
        <Text style={[styles.tableCell, styles.numberCell]}>Disc</Text>
        <Text style={[styles.tableCell, styles.numberCell]}>Total</Text>
      </View>
      {items.map((item, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.productCell]}>{item.products?.name || '-'}</Text>
          <Text style={[styles.tableCell, styles.brandCell]}>{item.products?.brand || '-'}</Text>
          <Text style={[styles.tableCell, styles.numberCell]}>{item.quantity}</Text>
          <Text style={[styles.tableCell, styles.numberCell]}>{formatPriceWithAlignment(item.price)}</Text>
          <Text style={[styles.tableCell, styles.numberCell]}>{formatPriceWithAlignment(item.discount)}</Text>
          <Text style={[styles.tableCell, styles.numberCell]}>{formatPriceWithAlignment(item.total)}</Text>
        </View>
      ))}
    </View>
  );
}