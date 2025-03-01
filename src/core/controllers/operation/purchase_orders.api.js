import axios from "axios"
import {PurchaseOrder, PurchaseOrderAdd} from "../../utils/url_api"

class ApiPurchaseOrder{
    async getAll(){
        await axios.get(PurchaseOrder).then(
            (res) => {
                return res.data;
            }
        ).catch((err) => console.log(err));
    }
    async createOrUpdate(
        customer_id,
        employee_id,
        termin,
        total_tax,
        status_payment,
        deposit,
        issue_at,
        due_at        
    ){        
        await axios.post(PurchaseOrderAdd, {            
            customer_id : customer_id,
            employee_id : employee_id,            
            termin : termin,
            total_tax : total_tax,
            status_payment : status_payment,            
            deposit: deposit,  
            issue_at : issue_at,
            due_at : due_at,          
            purchase_order_details : purchase_order_details,
        })
    }
}
export default ApiPurchaseOrder