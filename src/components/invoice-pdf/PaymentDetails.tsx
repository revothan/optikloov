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
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  label: {
    color: '#666',
  },
  amountGroup: {
    flexDirection: 'row',
    gap: 20,
  },
  boldText: {
    fontFamily: 'Helvetica-Bold',
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
        <View style={styles.amountGroup}>
          <Text style={styles.label}>Total: {formatPrice(totalAmount)}</Text>
          <Text style={styles.label}>Disc: {formatPrice(discountAmount)}</Text>
        </View>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.boldText}>Grand Total: {formatPrice(grandTotal)}</Text>
      </View>
      
      <View style={styles.row}>
        <View style={styles.amountGroup}>
          <Text style={styles.label}>DP: {formatPrice(downPayment)}</Text>
          <Text style={styles.boldText}>
            Sisa Pembayaran: {remainingBalance === 0 ? "LUNAS" : formatPrice(remainingBalance)}
          </Text>
        </View>
      </View>
    </View>
  );
}