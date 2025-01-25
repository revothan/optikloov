import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatPrice } from "@/lib/utils";

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    padding: 4,
    fontSize: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'column',
    gap: 1,
  },
  rightSection: {
    flexDirection: 'column',
    gap: 1,
    alignItems: 'flex-end',
  },
  label: {
    color: '#666',
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
    <View style={styles.container}>
      {/* Left section for Total and Discount */}
      <View style={styles.leftSection}>
        <Text style={styles.label}>Total: {formatPrice(totalAmount)}</Text>
        <Text style={styles.label}>Disc: {formatPrice(discountAmount)}</Text>
      </View>

      {/* Right section for Grand Total, DP, and Remaining Balance */}
      <View style={styles.rightSection}>
        <Text style={styles.boldText}>Grand Total: {formatPrice(grandTotal)}</Text>
        <Text style={styles.label}>DP: {formatPrice(downPayment)}</Text>
        <Text style={styles.boldText}>
          Sisa Pembayaran: {remainingBalance === 0 ? "LUNAS" : formatPrice(remainingBalance)}
        </Text>
      </View>
    </View>
  );
}