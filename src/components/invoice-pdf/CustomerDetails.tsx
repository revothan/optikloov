import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  details: {
    marginBottom: 10,
    padding: 5,
    border: '1 solid #999',
    fontSize: 8,
  },
  text: {
    textAlign: 'justify',
  }
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
      <Text style={styles.text}>Customer: {name}</Text>
      <Text style={styles.text}>Email: {email || '-'}</Text>
      <Text style={styles.text}>Address: {address || '-'}</Text>
      <Text style={styles.text}>Phone: {phone || '-'}</Text>
      <Text style={styles.text}>Payment Type: {paymentType || '-'}</Text>
    </View>
  );
}