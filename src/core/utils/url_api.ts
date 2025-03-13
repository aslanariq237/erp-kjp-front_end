let baseUrl = ''

baseUrl = import.meta.env.VITE_APP_API_URL + '/api/'
let laraUrl = 'http://127.0.0.1:8000/api/'

//A
export const AccReceive = baseUrl + 'account_receivable';
export const AccPayable = baseUrl + 'account_payable';
export const Asset = baseUrl + 'assets';
export const AddAsset = baseUrl + 'assets_code';
//B
export const BankAccount = baseUrl + 'bank_accounts'
//C
export const Customer = baseUrl + 'customers'
export const GetCustomer = laraUrl + 'customers'
export const AddCustomer = laraUrl + 'store-customers'
export const CustomerCode = baseUrl + 'customers_code'

//D
export const DeliveryOrder = baseUrl + 'delivery_orders'
export const DeliverSales = baseUrl + 'delivery_sales'
export const AddDeliveryOrder = baseUrl + 'store-do'
export const DetailPo = baseUrl + 'detail_po'
export const DetailSo = baseUrl + 'details_so'
export const DetailDo = baseUrl + 'detail_do'
export const DetailQuatation = baseUrl + 'detail_quatation'

//E
export const Employee = baseUrl + 'employees'
export const EmployeeCode = baseUrl + 'employees_code'

//F
export const fileUpload = baseUrl + 'file-upload';
export const file = baseUrl + 'file';
//I
export const Invoice = baseUrl + 'invoices'
export const DetailInvoice = baseUrl + 'detail_invoices'
export const InvoiceAdd = baseUrl + 'invoices_code'

export const Inquiry = baseUrl + 'inquiry'
export const InquiryAdd = baseUrl + 'inquiry_code'

//L
export const LaporUang = baseUrl + 'laporan_keuangan'
//O
export const GetOpex = baseUrl + 'opex'
export const AddOpex = baseUrl + 'opex_code'
//P
export const Product = baseUrl + 'products'
export const ProductSearch = baseUrl + 'products/search'
export const ProductCode = baseUrl + 'products_code'

export const PurchaseOrder = baseUrl + 'purchase_orders'
export const PurchaseOrderMonthly = baseUrl + 'purchase_orders/monthly'
export const PurchaseOrderAdd = baseUrl + 'purchase_orders_code'
//Q
export const Quatations = baseUrl + 'quatations'
export const QuatationsAdd = baseUrl + 'quatations_code'
//S
export const SalesOrders = baseUrl + 'sales_orders'
export const SalesOrdersMonthly = baseUrl + 'sales_orders/monthly'
export const SalesOrderAdd = baseUrl + 'sales_orders_code'
//T
export const Tandater = baseUrl + 'tandater';
export const TandaterAdd = baseUrl + 'addTandater';
//v
export const Vendor = baseUrl + 'vendors'
export const AddVendor = baseUrl + 'vendors_code'

export const GetFakturPajak = baseUrl + 'faktur-pajak'
export const AddFakturPajak = baseUrl + 'faktur-pajak-code'
