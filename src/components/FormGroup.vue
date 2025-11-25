<template>
  <div 
    class="form-group"
  >
    <label 
      class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span 
        v-if="required" 
        class="text-red-500">*</span>
    </label>
    <slot></slot>
    <p 
      v-if="error" 
      class="mt-2 text-sm text-red-600">{{ errorMessage }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },
}
</script>
