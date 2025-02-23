<template>
  <div
    :class="[
      'mb-4 p-4 rounded-lg shadow-sm flex justify-between items-center',
      type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
    ]"
  >
    <span>{{ message }}</span>
    <button @click="$emit('close')" class="focus:outline-none">
      <i class="fas fa-times"></i>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'success',
    },
    message: {
      type: String,
      required: true,
    },
  },
}
</script>
