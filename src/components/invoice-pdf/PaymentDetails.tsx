import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatPrice } from "@/lib/utils";

const styles = StyleSheet.create({
  container: {
    border: "1 solid #999",
    padding: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  label: {
    color: "#666",
  },
  value: {
    minWidth: 80,
    textAlign: "right",
  },
  boldText: {
    fontFamily: "Helvetica-Bold",
  },
  finalRow: {
    marginBottom: 0,
    marginTop: 2,
    paddingTop: 2,
    borderTopWidth: 1,
    borderTopColor: "#999",
    borderTopStyle: "solid",
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
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Total:</Text>
        <Text style={styles.value}>{formatPrice(totalAmount)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Disc:</Text>
        <Text style={styles.value}>{formatPrice(discountAmount)}</Text>
      </View>
      <View style={[styles.row, styles.boldText]}>
        <Text>Grand Total:</Text>
        <Text style={styles.value}>{formatPrice(grandTotal)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>DP:</Text>
        <Text style={styles.value}>{formatPrice(downPayment)}</Text>
      </View>
      <View style={[styles.row, styles.boldText, styles.finalRow]}>
        <Text>Remaining Balance:</Text>
        <Text style={styles.value}>
          {remainingBalance === 0 ? "LUNAS" : formatPrice(remainingBalance)}
        </Text>
      </View>
    </View>
  );
}

