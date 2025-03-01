let baseUrl = ''

baseUrl = import.meta.env.VITE_APP_API_URL + '/api/'
let laraUrl = 'http://127.0.0.1:8000/api/'

//A
export const AccReceive = baseUrl + 'account_receivable';
export const AccPayable = baseUrl + 'account_payable';
//B
export const BankAccount = baseUrl + 'bank_accounts'
//C
export const Customer = baseUrl + 'customers'
export const GetCustomer = laraUrl + 'customers'
export const AddCustomer = laraUrl + 'store-customers'
export const CustomerCode = baseUrl + 'customers_code'


//D
export const DeliveryOrder = baseUrl + 'delivery_orders';
export const DeliverSales = baseUrl + 'delivery_sales';
export const AddDeliveryOrder = baseUrl + 'store-do';
export const DetailPo = baseUrl + 'detail_po';
export const DetailSo = baseUrl + 'details_so';
export const DetailDo = baseUrl + 'detail_do';
//E
export const Employee = baseUrl + 'employees'
export const EmployeeCode = baseUrl + 'employees_code'

//I
export const Invoice = baseUrl + 'invoices'
export const InvoiceAdd = baseUrl + 'invoices_code'
//O
export const GetOpex = baseUrl + 'opex';
//P
export const Product = baseUrl + 'products'

export const PurchaseOrder = baseUrl + 'purchase_orders'
export const PurchaseOrderAdd = baseUrl + 'purchase_orders_code'

//S
export const SalesOrders = baseUrl + 'sales_orders';
export const SalesOrderAdd = baseUrl + 'sales_orders_code';

//v
export const Vendor = baseUrl + 'vendors';
