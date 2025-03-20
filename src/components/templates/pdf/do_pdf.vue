<template>
    <div class="quotation p-32 text-">
        <div class="header flex justify-between items-center">
            <div class="logo">
                <img :src="getImagePaths('KJP_Logo.png')" width="350" height="280">
            </div>
            <div class="address w-[50%] text-left">
                <p class="font-semibold text-3xl text-green-600">PT.KHAHAYAN JAYA PERSADA</p>
                <p class="text-2xl">
                    Garden Loft Grand Wisata CE 2 No 35
                    Lambang Jaya, Tambun, Bekasi, Jawa Barat, 17510</p>
                    <div class="flex text-2xl">
                        <p class="w-20">Email </p>
                        <p>: khahayanjayapersada@pt-kjp.com</p>
                    </div>
                    <div class="flex text-2xl">
                        <p class="w-20">Contact</p>
                        <p>: 085157868830</p>
                    </div>                    
            </div>
        </div>
        <div class="border-b-2 border-gray-600"></div>
        <div class="body">
            <div class="mt-3">
                <div class="title text-center">
                    <p class="text-4xl font-semibold mt-5">DELIVERY ORDER</p>
                </div>
                <div class="flex justify-between items-center text-2xl mt-5 gap-20">
                    <div class="left w-[50%]">
                        <p class="font-semibold">Kepata Yth.</p>
                        <p>{{ item.customer.customer_name }}</p>
                        <p>{{ item.customer.customer_address }}</p>
                    </div>
                    <div class="right w-[40%]">                        
                        <div class="flex">
                            <p class="w-64">Purchase Order No </p>
                            <p>: {{ item.salesorder.po_number }}</p>
                        </div>
                        <div class="flex">
                            <p class="w-64">Delivery Order No </p>
                            <p>: {{ item.code_do}}</p>
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
                                <th class="text-2xl px-3 py-2 font-semibold">Part Number</th>
                                <th class="text-2xl px-3 py-2 font-semibold">Description</th>
                                <th class="text-2xl px-3 py-2 font-semibold">Qty</th>
                                <th class="text-2xl px-3 py-2 font-semibold">UOM</th>
                                <th class="text-2xl px-3 py-2 font-semibold">
                                    Point
                                </th>
                                <th class="text-2xl px-3 py-2 font-semibold">Address</th>                                
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800">
                            <tr class="text-center border-b-2" v-for="(pro, index) in item.detail_do" :key="index">
                                <td class="text-2xl px-3 py-2">{{pro.product.product_sn }}</td>
                                <td class="text-2xl px-3 py-2">{{pro.product.product_desc }}</td>
                                <td class="text-2xl px-3 py-2">{{ pro.quantity }}</td>
                                <td class="text-2xl px-3 py-2">{{ pro.product.product_uom }}</td>
                                <td class="text-2xl px-3 py-2">{{ item.point.point }}</td>
                                <td class="text-2xl px-3 py-2">{{ item.point.alamat }}</td>                                
                            </tr>                            
                        </tbody>
                    </table>
                </div>
                <div class="flex justify-between mt-20">
                    <div>
                        <p class="mb-2 text-2xl">Prepared By</p>   
                        <img :src="getImagePaths('tt-imam.png')" width="320">             
                        <div class="text-2xl mt-2">
                            <p>IMAM FAJRI</p>
                        </div>
                    </div>
                    <div>                         
                        <p class="mb-2 text-2xl">Pengirim</p>                           
                        <div class="text-2xl mt-28">                            
                        </div>
                    </div>
                    <div>                         
                        <p class="mb-2 text-2xl">Penerima</p>                           
                        <div class="text-2xl mt-28">                            
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