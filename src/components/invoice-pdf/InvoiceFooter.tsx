import { View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
  },
});

interface InvoiceFooterProps {
  acknowledgedBy?: string;
}

export function InvoiceFooter({ acknowledgedBy }: InvoiceFooterProps) {
  return <View style={styles.footer} />;
}