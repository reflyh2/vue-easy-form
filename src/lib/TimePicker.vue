<template>
   <div class="time-picker-container" :class="[customClass, {'focused': isFocused, 'invalid': !isTimeValid}]">
      <div v-if="hasPrefix" class="prefix-wrapper"><slot name="prefix"></slot></div>
      <input
         type="text"
         :value="formattedTime"
         @input="handleInput"
         @blur="handleBlur"
         @focus="handleFocus"
         @click.stop="toggleTimePicker"
         class="time-input"
      />
      <div v-if="hasSuffix" class="suffix-wrapper"><slot name="suffix"></slot></div>
      <div v-if="!isTimeValid" class="error-message">Invalid time</div>
      <div v-if="showTimePicker" class="time-picker-popup" @click.stop>
         <TimePickerPopup
            :selectedTime="internalValue"
            :format="format"
            :detail="detail"
            @select="selectTime"
            @item-selected="closeTimePicker"
         />
      </div>
   </div>
</template>
 
<script>
import TimePickerPopup from './TimePickerPopup.vue';

export default {
   name: 'TimePicker',
   components: {
      TimePickerPopup
   },
   mounted() {
      document.addEventListener('click', this.handleOutsideClick);
   },
   beforeUnmount() {
      document.removeEventListener('click', this.handleOutsideClick);
   },
   props: {
      modelValue: {
         type: String,
         default: ''
      },
      format: {
         type: String,
         default: '24',
         validator: (value) => ['12', '24'].includes(value)
      },
      detail: {
         type: String,
         default: 'minute',
         validator: (value) => ['hour', 'minute', 'second'].includes(value)
      },
      customClass: {
         type: [String, Object, Array],
         default: ''
      },
   },
   data() {
      return {
         internalValue: this.modelValue,
         isFocused: false,
         showTimePicker: false
      }
   },
   computed: {
      formattedTime() {
         if (!this.internalValue) return '';
         const date = new Date(`1970-01-01T${this.internalValue}`);
         return this.formatTime(date);
      },
      hasPrefix() {
         return !!this.$slots.prefix;
      },
      hasSuffix() {
         return !!this.$slots.suffix;
      },
      isTimeValid() {
         if (!this.internalValue) return true;
         const regex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;
         return regex.test(this.internalValue);
      }
   },
   watch: {
      modelValue(newValue) {
         this.internalValue = newValue;
      }
   },
   methods: {
      formatTime(date) {
         const options = {
            hour: 'numeric',
            minute: 'numeric',
            second: this.detail === 'second' ? 'numeric' : undefined,
            hour12: this.format === '12'
         };
         return new Intl.DateTimeFormat('en-US', options).format(date);
      },
      handleInput(event) {
         const inputValue = event.target.value;
         const parsedTime = this.parseTime(inputValue);
         
         if (parsedTime) {
            this.internalValue = parsedTime;
            this.$emit('update:modelValue', this.internalValue);
         }
      },
      // parseTime(timeString) {
      //    // Implement time parsing logic here
      //    // This should handle both 12-hour and 24-hour formats
      //    // and return the time in ISO format (HH:mm:ss)
      // },
      handleBlur() {
         this.isFocused = false;
      },
      handleFocus() {
         this.isFocused = true;
      },
      toggleTimePicker() {
         this.showTimePicker = !this.showTimePicker;
      },
      selectTime(time) {
         this.internalValue = time;
         this.$emit('update:modelValue', this.internalValue);
         // Don't close the popup here
      },
      closeTimePicker() {
         this.showTimePicker = false;
      },
      handleOutsideClick(event) {
         if (!this.$el.contains(event.target)) {
            this.showTimePicker = false;
         }
      }
   }
 }
 </script>
 
<style scoped>
.time-picker-container {
   @apply flex p-0 items-center border border-gray-300 rounded-md transition-all duration-200 relative;
}
.focused {
   @apply ring-1 ring-teal-500;
}
.time-input {
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
.time-picker-popup {
   @apply absolute top-full left-0 mt-1 z-10;
}
</style>