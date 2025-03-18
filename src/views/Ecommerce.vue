<template>
  <admin-layout>    
    <div class="grid grid-cols-6 gap-4 md:gap-6">
      <div class="col-span-12 space-y-6 xl:col-span-12">
        <ecommerce-metrics />        
        <monthly-target />        
      </div> 
      <div class="col-span-12 space-y-6 xl:col-span-12">              
        <monthly-quatation />        
      </div> 
      <div class="col-span-12 space-y-6 xl:col-span-12">              
        <monthly-invoice />        
      </div>      
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue'
import EcommerceMetrics from '../components/ecommerce/EcommerceMetrics.vue'
import MonthlyTarget from '../components/ecommerce/MonthlySale.vue'
import MonthlyQuatation from '@/components/ecommerce/MonthlyQuatation.vue'
import MonthlyInvoice from '@/components/ecommerce/MonthlyInvoice.vue'
export default {
  components: {
    AdminLayout,
    EcommerceMetrics,
    MonthlyTarget,    
    MonthlyQuatation,
    MonthlyInvoice
  },
  name: 'Ecommerce',  
}
</script>
