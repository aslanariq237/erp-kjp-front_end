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
                                    <label>Product Desc</label>
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
                                    <label>Part Number</label>
                                    <input type="text" id="product-weight" name="product-weight"
                                        class="w-full rounded-md px-3 py-3 my-2" placeholder="Insert Product Weight"
                                        v-model="product_sn">
                                    <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <p class="text-red-400 text-md italic" v-if="rules.product_price == true">
                                                Product Price is required
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="stock w-full">
                                    <label>Brand</label>
                                    <input type="text" id="stock" name="stock" class="w-full rounded-md px-3 py-3 my-2"
                                        placeholder="Insert Stock" v-model="product_brand">
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
                                <div class="product Weight w-full">
                                    <label>product UoM</label>
                                    <input type="text" id="product-weight" name="product-weight"
                                        class="w-full rounded-md px-3 py-3 my-2" placeholder="Insert Product UoM"
                                        v-model="product_uom">
                                    <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <p class="text-red-400 text-md italic" v-if="rules.product_price == true">
                                                Product Price is required
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="Cat Weight w-full">
                                    <label>product Category</label>
                                    <input type="text" id="product-weight" name="product-weight"
                                        class="w-full rounded-md px-3 py-3 my-2" placeholder="Insert Product Category"
                                        v-model="product_uom">
                                    <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <p class="text-red-400 text-md italic" v-if="rules.product_price == true">
                                                Product Price is required
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>                            
                            <div class="flex justify-between gap-5 align-top mt-3">                                
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
import { ProductCode } from '@/core/utils/url_api';
import axios from 'axios';
import router from '@/router';  
import Swal from 'sweetalert2';
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
            product_image: "",
            product_name: "",
            product_sn : "",
            product_brand : "",
            product_uom : "",            
            stock: 0,            
            rules: {
                product_image: false,
                product_name: false,
                product_price: false,
                stock: false,
                status: false
            }
        }
    },
    mounted() { },
    methods: {
        async validation() {
            var count = 0;

            if (this.product_name == "" || this.product_name == null) {
                this.rules.product_name = true;
                count++;
            } else {
                this.rules.product_name = false;
            }
            


            return count;
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
            const result = await this.validation();

            if (result == 0) {

                await axios.post(ProductCode, {
                    product_image : "rajut.jpg",
                    product_desc : this.product_name,
                    product_sn : this.product_sn,
                    product_uom : this.product_uom,
                    product_brand : this.product_brand,                    
                    product_stock : this.stock || 0,                    
                }).then((response) => {
                    Swal.fire({
                        icon: "success",
                        title: 'Success',
                        text: "Data has been Saved"
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            var mssg = "";
                            if (this.id != null) {
                                mssg = "Success Update Employee";
                            } else {
                                mssg = "Success Create Employee";
                            }
                            await router.push("/products");
                            this.alertStore.success(mssg);
                        }
                    })
                },
                    (error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text:
                                (error.response &&
                                    error.response &&
                                    error.response.message) ||
                                error.message ||
                                error.toString(),
                        });
                    },
                )
            }
        }
    }
}
</script>