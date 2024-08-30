<template>
   <div class="time-picker-container" :class="[customClass, {'focused': isFocused, 'invalid': !isTimeValid, [colorClasses.ring]: isFocused}]">
      <div v-if="hasPrefix" class="prefix-wrapper"><slot name="prefix"></slot></div>
      <input
         type="text"
         :value="formattedTime"
         @input="handleInput"
         @blur="handleBlur"
         @focus="handleFocus"
         @click.stop="toggleTimePicker"
         class="time-input"
         v-bind="$attrs"
      />
      <div v-if="hasSuffix" class="suffix-wrapper"><slot name="suffix"></slot></div>
      <div v-if="!isTimeValid" class="error-message">Invalid time</div>
      <div v-if="showTimePicker" class="time-picker-popup" @click.stop>
         <TimePickerPopup
            ref="timePickerPopup"
            :selectedTime="internalValue"
            :format="format"
            :detail="detail"
            :mainColor="mainColor"
            @select="selectTime"
            @item-selected="closeTimePicker"
         />
      </div>
   </div>
</template>
 
<script>
import TimePickerPopup from './TimePickerPopup.vue';

export default {
   inheritAttrs: false,
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
      mainColor: {
         type: String,
         default: 'teal'
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
      },
      colorClasses() {
         return {
            ring: `ring-${this.mainColor}-500`,
            text: `text-${this.mainColor}-600`,
            border: `border-${this.mainColor}-500`,
         }
      },
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
            if (this.showTimePicker) {
               this.$refs.timePickerPopup.updateSelectedTime(parsedTime);
            }
         }
      },
      parseTime(timeString) {
         const [time, period] = timeString.split(/\s+/);
         let [hours, minutes, seconds] = time.split(':').map(Number);

         if (this.format === '12' && period) {
            if (period.toLowerCase() === 'pm' && hours !== 12) {
               hours += 12;
            } else if (period.toLowerCase() === 'am' && hours === 12) {
               hours = 0;
            }
         }

         if (isNaN(hours) || hours < 0 || hours > 23) return null;
         if (isNaN(minutes) || minutes < 0 || minutes > 59) return null;
         if (seconds !== undefined && (isNaN(seconds) || seconds < 0 || seconds > 59)) return null;

         return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}${seconds !== undefined ? `:${seconds.toString().padStart(2, '0')}` : ''}`;
      },
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
   @apply ring-1;
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