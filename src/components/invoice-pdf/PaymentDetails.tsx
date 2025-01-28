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
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  label: {
    color: '#666',
    width: 80,
    textAlign: 'right',
  },
  value: {
    width: 90,
    textAlign: 'right',
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
      <View style={styles.rightSection}>
        <View style={styles.row}>
          <Text style={styles.label}>Total :</Text>
          <Text style={styles.value}>{formatPrice(totalAmount)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Disc :</Text>
          <Text style={styles.value}>{formatPrice(discountAmount)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, styles.boldText]}>Grand Total :</Text>
          <Text style={[styles.value, styles.boldText]}>{formatPrice(grandTotal)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>DP :</Text>
          <Text style={styles.value}>{formatPrice(downPayment)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, styles.boldText]}>Sisa Pembayaran :</Text>
          <Text style={[styles.value, styles.boldText]}>
            {remainingBalance === 0 ? "LUNAS" : formatPrice(remainingBalance)}
          </Text>
        </View>
      </View>
    </View>
  );
}