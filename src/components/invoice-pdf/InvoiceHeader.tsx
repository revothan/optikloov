
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";

const styles = StyleSheet.create({
  header: {
    marginBottom: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    width: "40%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  invoiceText: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
    textAlign: "right",
  },
  rightInfoContainer: {
    width: "100%",
    alignItems: "flex-end",
  },
  rightInfoRow: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 1,
    justifyContent: "flex-end",
  },
  rightLabel: {
    fontSize: 8,
    textAlign: "right",
  },
  rightColon: {
    fontSize: 8,
    width: "8",
    textAlign: "center",
  },
  rightValue: {
    fontSize: 8,
    width: "100",
    textAlign: "right",
  },
  companyName: {
    fontSize: 12,
    marginBottom: 2,
    fontWeight: "bold",
  },
  storeInfoContainer: {
    fontSize: 6,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 1,
  },
  label: {
    width: "35",
  },
  colon: {
    width: "8",
  },
  value: {
    flex: 1,
  },
});

interface InvoiceHeaderProps {
  invoiceNumber: string;
  saleDate: string;
  acknowledgedBy?: string;
  branch: string;
}

export function InvoiceHeader({
  invoiceNumber,
  saleDate,
  acknowledgedBy,
  branch,
}: InvoiceHeaderProps) {
  const getBranchInfo = () => {
    if (branch === "Kelapa Dua") {
      return {
        storeName: "OPTIK LOOV (Kelapa Dua)",
        address: [
          "Ruko Sentra Niaga, Jl. Danau Klp. Dua Raya No. 11,",
          "Klp. Dua, Kec. Klp. Dua, Kabupaten Tangerang, Banten 15810",
        ],
        phone: "0812 9063 5568",
      };
    }
    // Default to Gading Serpong
    return {
      storeName: "OPTIK LOOV",
      address: [
        "Ruko Downtown Drive, Kecamatan No. 016 Blok DDBLV, Medang,",
        "Kec. Pagedangan, Kabupaten Tangerang, Banten 15334",
      ],
      phone: "0812 8333 5568",
    };
  };

  const branchInfo = getBranchInfo();

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <Text style={styles.companyName}>{branchInfo.storeName}</Text>
        <View style={styles.storeInfoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Alamat</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{branchInfo.address[0]}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}></Text>
            <Text style={styles.colon}></Text>
            <Text style={styles.value}>{branchInfo.address[1]}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Telp/WA</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>{branchInfo.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Website</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>optikloov.com</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.value}>optik.loov@gmail.com</Text>
          </View>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.invoiceText}>Invoice No. {invoiceNumber}</Text>
        <View style={styles.rightInfoContainer}>
          <View style={styles.rightInfoRow}>
            <Text style={styles.rightLabel}>Date</Text>
            <Text style={styles.rightColon}>:</Text>
            <Text style={styles.rightValue}>
              {format(new Date(saleDate), "dd MMM yyyy")}
            </Text>
          </View>
          <View style={styles.rightInfoRow}>
            <Text style={styles.rightLabel}>Pemeriksa</Text>
            <Text style={styles.rightColon}>:</Text>
            <Text style={styles.rightValue}>
              {acknowledgedBy || "_________________"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
