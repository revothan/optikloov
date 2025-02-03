import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  details: {
    marginBottom: 6,
    padding: 4,
    border: '1 solid #999',
    fontSize: 7,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  label: {
    width: '60',
  },
  colon: {
    width: '10',
  },
  value: {
    flex: 1,
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
      <View style={styles.row}>
        <Text style={styles.label}>Customer</Text>
        <Text style={styles.colon}>:</Text>
        <Text style={styles.value}>{name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.colon}>:</Text>
        <Text style={styles.value}>{email || '-'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Address</Text>
        <Text style={styles.colon}>:</Text>
        <Text style={styles.value}>{address || '-'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.colon}>:</Text>
        <Text style={styles.value}>{phone || '-'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Payment Type</Text>
        <Text style={styles.colon}>:</Text>
        <Text style={styles.value}>{paymentType || '-'}</Text>
      </View>
    </View>
  );
}