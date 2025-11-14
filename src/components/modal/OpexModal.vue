<template>
  <Teleport to="body">
    <div v-if="show" class="cart-modal fixed inset-0 bg-transparant bg-opacity-50 flex items-center justify-center" @click="closeModal">
      <div class="cart-module bg-white p-4 rounded shadow max-h-[90vh] overflow-y-auto w-full max-w-4xl mx-4" @click.stop>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Information Details</h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>

        <div v-if="details.length === 0" class="text-gray-600">Keranjang kosong</div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm table-auto">
            <thead>
              <tr class="text-left text-gray-600">
                <th class="pb-2">Produk</th>                
                <th class="pb-2 text-center">Jumlah</th>
                <th class="pb-2 text-right">Harga</th>
                <th class="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in details" :key="item.id" class="border-t">
                <td class="py-3 align-top">
                  <div class="font-semibold">{{ item.product_desc }}</div>
                  <div class="text-xs text-gray-500">ID: {{ item.product_id }}</div>
                </td>                
                <td class="py-3 text-center align-top">
                  {{ item.quantity }}
                </td>
                <td class="py-3 text-right align-top">Rp {{ formatCurrency(item.price) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="border-t">
                <td colspan="1"></td>
                <td class="py-3 text-right font-semibold">Total</td>
                <td class="py-3 text-right font-bold">Rp {{ formatCurrency(total) }}</td>                
              </tr>
            </tfoot>
          </table>

          <div class="mt-4 flex justify-end gap-2">            
            <button @click="closeModal" class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button 
              @click="onApprove" 
              class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'OpexModal',
  props: {
    show: {
      type: Boolean,
      default: false,      
    },
    details: {
      type: Array,
      default: ()=>[]
    },
  },    
  computed: {
    isOpen: {
      get() {        
        return this.show      
      },
      set(v){
        this.$emit('update:show', v)
      },           
    },
    total(){
        return this.details.reduce(
          (sum, pro) => {
            return sum + 
              Number(pro.quantity) * 
              Number(pro.price)
          }, 0
        );
      }
  },
  methods: {
    onApprove(){
      this.$emit('approve');
    },
    closeModal(){
      this.$emit('update:show', false);      
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
      }).format(value)
    },
  }
});
</script>

<style scoped>
.cart-module { 
  max-width: 900px;
}
table th, table td { 
  vertical-align: middle;
}
.cart-modal {
  backdrop-filter: blur(2px);
}
</style>