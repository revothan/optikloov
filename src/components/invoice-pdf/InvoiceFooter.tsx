import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    top: 40,
    right: 20,
    textAlign: 'center',
    fontSize: 8,
  },
});

interface InvoiceFooterProps {
  acknowledgedBy?: string;
}

export function InvoiceFooter({ acknowledgedBy }: InvoiceFooterProps) {
  return (
    <View style={styles.footer}>
      <Text>Pemeriksa: {acknowledgedBy || '_________________'}</Text>
    </View>
  );
}