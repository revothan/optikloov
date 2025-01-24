import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatPrice } from "@/lib/utils";

const styles = StyleSheet.create({
  totals: {
    marginTop: 10,
    padding: 5,
    border: '1 solid #999',
    fontSize: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
  },
  label: {
    color: '#666',
  }
});

interface PaymentDetailsProps {
  totalAmount: number;
  discountAmount: number;
  grandTotal: number;
  downPayment?: number;
  remainingBalance?: number;
}

export function PaymentDetails({
  totalAmount,
  discountAmount,
  grandTotal,
  downPayment = 0,
  remainingBalance = 0,
}: PaymentDetailsProps) {
  return (
    <View style={styles.totals}>
      <View style={styles.row}>
        <Text style={styles.label}>Total: {formatPrice(totalAmount)}</Text>
        <Text style={styles.label}>Disc: {formatPrice(discountAmount)}</Text>
      </View>
      <View style={styles.row}>
        <Text>Grand Total: {formatPrice(grandTotal)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>DP: {formatPrice(downPayment)}</Text>
        <Text>Balance: {formatPrice(remainingBalance)}</Text>
      </View>
    </View>
  );
}