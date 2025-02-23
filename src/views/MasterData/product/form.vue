<template>
    <AdminLayout>
        <Form @submit="onSubmit">
            <div class="">
                <div class="flex justify-between items-center shadow-lg rounded-lg p-4">
                    <div class="card">
                        <p class="text-xl font-semibold">Form Product</p>
                        <p class="text-gray-400">Master Data / Product / Form</p>
                    </div>
                </div>
                <div class="flex justify-between mt-4 gap-10">
                    <div class="input shadow-lg rounded-lg p-4 mt-4 w-full">
                        <div class="field mt-3 text-lg font-semibold">
                            <div class="flex justify-between align-top gap-5">
                                <div class="product-image w-full">
                                    <label>Product Image</label>
                                    <input type="file" id="product_image" name="product_image"
                                        class="w-full rounded-md px-3 my-2" @change="handleFileUpload" accept="image/*">
                                    <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <p class="text-red-400 text-md italic" v-if="rules.product_image == true">
                                                Image is required
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="product-name w-full">
                                    <label>Product Name</label>
                                    <input type="text" id="product_image" name="product_image"
                                        class="w-full rounded-md px-3 py-3 my-2" placeholder="Insert Product Name"
                                        v-model="product_name">
                                    <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <p class="text-red-400 text-md italic" v-if="rules.product_name == true">
                                                product Name is required
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-between gap-5 align-top mt-3">
                                <div class="product Weight w-full">
                                    <label>product Weight</label>
                                    <input type="text" id="product-weight" name="product-weight"
                                        class="w-full rounded-md px-3 py-3 my-2" placeholder="Insert Product Weight"
                                        v-model="product_weight">
                                    <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <p class="text-red-400 text-md italic" v-if="rules.product_weight == true">
                                                Product Weight is required
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="stock w-full">
                                    <label>Stock</label>
                                    <input type="text" id="stock" name="stock" class="w-full rounded-md px-3 py-3 my-2"
                                        placeholder="Insert Stock" v-model="stock">
                                    <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <p class="text-red-400 text-md italic" v-if="rules.stock == true">
                                                Stock is required
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-between gap-5 align-top mt-3">
                                <div class="status w-full">
                                    <label>status</label>
                                    <input type="text" id="status" name="status"
                                        class="w-full rounded-md px-3 py-3 my-2" placeholder="Masukkan status"
                                        v-model="status">
                                    <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <p class="text-red-400 text-md italic" v-if="rules.status == true">
                                                Status is required
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="contact-person w-full">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="btun flex justify-center items-center gap-4 w-60">
                        <div class="contain">
                            <div class="btn">
                                <RouterLink to="/product" class="p-10 py-3 text-xl cursor-pointer">Cancel</RouterLink>
                            </div>
                            <div class="btn">
                                <button type="submit"
                                    class="p-10 py-3 text-xl mt-10 bg-green-400 rounded-md text-white">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Form>
    </AdminLayout>
</template>
<script>
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { Form, Field, ErrorMessage } from "vee-validate";
import { RouterLink } from 'vue-router';


export default {
    name: "assets-forms",
    components: {
        AdminLayout,
        Form,
    },
    data() {
        return {
            id_product: "",
            product_image: "",
            product_name: "",
            product_weight: null,
            stock: null,
            status: "",
            rules: {
                product_image: false,
                product_name: false,
                product_weight: false,
                stock: false,
                status: false
            }
        }
    },
    mounted() { },
    methods: {
        validation() {
            var count = 0;

            if (this.product_image == "" || this.product_image == null) {
                this.rules.product_image = true;
                count++;
            } else {
                this.rules.product_image = false;
            }

            if (this.product_name == "" || this.product_name == null) {
                this.rules.product_name = true;
                count++;
            } else {
                this.rules.product_name = false;
            }

            if (this.product_weight == "" || this.product_weight == null) {
                this.rules.product_weight = true;
                count++;
            } else {
                this.rules.product_weight = false;
            }

            if (this.stock == "" || this.stock == null) {
                this.rules.stock = true;
                count++;
            } else {
                this.rules.stock = false;
            }

            if (this.status == "" || this.status == null) {
                this.rules.status = true;
                count++;
            } else {
                this.rules.status = false;
            }
        },
        handleFileUpload(event) {
            const input = event.target;
            if (!input.files || input.files.target === 0) {
                console.log("no File Selected")
            }

            const file = input.files[0]
            const reader = new FileReader();
            reader.readAsDataURL(file)

            reader.onload = (e) => {
                this.product_image = e.target.result
            }

        },

        async onSubmit() {
            const data = [
                this.product_image,
                this.product_name,
                this.product_weight,
                this.stock,
                this.status
            ]
            const result = await this.validation();
            console.log(data);
        }
    }
}
</script>