import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatPrice } from "@/lib/utils";

const styles = StyleSheet.create({
  totals: {
    marginTop: 10,
    alignItems: "flex-end",
    padding: 5,
    border: '1 solid #999',
    fontSize: 8,
  },
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
      <Text>Total Amount: {formatPrice(totalAmount)}</Text>
      <Text>Discount: {formatPrice(discountAmount)}</Text>
      <Text>Grand Total: {formatPrice(grandTotal)}</Text>
      <Text>Down Payment: {formatPrice(downPayment)}</Text>
      <Text>Remaining Balance: {formatPrice(remainingBalance)}</Text>
    </View>
  );
}