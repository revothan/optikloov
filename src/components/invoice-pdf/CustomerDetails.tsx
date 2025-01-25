import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  details: {
    marginBottom: 10,
    padding: 5,
    border: '1 solid #999',
    fontSize: 8,
  },
});

interface CustomerDetailsProps {
  name: string;
  address?: string;
  phone?: string;
  paymentType?: string;
  email?: string;
}

export function CustomerDetails({ name, address, phone, paymentType, email }: CustomerDetailsProps) {
  return (
    <View style={styles.details}>
      <Text>Customer: {name}</Text>
      <Text>Email: {email || '-'}</Text>
      <Text>Address: {address || '-'}</Text>
      <Text>Phone: {phone || '-'}</Text>
      <Text>Payment Type: {paymentType || '-'}</Text>
    </View>
  );
}