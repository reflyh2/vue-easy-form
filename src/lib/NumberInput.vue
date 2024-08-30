<template>
  <div class="number-input-container" :class="[customClass, {'focused': isFocused, [colorClasses.ring]: isFocused}]">
    <div v-if="hasPrefix" class="prefix-wrapper"><slot name="prefix"></slot></div>
    <input
      type="text"
      :value="formattedValue"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      class="number-input"
      v-bind="$attrs"
    />
    <div v-if="hasSuffix" class="suffix-wrapper"><slot name="suffix"></slot></div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
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
    mainColor: {
      type: String,
      default: 'teal'
    },
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
    },
    hasPrefix() {
      return !!this.$slots.prefix;
    },
    hasSuffix() {
      return !!this.$slots.suffix;
    },
    colorClasses() {
      return {
        ring: `ring-${this.mainColor}-500`,
      }
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
  @apply flex p-0 items-center border border-gray-300 rounded-md transition-all duration-200;
}
.focused {
  @apply ring-1;
}
.number-input {
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