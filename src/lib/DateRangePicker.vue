<template>
   <div class="date-range-picker-container" :class="[customClass, {'focused': isFocused, 'invalid': !isDateRangeValid, [colorClasses.ring]: isFocused}]">
     <div v-if="hasPrefix" class="prefix-wrapper"><slot name="prefix"></slot></div>
     <input
       type="text"
       :value="formattedDateRange"
       @input="handleInput"
       @blur="handleBlur"
       @focus="handleFocus"
       @click="showCalendar = true"
       class="date-range-input"
       v-bind="$attrs"
     />
     <div v-if="hasSuffix" class="suffix-wrapper"><slot name="suffix"></slot></div>
     <div v-if="!isDateRangeValid" class="error-message">Invalid date range</div>
     <div v-if="showCalendar" class="calendar-popup">
       <DateRangePickerCalendar
         :startDate="startDate"
         :endDate="endDate"
         :minDate="minDateObj"
         :maxDate="maxDateObj"
         :quickRanges="quickRanges"
         :mainColor="mainColor"
         @select="selectDateRange"
       />
     </div>
   </div>
 </template>
 
 <script>
 import DateRangePickerCalendar from './DateRangePickerCalendar.vue';
 
 export default {
  inheritAttrs: false,
   name: 'DateRangePicker',
   components: {
     DateRangePickerCalendar
   },
   props: {
     modelValue: {
       type: Object,
       default: () => ({ startDate: '', endDate: '' })
     },
     locale: {
       type: String,
       default: 'en-US'
     },
     customClass: {
       type: [String, Object, Array],
       default: ''
     },
     minDate: {
       type: String,
       default: null
     },
     maxDate: {
       type: String,
       default: null
     },
     quickRanges: {
       type: Array,
       default: () => []
     },
     mainColor: {
       type: String,
       default: 'teal'
     }
   },
   data() {
     return {
       startDate: this.modelValue.startDate,
       endDate: this.modelValue.endDate,
       isFocused: false,
       showCalendar: false
     }
   },
   computed: {
     formattedDateRange() {
       if (!this.startDate || !this.endDate) return '';
       const formatter = new Intl.DateTimeFormat(this.locale);
       return `${formatter.format(new Date(this.startDate))} - ${formatter.format(new Date(this.endDate))}`;
     },
     hasPrefix() {
       return !!this.$slots.prefix;
     },
     hasSuffix() {
       return !!this.$slots.suffix;
     },
     minDateObj() {
       return this.minDate ? new Date(this.minDate) : null;
     },
     maxDateObj() {
       return this.maxDate ? new Date(this.maxDate) : null;
     },
     isDateRangeValid() {
       if (!this.startDate || !this.endDate) return true;
       const start = new Date(this.startDate);
       const end = new Date(this.endDate);
       return (
         (!this.minDateObj || start >= this.minDateObj) &&
         (!this.maxDateObj || end <= this.maxDateObj) &&
         start <= end
       );
     },
     colorClasses() {
       return {
         ring: `ring-${this.mainColor}-500`,
         text: `text-${this.mainColor}-600`,
         border: `border-${this.mainColor}-500`,
       }
     }
   },
   watch: {
     modelValue: {
       handler(newValue) {
         this.startDate = newValue.startDate;
         this.endDate = newValue.endDate;
       },
       deep: true
     }
   },
   methods: {
   //   handleInput(event) {
   //     // Implement input parsing logic if needed
   //   },
     handleBlur() {
       this.isFocused = false;
     },
     handleFocus() {
       this.isFocused = true;
     },
     selectDateRange({ startDate, endDate }) {
       this.startDate = startDate;
       this.endDate = endDate;
       this.$emit('update:modelValue', { startDate, endDate });
       this.showCalendar = false;
     },
     closeCalendar(event) {
       if (!this.$el.contains(event.target)) {
         this.showCalendar = false;
       }
     }
   },
   mounted() {
     document.addEventListener('mousedown', this.closeCalendar);
   },
   beforeUnmount() {
     document.removeEventListener('mousedown', this.closeCalendar);
   }
 }
 </script>
 
 <style scoped>
 .date-range-picker-container {
   @apply flex p-0 items-center border border-gray-300 rounded-md transition-all duration-200 relative;
 }
 .focused {
   @apply ring-1;
 }
 .date-range-input {
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
 .invalid {
   @apply border-red-500;
 }
 .error-message {
   @apply text-red-500 text-sm mt-1;
 }
 .calendar-popup {
   @apply absolute top-full left-0 mt-1 z-10;
 }
 </style>