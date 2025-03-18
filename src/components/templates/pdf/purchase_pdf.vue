<template>
    <div class="quotation p-32">
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
                    <p >: khahayanjayapersada@pt-kjp.com</p>
                </div>
                <div class="flex text-2xl">
                    <p class="w-20">Contact</p>
                    <p>: 081809000805</p>
                </div>
            </div>
        </div>
        <div class="border-2 border-double border-gray-600"></div>
        <div class="body">
            <div class="mt-3">
                <div class="title text-center">
                    <p class="text-4xl font-semibold mt-5" v-if="item.approved == 0">DRAFT PURCHASE ORDER</p>
                    <p class="text-4xl font-semibold mt-5" v-else>PURCHASE ORDER</p>
                </div>
                <div class="flex justify-between text-2xl mt-5">
                    <div class="left ml-10">
                        <p>Kepata Yth.</p>
                        <p>{{ item.vendor.vendor_name }}</p>
                        <p>{{ item.vendor.vendor_address }}</p>
                    </div>
                    <div class="right">
                        <div class="flex">
                            <p class="w-64">Purchase Order No </p>
                            <p>: {{ item.code_po }}</p>
                        </div>
                        <div class="flex">
                            <p class="w-64">Issue Date </p>
                            <p>: {{ item.issue_at }}</p>
                        </div>
                        <div class="flex">
                            <p class="w-64">Term Of Payment </p>
                            <p>: {{ item.termin }}</p>
                        </div>
                        <div class="flex">
                            <p class="w-64">Valid Date </p>
                            <p>: {{ item.due_at }}</p>
                        </div>
                    </div>
                </div>
                <div class="my-16">
                    <table class="min-w-full divide-y divide-gray-100 shadow-sm border-gray-200 border">
                        <thead class="border">
                            <tr class="text-center text-2x;">
                                <th class=" px-3 py-2 font-semibold">Part Number</th>
                                <th class=" px-3 py-2 font-semibold">Description</th>
                                <th class=" px-3 py-2 font-semibold">Qty</th>
                                <th class=" px-3 py-2 font-semibold">UOM</th>
                                <th class=" px-3 py-2 font-semibold">
                                    Price
                                </th>
                                <th class=" px-3 py-2 font-semibold">Amount</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800">
                            <tr class="text-center border-b-2 text-2xl" v-for="(pro, index) in item.detail_po" :key="index">
                                <td class="text-2xl px-3 py-2">{{ pro.product.product_sn }}</td>
                                <td class="text-2xl px-3 py-2">{{ pro.product.product_desc }}</td>
                                <td class="text-2xl px-3 py-2">{{ pro.quantity }}</td>
                                <td class="text-2xl px-3 py-2">{{ pro.product.product_uom }}</td>
                                <td class="text-2xl px-3 py-2">{{ numberWithCommas(pro.price) }}</td>
                                <td class="text-2xl px-3 py-2">{{ numberWithCommas(pro.price * pro.quantity) }}</td>
                            </tr>
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
                                <td class="text-2xl px-3 py-2 whitespace-nowrap border-gray-200 border-2">Purchase
                                    SubTotal</td>
                                <td class="text-2xl px-3 py-2 whitespace-nowrap border-gray-200 border-2">
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
                                <td class="px-3 py-2"></td>
                                <td class="text-2xl px-3 py-2 border-gray-200 border-2">PPN 11%</td>
                                <td class="text-2xl px-3 py-2 border-gray-200 border-2">
                                    <div class="flex justify-between">
                                        <span>IDR. </span>
                                        <span>{{ numberWithCommas(item.ppn) }},00</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-3 py-2 "></td>
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>
                                <td class="text-2xl px-3 py-2 border-gray-200 border-2">Total</td>
                                <td class="text-2xl px-3 py-2 border-gray-200 border-2">
                                    <div class="flex justify-between">
                                        <p>IDR. </p>
                                        {{ numberWithCommas(item.grand_total) }},00
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- <div class="footer mt-5 text-lg">
                    <p>Desc</p>
                    <p>{{ item.desc }}</p>
                </div> -->
                <div class="flex justify-between text-center">
                    <div>
                        <p class="mb-2 text-2xl">Prepared By</p>
                        <img :src="getImagePaths('tt-imam-without-stempel.png')" width="190">
                        <div class="text-2xl">
                            <p>IMAM FAJRI</p>
                        </div>
                    </div>
                    <div>
                        <div class="" v-if="item.approved == 0">

                        </div>
                        <div v-else>
                            <p class="text-2xl">Approved By</p>
                            <img :src="getImagePaths('tt-vinvent.png')" width="450">
                            <div class="text-2xl">
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