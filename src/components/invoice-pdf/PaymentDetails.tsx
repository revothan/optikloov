import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatPrice } from "@/lib/utils";

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    padding: 4,
    fontSize: 7,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  rightSection: {
    flexDirection: 'column',
    gap: 1,
    alignItems: 'flex-end',
    width: '30%',
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
      {/* Right section for all payment details */}
      <View style={styles.rightSection}>
        <Text style={styles.label}>Total: {formatPrice(totalAmount)}</Text>
        <Text style={styles.label}>Disc: {formatPrice(discountAmount)}</Text>
        <Text style={styles.boldText}>Grand Total: {formatPrice(grandTotal)}</Text>
        <Text style={styles.label}>DP: {formatPrice(downPayment)}</Text>
        <Text style={styles.boldText}>
          Sisa Pembayaran: {remainingBalance === 0 ? "LUNAS" : formatPrice(remainingBalance)}
        </Text>
      </View>
    </View>
  );
}