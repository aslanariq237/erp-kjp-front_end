<template>
    <div class="quotation p-20">
        <div class="header flex justify-between items-center">
            <div class="logo">
                <img :src="getImagePaths('KJP_Logo.png')" width="180" height="90">
            </div>
            <div class="address w-[60%] text-left">
                <p class="font-semibold text-md text-green-600">PT.KHAHAYAN JAYA PERSADA</p>
                <p class="text-xs">
                    Garden Loft Grand Wisata CE2
                    Lambang Jaya, Tambun, Bekasi, Jawa Barat, 17510</p>
                <div class="flex text-xs">
                    <p class="w-20">Email </p>
                    <p>: admin@pt-kjp.com</p>
                </div>
                <div class="flex text-xs">
                    <p class="w-20">Contact</p>
                    <p>: +62 851 8756 8830</p>
                </div>
            </div>
        </div>
        <div class="border-b-2 border-gray-400 mt-2"></div>
        <div class="body">
            <div class="mt-3">
                <div class="title text-center">
                    <p class="text-xl font-semibold mt-2">DELIVERY ORDER</p>
                </div>
                <div class="flex justify-between items-center text-xs mt-5">
                    <div class="left w-[50%]">
                        <p class="font-semibold">Kepata Yth.</p>
                        <p>{{ item.customer.customer_name }}</p>
                        <p>{{ item.customer.customer_address }}</p>
                    </div>
                    <div class="right">                        
                        <div class="flex">
                            <p class="w-40">Purchase Order No </p>
                            <p>: {{ item.salesorder.po_number }}</p>
                        </div>
                        <div class="flex">
                            <p class="w-40">Delivery Order No </p>
                            <p>: {{ item.code_do}}</p>
                        </div>                        
                        <div class="flex">
                            <p class="w-40">Delivery Date </p>
                            <p>: {{ item.issue_at }}</p>
                        </div>
                    </div>
                </div>
                <div class="my-13">                                        
                    <table class="min-w-full divide-y mt-4 divide-gray-100 shadow-sm border-gray-200 border">
                        <thead class="border">
                            <tr class="text-center">                                
                                <th class="text-xs px-3 py-2 font-semibold">No</th>
                                <th class="text-xs px-3 py-2 font-semibold">Part Number</th>
                                <th class="text-xs px-3 py-2 font-semibold">Description</th>
                                <th class="text-xs px-3 py-2 font-semibold">Qty</th>
                                <th class="text-xs px-3 py-2 font-semibold">UOM</th>
                                <th class="text-xs px-3 py-2 font-semibold">
                                    Point
                                </th>
                                <th class="text-xs px-3 py-2 font-semibold">Address</th>                                
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800">
                            <tr class="text-center border-b-2" v-for="(pro, index) in item.detail_do" :key="index">
                                <td class="text-xs px-3 py-2">{{index+1 }}</td>
                                <td class="text-xs px-3 py-2">{{pro.product.product_sn }}</td>
                                <td class="text-xs px-3 py-2">{{pro.product.product_desc }}</td>
                                <td class="text-xs px-3 py-2">{{ pro.quantity }}</td>
                                <td class="text-xs px-3 py-2">{{ pro.product.product_uom }}</td>
                                <td class="text-xs px-3 py-2">{{ item.point.point }}</td>
                                <td class="text-xs px-3 py-2">{{ item.point.alamat }}</td>                                
                            </tr>                            
                        </tbody>
                    </table>
                </div>
                <div class="flex justify-between mt-20">
                    <div>
                        <p class="mb-2 text-xs">Prepared By</p>   
                        <img :src="getImagePaths('tt-imam.png')" width="170">             
                        <div class="text-xs mt-2">
                            <p>IMAM FAJRI</p>
                        </div>
                    </div>
                    <div>                         
                        <p class="mb-2 text-xs">Pengirim</p>                           
                        <div class="text-xs mt-28">                            
                        </div>
                    </div>
                    <div>                         
                        <p class="mb-2 text-xs">Penerima</p>                           
                        <div class="text-xs mt-28">                            
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