<template>
  <div class="date-picker-container" :class="[customClass, {'focused': isFocused, 'invalid': !isDateValid, [colorClasses.ring]: isFocused}]">
    <div v-if="hasPrefix" class="prefix-wrapper"><slot name="prefix"></slot></div>
    <input
      type="text"
      :value="formattedDate"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      @click="showCalendar = true"
      class="date-input"
      v-bind="$attrs"
    />
    <div v-if="hasSuffix" class="suffix-wrapper"><slot name="suffix"></slot></div>
    <div v-if="!isDateValid" class="error-message">Invalid date</div>
    <div v-if="showCalendar" class="calendar-popup">
      <CalendarPopup
        :selectedDate="new Date(internalValue)"
        :minDate="minDateObj"
        :maxDate="maxDateObj"
        :mainColor="mainColor"
        @select="selectDate"
      />
    </div>
  </div>
</template>

<script>
import CalendarPopup from './CalendarPopup.vue';

export default {
  inheritAttrs: false,
  name: 'DatePicker',
  components: {
   CalendarPopup
  },
  props: {
    modelValue: {
      type: String,
      default: ''
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
    mainColor: {
      type: String,
      default: 'teal'
    },
  },
  data() {
    return {
      internalValue: this.modelValue,
      isFocused: false,
      showCalendar: false
    }
  },
  computed: {
    formattedDate() {
      if (!this.internalValue) return '';
      const date = new Date(this.internalValue);
      return new Intl.DateTimeFormat(this.locale).format(date);
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
    isDateValid() {
      if (!this.internalValue) return true;
      const date = new Date(this.internalValue);
      return (
        (!this.minDateObj || date >= this.minDateObj) &&
        (!this.maxDateObj || date <= this.maxDateObj)
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
    modelValue(newValue) {
      this.internalValue = newValue;
    }
  },
  methods: {
    handleInput(event) {
      const inputValue = event.target.value;
      const date = this.parseDate(inputValue);
      
      if (date) {
        const isoDate = date.toISOString().split('T')[0];
        if (
          (!this.minDateObj || date >= this.minDateObj) &&
          (!this.maxDateObj || date <= this.maxDateObj)
        ) {
          this.internalValue = isoDate;
          this.$emit('update:modelValue', this.internalValue);
        } else {
          event.target.value = this.formattedDate;
        }
      }
    },
    parseDate(dateString) {
      const parts = dateString.split(/[/.-]/);
      if (parts.length !== 3) return null;

      let year, month, day;
      if (this.locale === 'en-US') {
        [month, day, year] = parts;
      } else {
        [day, month, year] = parts;
      }

      if (year.length === 2) {
        year = '20' + year;
      }

      const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));
      
      if (isNaN(date.getTime())) return null;
      
      if (this.minDateObj && date < this.minDateObj) return null;
      if (this.maxDateObj && date > this.maxDateObj) return null;
      
      return date;
    },
    handleBlur() {
      this.isFocused = false;
    },
    handleFocus() {
      this.isFocused = true;
    },
    selectDate(date) {
      const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      this.internalValue = utcDate.toISOString().split('T')[0];
      this.$emit('update:modelValue', this.internalValue);
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
.date-picker-container {
  @apply flex p-0 items-center border border-gray-300 rounded-md transition-all duration-200 relative;
}
.focused {
  @apply ring-1;
}
.date-input {
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