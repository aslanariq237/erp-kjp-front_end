import ApiService from "../../../core/services/ApiServices";
import {Customer, CustomerCode} from "../../utils/url_api"

class ApiCustomer {
    async getCode(){
        try {
            const customer = await ApiService.get(Customer)
            return customer.data.data
        } catch (error) {
            return {error};
        }
    }
}

export default ApiCustomer