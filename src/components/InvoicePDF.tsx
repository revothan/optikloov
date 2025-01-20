import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 16,
    marginBottom: 5,
  },
  details: {
    marginBottom: 20,
  },
  table: {
    display: "flex",
    width: "100%",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    paddingVertical: 5,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
  totals: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  prescription: {
    marginTop: 20,
    marginBottom: 20,
  },
  prescriptionTitle: {
    fontSize: 14,
    marginBottom: 10,
  },
});

interface InvoicePDFProps {
  invoice: any;
  items: any[];
  onLoadComplete?: () => Promise<any[]>;
}

export function InvoicePDF({ invoice, items: initialItems, onLoadComplete }: InvoicePDFProps) {
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    const loadItems = async () => {
      if (onLoadComplete) {
        const loadedItems = await onLoadComplete();
        setItems(loadedItems);
      }
    };
    loadItems();
  }, [onLoadComplete]);

  // Group products by product_id to avoid duplication
  const uniqueProducts = items.reduce<Record<string, any>>((acc, item) => {
    if (!acc[item.product_id]) {
      acc[item.product_id] = item;
    }
    return acc;
  }, {});

  // Find prescription details for right and left eyes
  const rightEye = items.find(item => item.eye_side === 'right');
  const leftEye = items.find(item => item.eye_side === 'left');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Invoice #{invoice.invoice_number}</Text>
          <Text style={styles.companyName}>OPTIK LOOV</Text>
          <Text>Date: {format(new Date(invoice.sale_date), "dd MMM yyyy")}</Text>
        </View>

        <View style={styles.details}>
          <Text>Customer: {invoice.customer_name}</Text>
          <Text>Address: {invoice.customer_address || '-'}</Text>
          <Text>Phone: {invoice.customer_phone || '-'}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Product</Text>
            <Text style={styles.tableCell}>Brand</Text>
            <Text style={styles.tableCell}>Quantity</Text>
            <Text style={styles.tableCell}>Price</Text>
            <Text style={styles.tableCell}>Discount</Text>
            <Text style={styles.tableCell}>Total</Text>
          </View>
          {Object.values(uniqueProducts).map((item: any, index: number) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.products?.name || '-'}</Text>
              <Text style={styles.tableCell}>{item.products?.brand || '-'}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>{formatPrice(item.price)}</Text>
              <Text style={styles.tableCell}>{formatPrice(item.discount)}</Text>
              <Text style={styles.tableCell}>{formatPrice(item.total)}</Text>
            </View>
          ))}
        </View>

        {(rightEye || leftEye) && (
          <View style={styles.prescription}>
            <Text style={styles.prescriptionTitle}>Prescription Details</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>Eye</Text>
                <Text style={styles.tableCell}>SPH</Text>
                <Text style={styles.tableCell}>CYL</Text>
                <Text style={styles.tableCell}>AXIS</Text>
                <Text style={styles.tableCell}>ADD</Text>
                <Text style={styles.tableCell}>PD</Text>
              </View>
              {rightEye && (
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Right Eye (OD)</Text>
                  <Text style={styles.tableCell}>{rightEye.sph || '-'}</Text>
                  <Text style={styles.tableCell}>{rightEye.cyl || '-'}</Text>
                  <Text style={styles.tableCell}>{rightEye.axis || '-'}</Text>
                  <Text style={styles.tableCell}>{rightEye.add_power || '-'}</Text>
                  <Text style={styles.tableCell}>{rightEye.pd || '-'}</Text>
                </View>
              )}
              {leftEye && (
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Left Eye (OS)</Text>
                  <Text style={styles.tableCell}>{leftEye.sph || '-'}</Text>
                  <Text style={styles.tableCell}>{leftEye.cyl || '-'}</Text>
                  <Text style={styles.tableCell}>{leftEye.axis || '-'}</Text>
                  <Text style={styles.tableCell}>{leftEye.add_power || '-'}</Text>
                  <Text style={styles.tableCell}>{leftEye.pd || '-'}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={styles.totals}>
          <Text>Total Amount: {formatPrice(invoice.total_amount)}</Text>
          <Text>Discount: {formatPrice(invoice.discount_amount)}</Text>
          <Text>Grand Total: {formatPrice(invoice.grand_total)}</Text>
          <Text>Down Payment: {formatPrice(invoice.down_payment || 0)}</Text>
          <Text>Remaining Balance: {formatPrice(invoice.remaining_balance || 0)}</Text>
        </View>
      </Page>
    </Document>
  );
}