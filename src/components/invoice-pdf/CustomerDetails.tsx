import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  details: {
    marginBottom: 20,
    padding: 10,
    border: '1 solid #999',
  },
});

interface CustomerDetailsProps {
  name: string;
  address?: string;
  phone?: string;
  paymentType?: string;
}

export function CustomerDetails({ name, address, phone, paymentType }: CustomerDetailsProps) {
  return (
    <View style={styles.details}>
      <Text>Customer: {name}</Text>
      <Text>Address: {address || '-'}</Text>
      <Text>Phone: {phone || '-'}</Text>
      <Text>Payment Type: {paymentType || '-'}</Text>
    </View>
  );
}