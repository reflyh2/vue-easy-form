<template>
  <div id="app">
    <NumberInput 
      v-model="number" 
      :locale="'id-ID'" 
      :custom-class="customClass"
      prefix="Rp"
      suffix="/day"
      focus-ring-color="green-500"
    />
    <p>Number value: {{ number }}</p>

    <MaskedInput 
      v-model="phoneNumber" 
      mask="(###) ###-####"
      :custom-class="customClass"
      prefix="☎"
      focus-ring-color="green-500"
    />
    <p>Phone number: {{ phoneNumber }}</p>

    <MaskedInput 
      v-model="licensePlate" 
      mask="AAA-####"
      :custom-class="customClass"
      prefix="🚗"
      focus-ring-color="blue-500"
    />
    <p>License Plate: {{ licensePlate }}</p>

    <MaskedInput 
      v-model="productCode" 
      mask="**-****-**"
      :custom-class="customClass"
      prefix="📦"
      focus-ring-color="purple-500"
    />
    <p>Product Code: {{ productCode }}</p>
  </div>
</template>

<script>
import NumberInput from './components/NumberInput.vue'
import MaskedInput from './components/MaskedInput.vue'

export default {
  name: 'App',
  components: {
    NumberInput,
    MaskedInput
  },
  data() {
    return {
      number: 1000,
      phoneNumber: '',
      licensePlate: '',
      productCode: '',
      customClass: ['w-80 text-red-600']
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>