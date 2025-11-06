let baseUrl = ''
let urlLocalhost = 'http://localhost:8000/api/'

baseUrl = import.meta.env.VITE_APP_API_URL + '/api/'

//A
export const AccReceive = urlLocalhost + 'account_receivable'
export const AccUpdateDeposit = urlLocalhost + 'account_receivable_deposit'
export const AccUpdateReset = urlLocalhost + 'account_receivable_reset'
export const AccPayableDeposit = urlLocalhost + 'account_payable_deposit'
export const AccPayableDepositJakir = urlLocalhost + 'account_payable_deposit_jakir'
export const AccPayableReset = urlLocalhost + 'account_payable_reset'
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

export const DocumentFile = urlLocalhost + 'documents';

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
export const GetAbsorb = urlLocalhost + 'opex/absorb'
export const AddOpex = urlLocalhost + 'opex_code'
export const AddOpexApprove = urlLocalhost + 'opex_code/approved'
export const DeleteOpex = urlLocalhost + 'opex_delete'
//P
export const Product = urlLocalhost + 'products'
export const ProductSearch = urlLocalhost + 'products/search'
export const ProductCode = urlLocalhost + 'products_code'

export const PackageADRS = urlLocalhost + 'package_adrs'
export const PackageDetails = urlLocalhost + 'package_details'
export const PackageADRSCode = urlLocalhost + 'package_adrs'

export const PurchaseOrder = urlLocalhost + 'purchase_orders'
export const PurchaseOrderMonthly = urlLocalhost + 'purchase_orders/monthly'
export const PurchaseOrderAdd = urlLocalhost + 'purchase_orders_code'
export const PurchaseOrderDelete = urlLocalhost + 'purchase_orders_delete'
export const PurchaseOrderRestore = urlLocalhost + 'purchase_orders_restore'

export const PoJasaKirim = urlLocalhost + 'po-jasakirim'
export const PoJasaKirimDetail = urlLocalhost + 'po-jasakirim/detail'
export const PoJasaKirimCode = urlLocalhost + 'po-jasakirim/store'

//Q
export const Quatations = urlLocalhost + 'quatations'
export const QuatationsCode = urlLocalhost + 'code_quo'
export const QuatationsAdd = urlLocalhost + 'quatations_code'
export const QuatationsDelete = urlLocalhost + 'quatations_delete'

//R
export const ReportSales = urlLocalhost + 'sales_count'
//S
export const SalesOrders = urlLocalhost + 'sales_orders'
export const SalesOrdersMonthly = urlLocalhost + 'sales_orders/monthly'
export const SalesOrderAdd = urlLocalhost + 'sales_orders_code'
export const SalesOrderDelete = urlLocalhost + 'sales_orders_delete'
//T
export const Tandater = urlLocalhost + 'tandater'
export const TandaterDelete = urlLocalhost + 'tandater/delete'
export const TandaterAdd = urlLocalhost + 'addTandater'
//v
export const Vendor = urlLocalhost + 'vendors'
export const AddVendor = urlLocalhost + 'vendors_code'

export const GetFakturPajak = urlLocalhost + 'faktur-pajak'
export const AddFakturPajak = urlLocalhost + 'faktur-pajak-code'
export const GetReportManagement = urlLocalhost + 'report_management'
export const GetSalesManagement = urlLocalhost + 'sales_report'
