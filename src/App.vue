<template>
  <div id="app">
    <h1>Vue Easy Form Test</h1>
    <NumberInput 
      v-model="number" 
      :locale="'id-ID'" 
      :custom-class="customClass"
      prefix="Rp"
      suffix="/day"
      focus-ring-color="green-500"
    />
    <p>Number value: {{ number }}</p>
    <hr>
    <MaskedInput 
      v-model="phoneNumber" 
      mask="(###) ###-####"
      :custom-class="customClass"
      prefix="☎"
      focus-ring-color="green-500"
    />
    <p>Phone number: {{ phoneNumber }}</p>
  </div>
</template>

<script>
import { MaskedInput, NumberInput } from '@reflyh2/vue-easy-form'

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