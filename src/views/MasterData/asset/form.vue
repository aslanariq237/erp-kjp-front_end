<template>
    <AdminLayout>
        <Form @submit="onSubmit">
            <div class="">
                <div class="flex justify-between items-center shadow-lg rounded-lg p-4">
                    <div class="card">
                        <p class="text-xl font-semibold">Form Assets</p>
                        <p class="text-gray-400">Master Data / Asset / Form</p>
                    </div>
                </div>
                <div class="flex justify-between gap-10 mt-4">
                    <div class="input shadow-lg rounded-md shadow=md p-4 mt-4 w-full">
                        <div class="field mt-3 text-lg font-semibold">
                            <div class="flex justify-between align-top gap-5">
                                <div class="name w-full">
                                    <label>Asset Name</label>
                                    <input type="text" id="name_asset" name="name_asset"
                                        class="w-full rounded-md px-3 py-3 my-2" placeholder="Masukkan Nama Asset"
                                        v-model="name">
                                    <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <p class="text-red-400 text-md italic" v-if="rules.name == true">
                                                Asset Name is required
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="asset-type w-full">
                                    <label>Asset Type</label>
                                    <select name="asset_type" id="asset_type" class="w-full rounded-md px-3 py-3 my-2"
                                        v-model="id_asset_type">
                                        <option value="">-- Select type -- </option>
                                        <option value="abc">Abc</option>
                                    </select>
                                    <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <p class="text-red-400 text-md italic" v-if="rules.id_asset_type == true">
                                                Asset Type is required
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-between gap-5 align-top mt-3">
                                <div class="name w-full">
                                    <label>Quantity</label>
                                    <input type="text" id="quantity_asset" name="quantity_asset"
                                        class="w-full rounded-md px-3 py-3 my-2" placeholder="Masukkan quantity Asset"
                                        v-model="qty">
                                    <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <p class="text-red-400 text-md italic" v-if="rules.qty == true">
                                                Quantity is required
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="status w-full">
                                    <label>Status</label>
                                    <input type="text" id="status_asset" name="status_asset"
                                        class="w-full rounded-md px-3 py-3 my-2" placeholder="Masukkan Status Asset"
                                        v-model="status">
                                    <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <p class="text-red-400 text-md italic" v-if="rules.status == true">
                                                Status is required
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="status w-full">
                                    <label>Book Value</label>
                                    <input type="text" id="status_asset" name="status_asset"
                                        class="w-full rounded-md px-3 py-3 my-2" placeholder="Masukkan Nilai buku"
                                        v-model="status">
                                    <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <p class="text-red-400 text-md italic" v-if="rules.status == true">
                                                Status is required
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="btn flex justify-center items-center text-xl shadow-md w-60 rounded-md">
                        <div class="contain">
                            <RouterLink to="/asset" class=" px-3 py-3 my-2bg-blue-500 rounded-md cursor-pointer">Cancel
                            </RouterLink>
                            <div class="btn">
                                <button type="submit" class="bg-green-400 px-3 py-2 rounded-md text-white">Submit</button>
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
            id_asset_type: "",
            name: "",
            qty: null,
            status: "",
            rules: {
                asset_type: false,
                name: false,
                qty: false,
                status: false,
            }
        }
    },
    methods: {
        validation() {
            var count = 0;

            if (this.name == "" || this.name == null) {
                this.rules.name = true;
                count++;
            } else {
                this.rules.name = false;
            }

            if (this.id_asset_type == '' || this.id_asset_type == null) {
                this.rules.asset_type = true;
                count++;
            } else {
                this.rules.asset_type = false;
            }

            if (this.qty == "" || this.qty == null) {
                this.rules.qty = true;
                count++;
            } else {
                this.rules.qty = false;
            }

            if (this.status == "" || this.status == null) {
                this.rules.status = true;
                count++;
            } else {
                this.rules.status = false;
            }
        },
        async onSubmit() {
            const validate = this.validation();
            const data = [
                this.id_asset_type,
                this.name,
                this.qty,
                this.status
            ]
            console.log(data);
        }
    }
}
</script>