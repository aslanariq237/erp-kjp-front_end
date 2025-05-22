<template>
    <div class="quotation p-32 text-">
        <div class="header flex justify-between items-center">
            <div class="logo">
                <img :src="getImagePaths('KJP_Logo.png')" width="350" height="280">
            </div>
            <div class="address w-[50%] text-left">
                <p class="font-semibold text-3xl text-green-600">PT.KHAHAYAN JAYA PERSADA</p>
                <p class="text-xl">
                    Garden Loft Grand Wisata CE 2 No 35
                    Lambang Jaya, Tambun, Bekasi, Jawa Barat, 17510</p>
                    <div class="flex text-xl">
                        <p class="w-20">Email </p>
                        <p>: khahayanjayapersada@pt-kjp.com</p>
                    </div>
                    <div class="flex text-xl">
                        <p class="w-20">Contact</p>
                        <p>: 085157868830</p>
                    </div>                    
            </div>
        </div>
        <div class="border-b-2 border-gray-600"></div>
        <div class="body">
            <div class="mt-3">
                <div class="title text-center">
                    <p class="text-4xl font-semibold mt-5">Tanda Terima</p>
                </div>
                <div class="flex justify-between items-center text-xl mt-5 gap-20">
                    <div class="left w-[50%]">
                        <p class="font-semibold">Kepata Yth.</p>
                        <p>{{ item.customer.customer_name }}</p>
                        <p>{{ item.customer.customer_address }}</p>
                    </div>
                    <div class="right">                                                
                        <div class="flex">
                            <p class="w-64">Tanda Terima No </p>
                            <p>: {{ item.code_tandater}}</p>
                        </div>                        
                        <div class="flex">
                            <p class="w-64">Delivery Date </p>
                            <p>: {{ item.issue_at }}</p>
                        </div>
                    </div>
                </div>
                <div class="my-16">                                        
                    <table class="min-w-full divide-y mt-4 divide-gray-100 shadow-sm border-gray-200 border">
                        <thead class="border">
                            <tr class="text-center">                                
                                <th class="text-xl px-3 py-2 font-semibold">No</th>
                                <th class="text-xl px-3 py-2 font-semibold">No Invoice</th>
                                <th class="text-xl px-3 py-2 font-semibold">No SO</th>
                                <th class="text-xl px-3 py-2 font-semibold">Price</th>                                
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800">
                            <tr class="text-center border-b-2" v-for="(pro, index) in item.detailtandater" :key="index">
                                <td class="text-xl px-3 py-2">{{index+1 }}</td>
                                <td class="text-xl px-3 py-2">{{pro.so.code_so }}</td>
                                <td class="text-xl px-3 py-2">{{pro.invoice.code_invoice }}</td>
                                <td class="text-xl px-3 py-2">{{formatCurrency(pro.invoice.grand_total) }}</td>
                            </tr>   
                            <tr class="text-center border-b-2">
                                <td class="px-3 py-2 whitespace-nowrap border-0"></td>
                                <td class="px-3 py-2 whitespace-nowrap border-0"></td>
                                <td class="px-3 py-2 whitespace-nowrap border-0"></td>
                                <td class="text-xl px-3 py-2">{{formatCurrency(totalGrandTotal) }}</td>
                            </tr>                            
                        </tbody>
                    </table>
                </div>
                <div class="flex justify-between mt-20">
                    <div>                        
                        <div class="text-xl mt-28">                            
                            <p>Received in Good Condition By</p>
                            <div class="flex justify-between">
                                <p>Date: </p>
                                <p>Time : </p>
                            </div>
                        </div>
                    </div>
                    <div>                                                 
                        <div class="text-xl mt-28">                            
                        </div>
                    </div>
                    <div>                         
                        <p class="mb-2 text-xl">Prepared By</p>   
                        <img :src="getImagePaths('tt-imam.png')" width="320">             
                        <div class="text-xl mt-2">
                            <p>IMAM FAJRI</p>
                        </div>
                    </div>                    
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    computed: {
        totalGrandTotal() {
            if (!this.item.detailtandater) return 0;
            return this.item.detailtandater.reduce((sum, pro) => {
                return sum + (pro.invoice?.grand_total || 0);
            }, 0);
        }
    },
    methods: {
        getImagePaths(filename) {
            return `/images/logos/${filename}`;
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'IDR',
            }).format(value)
        },
        numberWithCommas(x) {
          var x = x.toString().replace(".", ",");
        
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
    }
})
</script>