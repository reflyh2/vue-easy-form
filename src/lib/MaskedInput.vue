<template>
  <div class="masked-input-container" :class="[customClass, {'ring-1': isFocused, [`ring-${focusRingColor}`]: isFocused}]">
    <span v-if="prefix" class="prefix">{{ prefix }}</span>
    <input
      type="text"
      :value="maskedValue"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      class="masked-input"
    />
    <span v-if="suffix" class="suffix">{{ suffix }}</span>
  </div>
</template>

<script>
export default {
  name: 'MaskedInput',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    mask: {
      type: String,
      required: true
    },
    customClass: {
      type: [String, Object, Array],
      default: ''
    },
    prefix: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    },
    focusRingColor: {
      type: String,
      default: 'blue-500'
    }
  },
  data() {
    return {
      isFocused: false,
      maskedValue: ''
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        this.maskedValue = this.applyMask(newValue)
      }
    }
  },
  methods: {
    applyMask(value) {
      let result = ''
      let valueIndex = 0

      for (let i = 0; i < this.mask.length && valueIndex < value.length; i++) {
         if (this.mask[i] === '#') {
            if (/\d/.test(value[valueIndex])) {
               result += value[valueIndex]
               valueIndex++
            } else {
               result += this.mask[i]
            }
         } else if (this.mask[i] === 'A') {
          if (/[a-zA-Z]/.test(value[valueIndex])) {
            result += value[valueIndex]
            valueIndex++
          } else {
            result += this.mask[i]
          }
        } else if (this.mask[i] === '*') {
          if (/[a-zA-Z0-9]/.test(value[valueIndex])) {
            result += value[valueIndex]
            valueIndex++
          } else {
            result += this.mask[i]
          }
        } else {
            result += this.mask[i]
            if (value[valueIndex] === this.mask[i]) {
               valueIndex++
            }
         }
      }

      return result
    },
    handleInput(event) {
      const inputValue = event.target.value
      const unmaskedValue = this.unmask(inputValue)
      const truncatedValue = unmaskedValue.slice(0, this.getMaxLength())
      this.maskedValue = this.applyMask(truncatedValue)
      this.$emit('update:modelValue', truncatedValue)
      
      // Set the input value to the masked value to prevent extra characters
      event.target.value = this.maskedValue
    },
    unmask(value) {
      let result = ''
      let valueIndex = 0

      for (let i = 0; i < this.mask.length && valueIndex < value.length; i++) {
        if (this.mask[i] === '#' && /\d/.test(value[valueIndex])) {
          result += value[valueIndex]
          valueIndex++
        } else if (this.mask[i] === 'A' && /[a-zA-Z]/.test(value[valueIndex])) {
          result += value[valueIndex]
          valueIndex++
        } else if (this.mask[i] === '*' && /[a-zA-Z0-9]/.test(value[valueIndex])) {
          result += value[valueIndex]
          valueIndex++
        } else if (value[valueIndex] === this.mask[i]) {
          valueIndex++
        }
      }

      return result
    },
    getMaxLength() {
      return this.mask.replace(/[^#A*]/g, '').length
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
.masked-input-container {
  @apply flex items-center p-2 border border-gray-300 rounded-md transition-all duration-200;
}
.masked-input {
  @apply flex-1 border-none outline-none w-full px-2 bg-transparent;
}
.prefix, .suffix {
  @apply flex-shrink-0 px-1 text-gray-400;
}
</style>