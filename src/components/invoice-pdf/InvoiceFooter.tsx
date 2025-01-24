import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: 'center',
    borderTop: '1 solid #999',
    paddingTop: 5,
    fontSize: 8,
  },
});

interface InvoiceFooterProps {
  acknowledgedBy?: string;
  receivedBy?: string;
}

export function InvoiceFooter({ acknowledgedBy, receivedBy }: InvoiceFooterProps) {
  return (
    <View style={styles.footer}>
      <Text>Pemeriksa: {acknowledgedBy || '_________________'}</Text>
      <Text>Diterima Oleh: {receivedBy || '_________________'}</Text>
    </View>
  );
}