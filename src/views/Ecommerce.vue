<template>
  <admin-layout>
    <div class="grid grid-cols-6 gap-4 md:gap-6">
      <div class="col-span-12 space-y-6 xl:col-span-12">
        <ecommerce-metrics />
        <sales-target />
      </div>
      <div class="col-span-12 space-y-6 xl:col-span-12">
        <monthly-target />
      </div>
      <div class="col-span-12 space-y-6 xl:col-span-12">
        <monthly-quatation />
      </div>
      <div class="col-span-12 space-y-6 xl:col-span-12">
        <monthly-invoice />
      </div>
      <div class="col-span-12 space-y-6 xl:col-span-12">
        <four-in-one />
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
import SalesTarget from '@/components/ecommerce/MonthlySales.vue'
import FourInOne from '@/components/ecommerce/FourInOne.vue'
export default {
  components: {
    AdminLayout,
    EcommerceMetrics,
    MonthlyTarget,
    MonthlyQuatation,
    MonthlyInvoice,
    SalesTarget,
    FourInOne,
  },
  name: 'Ecommerce',
}
</script>
