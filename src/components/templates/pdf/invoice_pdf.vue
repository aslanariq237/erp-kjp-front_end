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
                <div class="title text-center mt-5">
                    <p class="text-xl font-semibold">INVOICE</p>
                </div>
                <div class="flex justify-between text-xs mt-5">
                    <div class="left w-[50%]">
                        <p class="font-semibold">Kepata Yth.</p>
                        <p class="text-xs">{{ item.customer.customer_name }}</p>
                        <p class="text-xs">{{ item.customer.customer_address }}</p>
                    </div>
                    <div class="right">
                        <div class="flex">
                            <p class="w-40">Purchase Order No </p>
                            <!-- <p>: {{ item.salesorder.po_number }}</p> -->
                        </div>
                        <div class="flex">
                            <p class="w-40">Invoice No </p>
                            <p>: {{ item.code_invoice }}</p>
                        </div>
                        <div class="flex">
                            <p class="w-40">Invoice Date </p>
                            <p>: {{ item.issue_at }}</p>
                        </div>
                        <div class="flex">
                            <p class="w-40">Term of Payment </p>
                            <!-- <p>: {{ item.salesorder.termin }}</p> -->
                        </div>
                        <div class="flex">
                            <p class="w-40">Due Date </p>
                            <p>: {{ item.due_at }}</p>
                        </div>
                    </div>
                </div>
                <div class="my-12">
                    <table class="min-w-full divide-y divide-gray-100 shadow-sm border-gray-200 border">
                        <thead class="bg-gray-300">
                            <tr class="text-center text-xs">
                                <th class="px-3 py-2 text-xs font-semibold border-b">No</th>
                                <th class="px-3 py-2 text-xs font-semibold border-b">Part Number</th>
                                <th class="px-3 py-2 text-xs font-semibold border-b">Description</th>
                                <th class="px-3 py-2 text-xs font-semibold border-b">Qty</th>
                                <th class="px-3 py-2 text-xs font-semibold border-b">UOM</th>
                                <th class="px-3 py-2 text-xs font-semibold border-b">
                                    Price
                                </th>
                                <th class="px-3 py-2 text-xs font-semibold border-b">Amount</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800">
                            <tr class="text-center border-b-2 text-xs" v-for="(pro, index) in item.detail_inv" :key="index">
                                <td class="text-xs px-3 py-2">{{ index+1 }}</td>
                                <td class="text-xs px-3 py-2">{{ pro.product.product_sn }}</td>
                                <td class="text-xs px-3 py-2">{{ pro.product.product_desc }}</td>
                                <td class="text-xs px-3 py-2">{{ pro.quantity }}</td>
                                <td class="text-xs px-3 py-2">{{ pro.product.product_uom }}</td>
                                <td class="text-xs px-3 py-2">{{ numberWithCommas(pro.price) }}</td>
                                <td class="text-xs px-3 py-2">{{ numberWithCommas(pro.amount) }}</td>                                
                            </tr>
                        </tbody>
                    </table>
                    <div class="flex items-center justify-between">
                        <div class="payment">
                            <p class="font-bold text-xs">
                                Payment Details:
                            </p>
                            <div class="flex text-xs">
                                <p class="w-28">No Rekening </p>
                                <p>: Bank BNI (7779886660)</p>
                            </div>
                            <div class="flex text-xs">
                                <p class="w-28">Atas Nama </p>
                                <p>: PT. Khahayan Jaya Persada </p>
                            </div>
                            <div class="flex text-xs">
                                <p class="w-28">Cabang </p>
                                <p>: Jatisrono</p>
                            </div>
                        </div>
                        <table class="min-w-[50%]">
                            <tbody>
                                <tr>
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>
                            </tr>
                            <tr>
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>
                                <td class="text-xs px-3 py-2 border-gray-200 border-2">Invoice
                                    SubTotal</td>
                                <td class="text-xs px-3 py-2 border-gray-200 border-2">
                                    <div class="flex justify-between">
                                        <span>IDR. </span>
                                        <span>
                                            {{ numberWithCommas(item.sub_total) }}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="item.customer.customer_name == 'PT. Khayahan Jaya Persada'">
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>
                                <td class="text-xs px-3 py-2 border-gray-200 border-2">Invoice
                                    DPP</td>
                                <td class="text-xs px-3 py-2 border-gray-200 border-2">
                                    <div class="flex justify-between">
                                        <span>IDR. </span>
                                        <span>
                                            {{ numberWithCommas(Math.round(item.sub_total * 11/12)) }},00
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>
                                <td class="text-xs px-3 py-2 border-gray-200 border-2">PPN 11%</td>
                                <td class="text-xs px-3 py-2 border-gray-200 border-2">
                                    <div class="flex justify-between">
                                        <span>IDR. </span>
                                        <span>
                                            {{ numberWithCommas(item.ppn) }}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>
                                <td class="text-xs px-3 py-2 border-gray-200 border-2">Total</td>
                                <td class="text-xs px-3 py-2 border-gray-200 border-2">
                                    <div class="flex justify-between">
                                        <span>IDR. </span>
                                        <span>{{ numberWithCommas(item.grand_total) }}</span>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="flex justify-between mt-12">
                    <div>
                        <div class="" v-if="item.approved == 1">

                        </div>
                        <div v-else>
                            <p class="text-xs">Warm Regards</p>
                            <div v-if="item.customer.customer_name != 'PT. Petronesia Benimel'">
                                <div class="text-xs mt-20">                                    
                                    <p>VINCENTIUS ADITYA HARNAWAN</p>
                                </div>
                            </div>
                            <div v-else>
                                <div class="text-xs mt-44">
                                    <p>HERY SUSANTO</p>                                    
                                </div>
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