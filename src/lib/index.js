import '../assets/tailwind.css'
import MaskedInput from './MaskedInput.vue'
import NumberInput from './NumberInput.vue'

export {
   MaskedInput, NumberInput
}

export default { 
   install: (app) => { 
      app.component('MaskedInput', MaskedInput), 
      app.component('NumberInput', NumberInput) 
   }
}