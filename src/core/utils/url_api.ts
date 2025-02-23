let baseUrl = ''

baseUrl = import.meta.env.VITE_APP_API_URL + '/api/'
let laraUrl = 'http://127.0.0.1:8000/api/'

export const Customer = baseUrl + 'customers'
export const GetCustomer = laraUrl + 'customers'
export const AddCustomer = laraUrl + 'store-customers'
export const CustomerCode = baseUrl + 'customers_code'
