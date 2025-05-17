<template>
    <div class="quotation p-32">
        <div class="header flex justify-between items-center">
            <div class="logo">
                <img :src="getImagePaths('KJP_Logo.png')" width="350" height="280">
            </div>
            <div class="address w-[50%] text-left">
                <p class="font-semibold text-xl text-green-600">PT.KHAHAYAN JAYA PERSADA</p>
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
        <div class="border-b-2 border-gray-600"></div>
        <div class="body">
            <div class="mt-3">
                <div class="title text-center mt-5">
                    <p class="text-4xl font-semibold">INVOICE</p>
                </div>
                <div class="flex justify-between text-xl mt-5">
                    <div class="left w-[40%]">
                        <p class="font-semibold">Kepata Yth.</p>
                        <p>{{ item.customer.customer_name }}</p>
                        <p>{{ item.customer.customer_address }}</p>
                    </div>
                    <div class="right w-[60%]">
                        <div class="flex">
                            <p class="w-64">Purchase Order No </p>
                            <p>: {{ item.salesorder.po_number }}</p>
                        </div>
                        <div class="flex">
                            <p class="w-64">Invoice No </p>
                            <p>: {{ item.code_invoice }}</p>
                        </div>
                        <div class="flex">
                            <p class="w-64">Invoice Date </p>
                            <p>: {{ item.issue_at }}</p>
                        </div>
                        <div class="flex">
                            <p class="w-64">Term of Payment </p>
                            <p>: {{ item.salesorder.termin }}</p>
                        </div>
                        <div class="flex">
                            <p class="w-64">Due Date </p>
                            <p>: {{ item.due_at }}</p>
                        </div>
                    </div>
                </div>
                <div class="my-16">
                    <table class="min-w-full divide-y divide-gray-100 shadow-sm border-gray-200 border">
                        <thead class="bg-gray-300">
                            <tr class="text-center text-xl ">
                                <th class="px-3 py-2 text-xl font-semibold border-b">No</th>
                                <th class="px-3 py-2 text-xl font-semibold border-b">Part Number</th>
                                <th class="px-3 py-2 text-xl font-semibold border-b">Description</th>
                                <th class="px-3 py-2 text-xl font-semibold border-b">Qty</th>
                                <th class="px-3 py-2 text-xl font-semibold border-b">UOM</th>
                                <th class="px-3 py-2 text-xl font-semibold border-b">
                                    Price
                                </th>
                                <th class="px-3 py-2 text-xl font-semibold border-b">Amount</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800">
                            <tr class="text-center border-b-2 text-xl" v-for="(pro, index) in item.detail_inv" :key="index">
                                <td class="text-xl px-3 py-2">{{ index+1 }}</td>
                                <td class="text-xl px-3 py-2">{{ pro.product.product_sn }}</td>
                                <td class="text-xl px-3 py-2">{{ pro.product.product_desc }}</td>
                                <td class="text-xl px-3 py-2">{{ pro.quantity }}</td>
                                <td class="text-xl px-3 py-2">{{ pro.product.product_uom }}</td>
                                <td class="text-xl px-3 py-2">{{ numberWithCommas(pro.price) }}</td>
                                <td class="text-xl px-3 py-2">{{ numberWithCommas(pro.amount) }}</td>
                                <td class="text-xl px-3 py-2 border"></td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="flex items-center justify-between">
                        <div class="payment">
                            <p class="font-bold text-xl">
                                Payment Details:
                            </p>
                            <div class="flex text-xl">
                                <p class="w-64">No Rekening </p>
                                <p>: Bank BNI (7779886660)</p>
                            </div>
                            <div class="flex text-xl">
                                <p class="w-64">Atas Nama </p>
                                <p>: PT. Khahayan Jaya Persada </p>
                            </div>
                            <div class="flex text-xl">
                                <p class="w-64">Cabang </p>
                                <p>: Jatisrono</p>
                            </div>
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
                                <td class="text-xl px-3 py-2 whitespace-nowrap border-gray-200 border-2">Invoice
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
                                <td class="text-xl px-3 py-2 whitespace-nowrap border-gray-200 border-2">PPN 11%</td>
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
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>
                                <td class="px-3 py-2"></td>
                                <td class="text-xl px-3 py-2 border-gray-200 border-2">Total</td>
                                <td class="text-xl px-3 py-2 border-gray-200 border-2">
                                    <div class="flex justify-between">
                                        <span>IDR. </span>
                                        <span>{{ numberWithCommas(item.grand_total) }},00</span>
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
                            <p class="text-xl">Warm Regards</p>
                            <div v-if="item.customer.customer_name != 'Petronesia Benimel'">
                                <div class="text-xl mt-44">                                    
                                    <p>VINCENTIUS ADITYA HARNAWAN</p>
                                </div>
                            </div>
                            <div v-else>
                                <div class="text-xl mt-44">
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