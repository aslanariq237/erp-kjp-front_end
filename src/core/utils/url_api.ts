let baseUrl = ''

baseUrl = import.meta.env.VITE_APP_API_URL + '/api/'
let laraUrl = 'http://127.0.0.1:8000/api/'
//B
export const BankAccount = baseUrl + 'bank_accounts';
//C
export const Customer = baseUrl + 'customers';
export const GetCustomer = laraUrl + 'customers';
export const AddCustomer = laraUrl + 'store-customers';
export const CustomerCode = baseUrl + 'customers_code';

//E
export const Employee = baseUrl + 'employees';
export const EmployeeCode = baseUrl + 'employees_code';

//I
export const Invoice = baseUrl + 'invoices';

//P
export const Product = baseUrl + 'products';
export const ProductCode = baseUrl + 'products_code';

export const PurchaseOrder = baseUrl + 'purchase_orders';

export const PaymentTypes = baseUrl + 'payment_types';
