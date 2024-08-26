<template>
  <div class="number-input-container" :class="[customClass, {'ring-1': isFocused, [`ring-${focusRingColor}`]: isFocused}]">
    <slot name="prefix"></slot>
    <input
      type="text"
      :value="formattedValue"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      class="number-input"
    />
    <slot name="suffix"></slot>
  </div>
</template>

<script>
export default {
  name: 'NumberInput',
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    locale: {
      type: String,
      default: 'en-US'
    },
    customClass: {
      type: [String, Object, Array],
      default: ''
    },
    focusRingColor: {
      type: String,
      default: 'blue-500'
    }
  },
  data() {
    return {
      internalValue: this.modelValue,
      isFocused: false
    }
  },
  computed: {
    formattedValue() {
      return this.formatNumber(this.internalValue)
    },
    thousandSeparator() {
      const parts = Intl.NumberFormat(this.locale).formatToParts(1000);
      return parts.find(part => part.type === 'group').value;
    },
    decimalSeparator() {
      const parts = Intl.NumberFormat(this.locale).formatToParts(1.1);
      return parts.find(part => part.type === 'decimal').value;
    }
  },
  watch: {
    modelValue(newValue) {
      this.internalValue = newValue
    }
  },
  methods: {
    formatNumber(num) {
      return new Intl.NumberFormat(this.locale).format(num)
    },
    parseNumber(str) {
      const cleanStr = str.replace(new RegExp(`\\${this.thousandSeparator}`, 'g'), '')
                         .replace(this.decimalSeparator, '.');
      return parseFloat(cleanStr);
    },
    handleInput(event) {
      const inputValue = event.target.value
      const numericValue = this.parseNumber(inputValue)
      
      if (!isNaN(numericValue)) {
        this.internalValue = numericValue
        this.$emit('update:modelValue', numericValue)
      }
    },
    handleBlur() {
      this.isFocused = false
      this.internalValue = this.parseNumber(this.formattedValue)
      this.$emit('update:modelValue', this.internalValue)
    },
    handleFocus() {
      this.isFocused = true
    }
  }
}
</script>

<style scoped>
.number-input-container {
  @apply flex items-center p-2 border border-gray-300 rounded-md transition-all duration-200;
}
.number-input {
  @apply flex-1 border-none outline-none w-full px-2 bg-transparent;
}
</style>