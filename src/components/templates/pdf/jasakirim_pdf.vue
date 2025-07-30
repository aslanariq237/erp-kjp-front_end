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
        <div class="border-2 border-double border-gray-600"></div>
        <div class="body">
            <div class="mt-3">
                <div class="title text-center">
                    <p class="text-md font-semibold mt-5" v-if="item.approved == 0">DRAFT PURCHASE ORDER JASA KIRIM</p>
                    <p class="text-md font-semibold mt-5" v-else>PURCHASE ORDER JASA KIRIM</p>
                </div>
                <div class="flex justify-between text-xs mt-5">
                    <div class="left w-[50%]">
                        <p>Kepata Yth.</p>
                        <p>{{ item.vendor.vendor_name }}</p>
                        <p>{{ item.vendor.vendor_address }}</p>
                    </div>
                    <div class="right">
                        <div class="flex">
                            <p class="w-40">PO-Jasa Kirim </p>
                            <p>: {{ item.code_jasakirim }}</p>
                        </div>
                        <div class="flex">
                            <p class="w-40">Issue Date </p>
                            <p>: {{ item.issue_at }}</p>
                        </div>
                        <div class="flex">
                            <p class="w-40">Term Of Payment </p>
                            <p>: {{ item.termin }}</p>
                        </div>
                        <div class="flex">
                            <p class="w-40">Valid Date </p>
                            <p>: {{ item.due_at }}</p>
                        </div>
                    </div>
                </div>
                <div class="my-12">
                    <table class="min-w-full divide-y divide-gray-100 shadow-sm border-gray-200 border">
                        <thead class="border">
                            <tr class="text-center text-2x;">
                                <th class=" px-3 py-2 font-semibold">No</th>                                
                                <th class=" px-3 py-2 font-semibold">Description</th>
                                <th class=" px-3 py-2 font-semibold">Qty</th>                                
                                <th class=" px-3 py-2 font-semibold">
                                    Price
                                </th>
                                <th class=" px-3 py-2 font-semibold">Amount</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800">
                            <tr class="text-center border-b-2 text-xs" v-for="(pro, index) in item.detailjakir" :key="index">                                
                                <td class="text-xs px-3 py-2">{{ index+1}}</td>                                
                                <td class="text-xs px-3 py-2">{{ pro.product_name }}</td>
                                <td class="text-xs px-3 py-2">{{ pro.quantity }}</td>                                
                                <td class="text-xs px-3 py-2">{{ numberWithCommas(pro.price) }}</td>
                                <td class="text-xs px-3 py-2">{{ numberWithCommas(pro.quantity * pro.price) }}</td>
                            </tr>                            
                        </tbody>
                    </table>
                    <div class="flex items-start justify-between">
                        <div class="payment mt-3">
                        </div>
                        <table class="min-w-[50%]">
                            <tbody>
                                <tr>
                                <td class="px-3 py-2 whitespace-nowrap"></td>
                                <td class="px-3 py-2 whitespace-nowrap"></td>
                                <td class="px-3 py-2 whitespace-nowrap"></td>
                                <td class="px-3 py-2 whitespace-nowrap"></td>                                
                                <td class="px-3 py-2 whitespace-nowrap"></td>
                            </tr>
                            <tr>
                                <td class="px-3 py-2 whitespace-nowrap"></td>                                
                                <td class="px-3 py-2 whitespace-nowrap"></td>
                                <td class="px-3 py-2 whitespace-nowrap"></td>
                                <td class="text-xs px-3 py-2 whitespace-nowrap border-gray-200 border-2">Purchase
                                    SubTotal</td>
                                <td class="text-xs px-3 py-2 whitespace-nowrap border-gray-200 border-2">
                                    <div class="flex justify-between">
                                        <span>IDR. </span>
                                        <span>
                                            {{ numberWithCommas(item.sub_total) }},00
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>                                
                                <td class="px-3 py-2"></td>
                                <td class="text-xs px-3 py-2 border-gray-200 border-2">PPN 11%</td>
                                <td class="text-xs px-3 py-2 border-gray-200 border-2">
                                    <div class="flex justify-between">
                                        <span>IDR. </span>
                                        <span>{{ numberWithCommas(item.ppn) }}</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-3 py-2 "></td>
                                <td class="px-3 py-2"></td>                                
                                <td class="px-3 py-2"></td>
                                <td class="text-xs px-3 py-2 border-gray-200 border-2">Total</td>
                                <td class="text-xs px-3 py-2 border-gray-200 border-2">
                                    <div class="flex justify-between">
                                        <p>IDR. </p>
                                        {{ numberWithCommas(item.grand_total) }}
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <!-- <div class="footer mt-5 text-lg">
                    <p>Desc</p>
                    <p>{{ item.desc }}</p>
                </div> -->
                <div class="flex justify-between text-center">
                    <div>
                        <p class="mb-2 text-xs">Prepared By</p>
                        <img :src="getImagePaths('tt-imam-without-stempel.png')" width="90">
                        <div class="text-xs">
                            <p>IMAM FAJRI</p>
                        </div>
                    </div>
                    <div>
                        <div class="" v-if="item.approved == 0">

                        </div>
                        <div v-else>
                            <p class="text-xs">Approved By</p>
                            <img :src="getImagePaths('tt-vinvent.png')" width="210">
                            <div class="text-xs">
                                <p>VINCENTIUS ADITYA HARNAWAN</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { DetailQuatation } from '@/core/utils/url_api';
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