import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import dayjs from "dayjs";

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
      fontWeight: 600,
    },
  ],
});
Font.register({
  family: "DejaVu Sans",
  fonts: [
    {
      src: "https://kendo.cdn.telerik.com/2017.2.621/styles/fonts/DejaVu/DejaVuSans.ttf",
    },
    {
      src: "https://kendo.cdn.telerik.com/2017.2.621/styles/fonts/DejaVu/DejaVuSans-Bold.ttf",
    },
  ],
});
const styles = StyleSheet.create({
  page: {
    marginRight: 10,
    marginBottom: 20,
    marginLeft: 10,
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 29,
    lineHeight: 1.5,
  },
  table: {
    display: "table",
    width: "auto",
    color: "#4b5563",
    marginRight: 10,
    marginBottom: 20,
    marginLeft: 10,
    marginTop: 0,
    borderRadius: "8px",
    borderColor: "#e9e9e9",
    borderStyle: "solid",
    borderWidth: 0.5,
    padding: 0,
    textAlign: "left",
  },
  tableRow: {
    // margin: 'auto',
    flexDirection: "row",
    paddingBottom: 2,
    paddingTop: 2,
    textAlign: "left",
    borderWidth: 0.8,
    borderColor: "#E5E7EB",
    borderBottom: "0",
  },
  tableRowHeder: {
    // margin: 'auto',
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    paddingBottom: 4,
    paddingTop: 4,
    paddingLeft: 0,
    borderBottomWidth: 0.8,
    borderColor: "#E5E7EB",
    borderStyle: "solid",
    textTransform: "uppercase",
    textAlign: "left",
  },
  tableCol: {
    width: "25%",
    textAlign: "left",

    // borderStyle: 'solid',
    // borderWidth: 1,
    // borderLeftWidth: 0.5,
    // borderTopWidth: 0.5,
    // borderBottomWidth: 0.5,
    // borderColor: '#d1d5db',
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    // textAlign:'center',
    paddingLeft: "0",
    paddingRight: "0",
    marginLeft: "13",
    marginRight: "13",
  },

  tableCellQuantity: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    textAlign: "center",
    paddingLeft: "0",
    paddingRight: "0",
    marginLeft: "12",
    marginRight: "12",
  },

  invoiceFirst: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 18,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottom: 1,
    borderColor: "#f3f4f6",
    // backgroundColor:'#EEF2FF',
  },
  invoiceSecond: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  invoiceSecondLeft: {
    flex: 1,
  },
  invoiceSecondRight: {
    flex: 1,
    alignItems: "flex-end",
    textAlign: "right",
  },
  lightLine: {
    borderBottomWidth: 0.7,
    borderColor: "#e5e7eb",
    marginVertical: 8,
    width: "100%",
  },
  invoiceThird: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    borderTop: 1,
    borderColor: "#ffffff",
    backgroundColor: "#f4f5f7",
    borderRadius: 12,
    marginLeft: "13",
    marginRight: "13",

    // backgroundColor:'#F2FCF9',
  },
  logo: {
    width: 64,
    height: 25,
    bottom: 5,
    right: 10,
    marginBottom: 10,
    textAlign: "right",
    color: "#4b5563",
    fontFamily: "Open Sans",
    fontWeight: "bold",
    fontSize: 10.3,

    marginRight: "39%",
    textTransform: "uppercase",
  },
  title: {
    color: "#2f3032",
    fontFamily: "Open Sans",
    fontWeight: "bold",
    fontSize: 8.1,
    textTransform: "uppercase",
  },
  info: {
    fontSize: 9,
    color: "#6b7280",
  },
  infoCost: {
    fontSize: 10,
    color: "#6b7280",
    marginLeft: "4%",
    marginTop: "7px",
    textAlign: "left",
    width: "25%",
  },
  invoiceNum: {
    fontSize: 9,
    color: "#6b7280",
    marginLeft: "6%",
  },
  topAddress: {
    fontSize: 10,
    color: "#6b7280",
    width: "100%",
    marginLeft: "20%",

    // textAlign: "right",
    // whiteSapce: "nowrap",
  },
  amount: {
    fontSize: 10,
    color: "#ef4444",
  },
  totalAmount: {
    fontSize: 10,
    color: "#ef4444",
    fontFamily: "Open Sans",
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "right",
  },
  status: {
    color: "#10b981",
  },
  quantity: {
    color: "#1f2937",
    textAlign: "center",
  },
  itemPrice: {
    color: "#1f2937",
    textAlign: "left",
  },
  header: {
    color: "#6b7280",
    fontSize: 9,
    fontFamily: "Open Sans",
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "left",
  },

  thanks: {
    color: "#22c55e",
  },
  infoRight: {
    textAlign: "right",
    fontSize: 9,
    color: "#6b7280",
    width: "25%",
    marginRight: "39%",
    fontFamily: "Open Sans",
    fontWeight: "bold",
  },
  titleRight: {
    textAlign: "right",
    fontFamily: "Open Sans",
    fontWeight: "bold",
    fontSize: 8.1,
    width: "25%",
    marginRight: "39%",
    textTransform: "uppercase",
    color: "#2f3032",
  },
  topBg: {
    // backgroundColor:'#EEF2FF',
  },
  invoiceDiv: {
    alignItems: "baseline",
  },
});

const InvoiceForDownload = ({
  data,
  currency,
  globalSetting,
  getNumberTwo,
  logo,
}) => {
  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.invoiceFirst}>
            <View>
              <Text style={{ fontFamily: "Open Sans", fontWeight: "bold" }}>
                INVOICE
              </Text>
              <Text style={styles.info}>Status : {data?.status}</Text>
            </View>
            <View style={styles.topBg}>
              <View style={{ width: "100%", alignItems: "flex-end" }}>
                <Image
                  src={logo || "https://healthandherbs.ovsinnovation.com/_next/image?url=%2Flogo%2Flogojwellary.png&w=1920&q=75"}
                  alt="Invoice"
                  style={{ width: 150, height: 60 }}
                />
              </View>
              <Text style={styles.topAddress}>
                {globalSetting?.address ||
                  "Noida, Uttar Pradesh, India"}
              </Text>
            </View>
          </View>

          <View style={styles.invoiceSecond}>
            <View style={styles.invoiceSecondLeft}>
              <Text style={styles.title}>Billed To:</Text>
              <Text style={styles.info}>{data?.user_info?.name}</Text>
              <Text style={styles.info}>{data?.user_info?.email}</Text>
              <Text style={styles.info}>{data?.user_info?.phone}</Text>
            </View>
            <View style={styles.invoiceSecondRight}>
              <Text style={styles.title}>Booking Details:</Text>
              <Text style={styles.info}>Check-in: {data?.checkInDate}</Text>
              <Text style={styles.info}>Check-out: {data?.checkOutDate}</Text>
            </View>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  <Text style={styles.header}>Sr.</Text>
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  <Text style={styles.header}>Product Name</Text>
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  <Text style={styles.header}>Quantity</Text>
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  <Text style={styles.header}>Item Price</Text>
                </Text>
              </View>

              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {" "}
                  <Text style={styles.header}>Amount</Text>
                </Text>
              </View>
            </View>
            {data?.cart?.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{i + 1} </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.title} </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {" "}
                    <Text style={styles.quantity}>{item.quantity}</Text>{" "}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {" "}
                    <Text style={styles.quantity}>
                      {currency}
                      {getNumberTwo(item.price)}
                    </Text>{" "}
                  </Text>
                </View>

                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    <Text style={styles.amount}>
                      {currency}
                      {getNumberTwo(item.itemTotal)}
                    </Text>{" "}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.invoiceThird}>
            <View>
              <Text style={styles.title}> Payment Method</Text>
              <Text style={styles.info}> {data.paymentMethod} </Text>
            </View>
            <View>
              <Text style={styles.title}>Shipping Cost</Text>
              <Text style={styles.info}>
                {currency}
                {getNumberTwo(data.shippingCost)}
              </Text>
            </View>
            <View>
              <Text style={styles.title}>Discount</Text>
              <Text style={styles.info}>
                {currency}
                {getNumberTwo(data.discount)}
              </Text>
            </View>
            <View>
              <Text style={styles.title}>TAX/GST</Text>
              <Text style={styles.info}>
                {currency}
                {getNumberTwo(data?.taxSummary?.totalTax || 0)}
              </Text>
            </View>
            <View>
              <Text style={styles.title}>Total Amount</Text>
              <Text style={styles.amount}>
                {currency}
                {getNumberTwo(data.total)}
              </Text>
            </View>
          </View>
          <View style={styles.lightLine} />

          <View
            style={{
              textAlign: "center",
              fontSize: 12,
              paddingBottom: 50,
              paddingTop: 50,
            }}
          >
            <Text>
              Thank you <Text style={styles.thanks}>{data.name},</Text> Your
              order have been received !
            </Text>
          </View>
        </Page>
      </Document>
    </>
  );
};

export default InvoiceForDownload;
