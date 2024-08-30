<template>
   <div 
     class="select-input-container" 
     :class="[customClass, {'focused': isFocused}]"
   >
     <div v-if="hasPrefix" class="prefix-wrapper"><slot name="prefix"></slot></div>
     <div class="select-input" @click="toggleDropdown($event)">
       <template v-if="multiple && selectedOptions.length">
         <div class="selected-badges">
           <span v-for="option in selectedOptions" :key="option[idKey]" class="badge">
             {{ option[labelKey] }}
             <button @click.stop="removeOption(option)" class="remove-badge">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="-3.5 0 19 19" fill="currentColor" class="w-4 h-4">
                  <path d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z"/>
               </svg>
             </button>
           </span>
         </div>
       </template>
       <input
         v-else
         ref="inputElement"
         type="text"
         :value="displayValue"
         readonly
         :class="{'placeholder': isPlaceholder}"
         v-bind="$attrs"
       />
     </div>
     <div v-if="hasSuffix" class="suffix-wrapper"><slot name="suffix"></slot></div>
     <div v-show="isOpen" class="options-dropdown" @mousedown.prevent>
       <input
         v-if="searchable"
         ref="searchInput"
         type="text"
         v-model="searchQuery"
         @input="filterOptions"
         @click.stop
         placeholder="Search..."
         class="search-input"
       />
       <div class="option-list">
         <template v-for="(item, index) in filteredOptions" :key="index">
           <div
             v-if="item.type === 'option'"
             :class="['option', `indent-${item.level}`, { 'selected': isSelected(item) }]"
             @mousedown.prevent="selectOption(item)"
             v-html="item[labelKey]"
           ></div>
           <div
             v-else-if="item.type === 'optgroup'"
             :class="['optgroup', `indent-${item.level}`]"
           >
             <div class="optgroup-label" v-html="item[labelKey]"></div>
           </div>
         </template>
       </div>
     </div>
     <div class="caret-icon">
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
         <path fill-rule="evenodd" clip-rule="evenodd" d="M6.29289 8.79289C6.68342 8.40237 7.31658 8.40237 7.70711 8.79289L12 13.0858L16.2929 8.79289C16.6834 8.40237 17.3166 8.40237 17.7071 8.79289C18.0976 9.18342 18.0976 9.81658 17.7071 10.2071L12.7071 15.2071C12.3166 15.5976 11.6834 15.5976 11.2929 15.2071L6.29289 10.2071C5.90237 9.81658 5.90237 9.18342 6.29289 8.79289Z"/>
       </svg>
     </div>
   </div>
 </template>
 
 <script>
 export default {
   inheritAttrs: false,
   name: 'SelectInput',
   props: {
     modelValue: {
       type: [String, Number, Array],
       default: ''
     },
     options: {
       type: Object,
       required: true
     },
     multiple: {
       type: Boolean,
       default: false
     },
     searchable: {
       type: Boolean,
       default: false
     },
     idKey: {
       type: String,
       default: 'id'
     },
     labelKey: {
       type: String,
       default: 'name'
     },
     customClass: {
       type: [String, Object, Array],
       default: ''
     },
     placeholder: {
       type: String,
       default: ''
     },
   },
   data() {
     return {
       isFocused: false,
       isOpen: false,
       searchQuery: '',
       flattenedOptions: [],
       filteredOptions: []
     }
   },
   computed: {
     hasPrefix() {
       return !!this.$slots.prefix;
     },
     hasSuffix() {
       return !!this.$slots.suffix;
     },
     selectedOptions() {
       if (this.multiple) {
         return this.flattenedOptions.filter(option => 
           Array.isArray(this.modelValue) && this.modelValue.includes(option[this.idKey])
         );
       } else {
         return this.flattenedOptions.find(option => 
           option[this.idKey] === this.modelValue
         ) || null;
       }
     },
     displayValue() {
       if (this.multiple) {
         return this.selectedOptions.length > 0 ? this.selectedOptions.map(option => option[this.labelKey]).join(', ') : this.placeholder;
       } else {
         return this.selectedOptions ? this.selectedOptions[this.labelKey] : this.placeholder;
       }
     },
     isPlaceholder() {
       if (this.multiple) {
         return Array.isArray(this.modelValue) && this.modelValue.length === 0;
       } else {
         return this.modelValue === '' || this.modelValue === null || this.modelValue === undefined || (Array.isArray(this.modelValue) && this.modelValue.length === 0);
       }
     }
   },
   watch: {
     options: {
       immediate: true,
       handler() {
         this.flattenOptions();
         this.filterOptions();
       }
     },
     modelValue: {
       immediate: true,
       handler() {
         this.filterOptions();
       }
     }
   },
   methods: {
     toggleDropdown(event) {
       if (!this.$attrs.disabled) {
         event.preventDefault();
         this.isOpen = !this.isOpen;
         if (this.isOpen) {
           this.$nextTick(() => {
             if (this.searchable && this.$refs.searchInput) {
               this.$refs.searchInput.focus();
             } else {
               this.$refs.inputElement.focus();
             }
           });
         }
       }
     },
     flattenOptions(obj = this.options, level = 0) {
       this.flattenedOptions = [];
       const flatten = (obj, level) => {
         for (const key in obj) {
           if (typeof obj[key] === 'object' && !Object.prototype.hasOwnProperty.call(obj[key], this.idKey)) {
             this.flattenedOptions.push({
               type: 'optgroup',
               [this.labelKey]: key,
               level
             });
             flatten(obj[key], level + 1);
           } else {
             this.flattenedOptions.push({
               type: 'option',
               [this.idKey]: obj[key][this.idKey] || key,
               [this.labelKey]: obj[key][this.labelKey] || obj[key],
               level
             });
           }
         }
       };
       flatten(obj, level);
     },
     filterOptions() {
       if (this.searchQuery) {
         this.filteredOptions = this.flattenedOptions.filter(item => 
           item[this.labelKey].toLowerCase().includes(this.searchQuery.toLowerCase())
         );
       } else {
         this.filteredOptions = this.flattenedOptions;
       }
     },
     selectOption(option) {
       if (this.multiple) {
         const newValue = Array.isArray(this.modelValue) ? [...this.modelValue] : [];
         const index = newValue.indexOf(option[this.idKey]);
         if (index === -1) {
           newValue.push(option[this.idKey]);
         } else {
           newValue.splice(index, 1);
         }
         this.$emit('update:modelValue', newValue);
       } else {
         this.$emit('update:modelValue', option[this.idKey]);
         this.isOpen = false;
       }
     },
     isSelected(option) {
       if (this.multiple) {
         return Array.isArray(this.modelValue) && this.modelValue.includes(option[this.idKey]);
       } else {
         return this.modelValue === option[this.idKey];
       }
     },
     removeOption(option) {
       if (this.multiple) {
         const newValue = this.modelValue.filter(value => value !== option[this.idKey]);
         this.$emit('update:modelValue', newValue);
       }
     },
     handleFocus() {
       this.isFocused = true;
     },
     handleBlur() {
       setTimeout(() => {
         if (!this.$el.contains(document.activeElement)) {
           this.isFocused = false;
           this.isOpen = false;
         }
       }, 0);
     }
   }
 }
 </script>
 
 <style scoped>
 .select-input-container {
   @apply relative flex p-0 items-center border border-gray-300 rounded-md transition-all duration-200 outline-none cursor-pointer;
 }
 .focused, .select-input-container:focus-within {
   @apply ring-2 ring-main-500 border-transparent;
 }
 .select-input {
   @apply appearance-none w-full bg-transparent border-none px-3 py-2 pr-8 rounded-md cursor-pointer;
 }
 .select-input input {
   @apply w-full bg-transparent border-none outline-none text-left cursor-pointer;
 }
 .select-input input.placeholder {
   @apply text-gray-400;
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
 .options-dropdown {
   @apply absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto;
 }
 .option-list {
   @apply py-1;
 }
 .option {
   @apply px-4 py-2 cursor-pointer hover:bg-gray-100 text-left;
 }
 .optgroup {
   @apply px-4 py-2 font-semibold text-gray-600 text-left;
 }
 .selected {
   @apply bg-main-100 text-main-800;
 }
 .indent-0 { @apply pl-4; }
 .indent-1 { @apply pl-8; }
 .indent-2 { @apply pl-12; }
 .indent-3 { @apply pl-16; }
 .indent-4 { @apply pl-20; }
 .indent-5 { @apply pl-24; }
 .search-input {
   @apply w-full border-none outline-none bg-transparent p-2 border-b border-gray-200;
 }
 .selected-badges {
   @apply flex flex-wrap gap-1;
 }
 .badge {
   @apply bg-main-100 text-main-800 px-2 py-1 rounded-md text-sm flex items-center;
 }
 .remove-badge {
   @apply ml-1 text-main-600 hover:text-main-800 font-bold;
 }
 
 .caret-icon {
  @apply absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400;
}

.focused .caret-icon, .select-input-container:focus-within .caret-icon {
  @apply text-main-500;
}

 /* Hide the native dropdown arrow in Firefox */
 .select-input {
   -moz-appearance: none;
   text-indent: 0.01px;
   text-overflow: '';
 }
 
 /* Hide the native dropdown arrow in IE 10+ */
 .select-input::-ms-expand {
   display: none;
 }
 </style>