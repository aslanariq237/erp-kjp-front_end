let baseUrl = ''
let urlLocalhost = 'http://localhost:8000/api/'

baseUrl = import.meta.env.VITE_APP_API_URL + '/api/'

//A
export const AccReceive = urlLocalhost + 'account_receivable'
export const AccUpdateDeposit = urlLocalhost + 'account_receivable_deposit'
export const AccUpdateDepositAp = urlLocalhost + 'account_payable_deposit'
export const AccPayable = urlLocalhost + 'account_payable'
export const Asset = urlLocalhost + 'assets'
export const AddAsset = urlLocalhost + 'assets_code'
//B
export const BankAccount = urlLocalhost + 'bank_accounts'
//C
export const Customer = urlLocalhost + 'customers'
export const GetCustomer = urlLocalhost + 'customers'
export const AddCustomer = urlLocalhost + 'store-customers'
export const CustomerCode = urlLocalhost + 'customers_code'

//D
export const DeliveryOrder = urlLocalhost + 'delivery_orders'
export const DeliverSales = urlLocalhost + 'delivery_sales'
export const AddDeliveryOrder = urlLocalhost + 'store-do'
export const DetailPo = urlLocalhost + 'detail_po'
export const DetailSo = urlLocalhost + 'details_so'
export const DetailDo = urlLocalhost + 'detail_do'
export const DetailQuatation = urlLocalhost + 'detail_quatation'
export const DetailTandater = urlLocalhost + 'detail_tandater'

//E
export const Employee = urlLocalhost + 'employees'
export const EmployeeCode = urlLocalhost + 'employees_code'

//F
export const fileUpload = urlLocalhost + 'file-upload'
export const file = urlLocalhost + 'file'
export const fileDoc = urlLocalhost + 'documents'
//I
export const Invoice = urlLocalhost + 'invoices'
export const DetailInvoice = urlLocalhost + 'detail_invoices'
export const InvoiceAdd = urlLocalhost + 'invoices_code'

export const Inquiry = urlLocalhost + 'inquiry'
export const InquiryAdd = urlLocalhost + 'inquiry_code'

//L
export const LaporUang = urlLocalhost + 'laporan_keuangan'
export const Login = urlLocalhost + 'login'
//O
export const GetOpex = urlLocalhost + 'opex'
export const AddOpex = urlLocalhost + 'opex_code'
//P
export const Product = urlLocalhost + 'products'
export const ProductSearch = urlLocalhost + 'products/search'
export const ProductCode = urlLocalhost + 'products_code'

export const PurchaseOrder = urlLocalhost + 'purchase_orders'
export const PurchaseOrderMonthly = urlLocalhost + 'purchase_orders/monthly'
export const PurchaseOrderAdd = urlLocalhost + 'purchase_orders_code'
export const PurchaseOrderDelete = urlLocalhost + 'purchase_orders_delete'
//Q
export const Quatations = urlLocalhost + 'quatations'
export const QuatationsAdd = urlLocalhost + 'quatations_code'
export const QuatationsDelete = urlLocalhost + 'quatations_delete'
//S
export const SalesOrders = urlLocalhost + 'sales_orders'
export const SalesOrdersMonthly = urlLocalhost + 'sales_orders/monthly'
export const SalesOrderAdd = urlLocalhost + 'sales_orders_code'
export const SalesOrderDelete = urlLocalhost + 'sales_orders_delete'
//T
export const Tandater = urlLocalhost + 'tandater'
export const TandaterAdd = urlLocalhost + 'addTandater'
//v
export const Vendor = urlLocalhost + 'vendors'
export const AddVendor = urlLocalhost + 'vendors_code'

export const GetFakturPajak = urlLocalhost + 'faktur-pajak'
export const AddFakturPajak = urlLocalhost + 'faktur-pajak-code'
export const GetReportManagement = urlLocalhost + 'report_management'
