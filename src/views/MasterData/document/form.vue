<!-- eslint-disable vue/block-lang -->
<template>
    <AdminLayout>
        <Form @submit="onSubmit" class="container mx-auto px-6 py-4">
            <!-- Notification -->
            <Notification v-if="notification.show" :type="notification.type" :message="notification.message"
                @close="notification.show = false" />

            <!-- Header Card -->
            <div class="bg-white rounded-lg shadow-md mb-6">
                <div class="flex justify-between items-center p-6 border-b">
                    <div class="breadcrumb">
                        <h1 class="text-2xl font-bold text-gray-800">Create New Document</h1>
                        <p class="text-gray-500 text-sm mt-1">Master Data / Document / Form</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <RouterLink to="/document"
                            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2">
                            <i class="fas fa-times"></i>
                            Cancel
                        </RouterLink>
                        <button type="submit"
                            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                            <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
                            <i v-else class="fas fa-check"></i>
                            {{ isSubmitting ? 'Submitting...' : 'Submit' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Form Card -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="grid grid-cols-2 md:grid-cols-2 gap-3">
                    <FormGroup label="Document" :required="true" :error="rules.issue_at"
                        errorMessage="Issue Date is required">
                        <input type="file" id="issue_at" name="issue_at" :class="inputClass(rules.issue_at)"
                            @input="handleFileUpload" />
                    </FormGroup>

                    <FormGroup label="Document Desc" :required="true" :error="rules.issue_at"
                        errorMessage="Issue Date is required">
                        <input type="text" id="issue_at" name="issue_at" v-model="document_name"
                            :class="inputClass(rules.issue_at)" />
                    </FormGroup>
                </div>
            </div>
        </Form>
    </AdminLayout>
</template>

<script>
import { defineComponent } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import Swal from 'sweetalert2'
import Notification from '@/components/Notification.vue'
import FormGroup from '@/components/FormGroup.vue'
import axios from 'axios'
import { PDFDocument } from 'pdf-lib'
import { fileUpload, ProductCode } from '@/core/utils/url_api'
import router from '@/router'

export default defineComponent({
    name: 'PurchaseOrderForm',
    components: {
        AdminLayout,
        Form,
        Field,
        ErrorMessage,
        Notification,
        FormGroup,
    },
    data() {
        return {
            document_name: '',
            document_path: '',
            document_file: '',
            compressedFile: null,            
            //others
            isSubmitting: false,
            notification: {
                show: false,
                type: 'success',
                message: '',
            },
            rules: {
                file: false,
                document_name: false,
            },
            sales_order_details: [],
        }
    },
    methods: {
        async handleFileUpload(event) {
            const file = event.target.files[0];
            await this.compressdFile(file);
        },
        
        async compressdFile(file)
        {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer)

            pdfDoc.setTitle("");
            pdfDoc.setAuthor("");
            pdfDoc.setSubject("");
            pdfDoc.getForm().flatten();
            const compdfBytes = await pdfDoc.save();

            this.compressedFile = new File([compdfBytes], `compressed_${file.name}`, { type: "application/pdf" });

            console.log([
                file.size,
                this.compressedFile.size
            ]);
        },        

        showNotification(type, message) {
            this.notification = {
                show: true,
                type,
                message,
            }

            // Hide notification after 3 seconds
            setTimeout(() => {
                this.notification.show = false
            }, 3000)
        },

        async validation() {
            var count = 2;        

            return count
        },

        async onSubmit() {
            const result = await this.validation();            
            if (result != 0) {
                const formData = new FormData();
                formData.append('file', this.compressedFile);
                formData.append('document_name', this.document_name)
                await axios
                    .post(fileUpload, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                    .then(
                        (response) => {                            
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: 'Data has been Saved',
                            }).then((res) => {
                                if (res.isConfirmed) {
                                    router.push('/document')
                                }
                            })
                        },
                        (error) => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text:
                                    (error.response && error.response && error.response.message) ||
                                    error.message ||
                                    error.toString(),
                            })
                        },
                    )
                    .finally(() => {
                        this.isSubmitting = false;
                    });
            }
        },

        inputClass(error) {
            return [
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                error
                    ? 'border-red-300 focus:ring-red-500 bg-red-50'
                    : 'border-gray-300 focus:ring-blue-500',
            ]
        },
    },
});
</script>