<template>
    <div class="quotation p-32 m-3">
        <div class="header flex justify-between items-center">
            <div class="logo">
                <img :src="getImagePaths('KJP_Logo.png')" width="350" height="280">
            </div>
            <div class="address w-[50%] text-left">
                <p class="font-semibold text-2xl text-green-600">PT.KHAHAYAN JAYA PERSADA</p>
                <p class="text-xl">
                    Garden Loft Grand Wisata CE 2 No 35
                    Lambang Jaya, Tambun, Bekasi, Jawa Barat, 17510</p>
                <div class="flex text-xl">
                    <p class="w-20">Email </p>
                    <p>: khahayanjayapersada@pt-kjp.com</p>
                </div>
                <div class="flex text-xl">
                    <p class="w-20">Contact</p>
                    <p>: 081809000805</p>
                </div>
            </div>
        </div>
        <div class="border-b-2 border-gray-600 mt-3"></div>
        <div class="body">
            <div class="mt-3">
                <div class="title text-center">
                    <p class="text-3xl font-semibold mt-5">QUOTATION</p>
                </div>
                <div class="flex justify-between align-center text-xl my-5">
                    <div class="left w-[40%]">
                        <p>Kepata Yth.</p>
                        <p>{{ item.customer.customer_name }}</p>
                        <p>{{ item.customer.customer_address }}</p>
                    </div>
                    <div class="right">
                        <div class="flex">
                            <p class="w-60">Quotation No </p>
                            <p>: {{ item.code_quatation }}</p>
                        </div>
                        <div class="flex">
                            <p class="w-60">Issue Date </p>
                            <p>: {{ item.issue_at }}</p>
                        </div>
                        <div class="flex">
                            <p class="w-60">Term Of Payment </p>
                            <p>: {{ item.termin }}</p>
                        </div>
                        <div class="flex">
                            <p class="w-60">Valid Date </p>
                            <p>: {{ item.due_at }}</p>
                        </div>
                    </div>
                </div>
                <div class="my-16">
                    <table class="min-w-full divide-y mt-4 divide-gray-100 shadow-sm border-gray-200 border">
                        <thead class="border">
                            <tr class="text-center">
                                <th class="text-xl px-3 py-2 font-semibold">No</th>
                                <th class="text-xl px-3 py-2 font-semibold">Part Number</th>
                                <th class="text-xl px-3 py-2 font-semibold">Description</th>
                                <th class="text-xl px-3 py-2 font-semibold">Qty</th>
                                <th class="text-xl px-3 py-2 font-semibold">UOM</th>
                                <th class="text-xl px-3 py-2 font-semibold">
                                    Price
                                </th>
                                <th class="text-xl px-3 py-2 font-semibold">Amount</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800">
                            <tr class="text-center border-b-2" v-for="(pro, index) in item.detail_quo" :key="index">
                                <td class="text-xl px-3 py-2">{{ index+1 }}</td>
                                <td class="text-xl px-3 py-2">{{ pro.product.product_sn }}</td>
                                <td class="text-xl px-3 py-2">{{ pro.product.product_desc }}</td>
                                <td class="text-xl px-3 py-2">{{ pro.quantity }}</td>
                                <td class="text-xl px-3 py-2">{{ pro.product.product_uom }}</td>
                                <td class="text-xl px-3 py-2">{{ numberWithCommas(pro.price) }}</td>
                                <td class="text-xl px-3 py-2">{{ numberWithCommas(pro.amount) }}</td>
                            </tr>                           
                        </tbody>
                    </table>
                    <div class="flex items-center justify-between">
                        <div class="payment">
                            <p class="font-bold text-xl">
                                Note:
                            </p>
                        </div>
                        <table class="min-w-[50%]">
                            <tbody>
                                <tr>
                                <td class="px-3 py-2 whitespace-nowrap"></td>
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
                                    <td class="px-3 py-2 whitespace-nowrap"></td>
                                    <td class="text-xl px-3 py-2 whitespace-nowrap border-gray-200 border-2">Quatation
                                        SubTotal</td>
                                    <td class="text-xl px-3 py-2 whitespace-nowrap border-gray-200 border-2">
                                        <div class="flex justify-between">
                                            <span>IDR. </span>
                                            <span>
                                                {{ numberWithCommas(item.sub_total) }},00
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-3 py-2 whitespace-nowrap"></td>
                                    <td class="px-3 py-2 whitespace-nowrap"></td>
                                    <td class="px-3 py-2 whitespace-nowrap"></td>
                                    <td class="px-3 py-2 whitespace-nowrap"></td>
                                    <td class="text-xl px-3 py-2 whitespace-nowrap border-gray-200 border-2">Quatation
                                        PPN</td>
                                    <td class="text-xl px-3 py-2 whitespace-nowrap border-gray-200 border-2">
                                        <div class="flex justify-between">
                                            <span>IDR. </span>
                                            <span>
                                                {{ numberWithCommas(item.ppn) }},00
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-3 py-2 whitespace-nowrap"></td>
                                    <td class="px-3 py-2 whitespace-nowrap"></td>
                                    <td class="px-3 py-2 whitespace-nowrap"></td>
                                    <td class="px-3 py-2 whitespace-nowrap"></td>
                                    <td class="text-xl px-3 py-2 whitespace-nowrap border-gray-200 border-2">Quatation
                                        Grand Total</td>
                                    <td class="text-xl px-3 py-2 whitespace-nowrap border-gray-200 border-2">
                                        <div class="flex justify-between">
                                            <span>IDR. </span>
                                            <span>
                                                {{ numberWithCommas(item.grand_total) }},00
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="flex justify-between text-center">
                    <div>
                        <p class="mb-2 text-xl">Prepared By</p>
                        <img :src="getImagePaths('tt-imam.png')" width="350">
                        <div class="text-xl">
                            <p>IMAM FAJRI</p>
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