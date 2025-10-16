<template>
    <div class="quotation p-20">
        <div v-if="showHeader" class="header flex justify-between items-center">
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
        <div class="border-2 border-gray-400 mt-3" v-if="showHeader"></div>
        <div class="body">
            <div class="mt-3">
                <div class="title text-center" v-if="showHeader">
                    <p class="text-xl font-semibold mt-5" v-if="item.approved == 0">DRAFT PURCHASE ORDER</p>
                    <p class="text-xl font-semibold mt-5" v-else>PURCHASE ORDER</p>
                </div>
                <div v-if="showHeader" class="flex justify-between align-center text-xs my-5">
                    <div class="left w-[40%]">
                        <p>Kepada Yth.</p>
                        <p>{{ item.vendor.vendor_name }}</p>
                        <p>{{ item.vendor.vendor_address }}</p>
                    </div>
                    <div class="right">
                        <div class="flex">
                            <p class="w-40">Purchase Order No </p>
                            <p>: {{ item.code_po }}</p>
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
                    <table class="min-w-full divide-y divide-gray-100 shadow-xs border-gray-200 border">
                        <thead class="border" v-if="pageNumber === 1 || partialMode">
                            <tr class="text-center text-2x;">
                                <th class=" px-3 py-3 font-medium">No</th>
                                <th class=" px-3 py-3 font-medium">Part Number</th>
                                <th class=" px-3 py-3 font-medium">Description</th>
                                <th class=" px-3 py-3 font-medium">Qty</th>
                                <th class=" px-3 py-3 font-medium">UOM</th>
                                <th class=" px-3 py-3 font-medium">
                                    Price
                                </th>
                                <th class=" px-3 py-3 font-medium">Amount</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800">
                            <tr class="text-center border-b-2 text-xs"
                                v-for="(pro, index) in (item.detail_po ? rowsToShow : item.detail_po)" :key="index">
                                <td class="text-xs px-3 py-3">{{ (partialMode ? (pageNumber - 1) * 12 + index + 1 :
                                    index + 1) }}</td>
                                <td class="text-xs px-3 py-3">{{ pro.product.product_sn }}</td>
                                <td class="text-xs px-3 py-3">{{ pro.product.product_desc }}</td>
                                <td class="text-xs px-3 py-3">{{ pro.quantity }}</td>
                                <td class="text-xs px-3 py-3">{{ pro.product.product_uom }}</td>
                                <td class="text-xs px-3 py-3">{{ numberWithCommas(pro.price) }}</td>
                                <td class="text-xs px-3 py-3">{{ numberWithCommas(pro.price * pro.quantity) }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if="showFooter" class="flex items-start justify-between">
                        <div class="payment"></div>
                        <table class="min-w-[50%]">
                            <tbody>                                
                                <tr>
                                    <td class="px-3 py-3"></td>
                                    <td class="px-3 py-3"></td>
                                    <td class="px-3 py-3"></td>
                                    <td class="px-3 py-3"></td>
                                    <td class="px-3 py-3"></td>
                                    <td class="text-xs px-3 py-3 border-gray-200 border-2">Purchase
                                        SubTotal</td>
                                    <td class="text-xs px-3 py-3 border-gray-200 border-2">
                                        <div class="flex justify-between">
                                            <span>IDR. </span>
                                            <span>
                                                {{ numberWithCommas(item.sub_total) }}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-3 py-3"></td>
                                    <td class="px-3 py-3"></td>
                                    <td class="px-3 py-3"></td>
                                    <td class="px-3 py-3"></td>
                                    <td class="px-3 py-3"></td>
                                    <td class="text-xs px-3 py-3 border-gray-200 border-2">PPN 11%</td>
                                    <td class="text-xs px-3 py-3 border-gray-200 border-2">
                                        <div class="flex justify-between">
                                            <span>IDR. </span>
                                            <span>{{ numberWithCommas(item.ppn) }}</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-3 py-3 "></td>
                                    <td class="px-3 py-3"></td>
                                    <td class="px-3 py-3"></td>
                                    <td class="px-3 py-3"></td>
                                    <td class="px-3 py-3"></td>
                                    <td class="text-xs px-3 py-3 border-gray-200 border-2">Total</td>
                                    <td class="text-xs px-3 py-3 border-gray-200 border-2">
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
                <div v-if="showFooter" class="flex justify-between text-center">
                    <div>
                        <p class="mb-2 text-xs">Prepared By</p>
                        <img :src="getImagePaths('tt-imam-without-stempel.png')" width="120">
                        <div class="text-xs">
                            <p>IMAM FAJRI</p>
                        </div>
                    </div>
                    <div>
                        <div class="" v-if="item.approved == 0">

                        </div>
                        <div v-else>
                            <p class="text-xs">Approved By</p>
                            <img :src="getImagePaths('tt-vinvent.png')" width="170">
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

import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        item: {
            type: Object,
            required: true,
        },
        partialMode: {
            type: Boolean,
            default: false
        },
        pageNumber: {
            type: Number,
            default: 1
        },
        totalPages: {
            type: Number,
            default: 1,
        },
        rowsToShow: {
            type: Array,
            default: () => [],
        },
        showHeader: {
            type: Boolean,
            default: true,
        },
        showFooter: {
            type: Boolean,
            default: true,
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