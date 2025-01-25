import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 7,
  },
});

export function InvoiceFooter() {
  return (
    <View style={styles.footer}>
      <Text>© Optik Loov</Text>
    </View>
  );
}