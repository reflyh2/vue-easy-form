<template>
   <div class="text-input-container" :class="[customClass, {'focused': isFocused}]">
     <div v-if="hasPrefix" class="prefix-wrapper"><slot name="prefix"></slot></div>
     <input
       type="text"
       :value="modelValue"
       @input="handleInput"
       @blur="handleBlur"
       @focus="handleFocus"
       class="text-input"
     />
     <div v-if="hasSuffix" class="suffix-wrapper"><slot name="suffix"></slot></div>
   </div>
 </template>
 
 <script>
 export default {
   name: 'TextInput',
   props: {
     modelValue: {
       type: String,
       default: ''
     },
     customClass: {
       type: [String, Object, Array],
       default: ''
     },
   },
   data() {
     return {
       isFocused: false
     }
   },
   computed: {
     hasPrefix() {
       return !!this.$slots.prefix;
     },
     hasSuffix() {
       return !!this.$slots.suffix;
     }
   },
   methods: {
     handleInput(event) {
       this.$emit('update:modelValue', event.target.value)
     },
     handleBlur() {
       this.isFocused = false
     },
     handleFocus() {
       this.isFocused = true
     }
   }
 }
 </script>
 
 <style scoped>
 .text-input-container {
   @apply flex p-0 items-center border border-gray-300 rounded-md transition-all duration-200;
 }
 .focused {
   @apply ring-1 ring-teal-500;
 }
 .text-input {
   @apply flex-1 border-none outline-none w-full p-2 bg-transparent;
 }
 .prefix-wrapper {
   @apply border-r;
 }
 .suffix-wrapper {
   @apply border-l;
 }
 .prefix-wrapper, .suffix-wrapper {
   @apply flex items-center justify-center p-2 h-full text-zinc-500;
 }
 .prefix-wrapper :deep(svg), .suffix-wrapper :deep(svg) {
   @apply w-7 h-6 px-1;
 }
 </style>