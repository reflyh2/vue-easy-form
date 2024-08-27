<template>
   <div class="time-picker-popup" @mousedown.stop>
     <div class="time-columns">
       <div class="time-column">
         <div class="time-label">Hour</div>
         <div class="time-list-container">
           <div class="time-list" ref="hourList" @wheel.prevent="handleWheel('hour', $event)">
             <div v-for="hour in hours" :key="hour" class="time-item" :class="{ 'selected': hour === selectedHour }" @click.stop="selectItem('hour', hour); $emit('item-selected')">
               {{ formatNumber(hour) }}
             </div>
           </div>
           <div class="time-list-overlay"></div>
         </div>
       </div>
       <div v-if="detail !== 'hour'" class="time-column">
         <div class="time-label">Minute</div>
         <div class="time-list-container">
           <div class="time-list" ref="minuteList" @wheel.prevent="handleWheel('minute', $event)">
             <div v-for="minute in minutes" :key="minute" class="time-item" :class="{ 'selected': minute === selectedMinute }" @click.stop="selectItem('minute', minute); $emit('item-selected')">
               {{ formatNumber(minute) }}
             </div>
           </div>
           <div class="time-list-overlay"></div>
         </div>
       </div>
       <div v-if="detail === 'second'" class="time-column">
         <div class="time-label">Second</div>
         <div class="time-list-container">
           <div class="time-list" ref="secondList" @wheel.prevent="handleWheel('second', $event)">
             <div v-for="second in seconds" :key="second" class="time-item" :class="{ 'selected': second === selectedSecond }" @click.stop="selectItem('second', second); $emit('item-selected')">
               {{ formatNumber(second) }}
             </div>
           </div>
           <div class="time-list-overlay"></div>
         </div>
       </div>
     </div>
     <div v-if="format === '12'" class="am-pm-buttons">
       <button @click="selectAMPM('AM')" :class="{ 'selected': ampm === 'AM' }">AM</button>
       <button @click="selectAMPM('PM')" :class="{ 'selected': ampm === 'PM' }">PM</button>
     </div>
   </div>
 </template>
 
 <script>
 export default {
   name: 'TimePickerPopup',
   props: {
     selectedTime: {
       type: String,
       required: true
     },
     format: {
       type: String,
       required: true
     },
     detail: {
       type: String,
       required: true
     }
   },
   data() {
     return {
       selectedHour: 0,
       selectedMinute: 0,
       selectedSecond: 0,
       ampm: 'AM',
       hours: this.format === '12' ? Array.from({ length: 12 }, (_, i) => i + 1) : Array.from({ length: 24 }, (_, i) => i),
       minutes: Array.from({ length: 60 }, (_, i) => i),
       seconds: Array.from({ length: 60 }, (_, i) => i),
     }
   },
   mounted() {
     this.parseSelectedTime();
     this.$nextTick(() => {
       this.scrollToSelected();
     });
   },
   methods: {
     parseSelectedTime() {
       if (this.selectedTime) {
         const [hours, minutes, seconds] = this.selectedTime.split(':');
         let parsedHours = parseInt(hours);
         this.selectedMinute = parseInt(minutes) || 0;
         this.selectedSecond = parseInt(seconds) || 0;
         if (this.format === '12') {
           this.ampm = parsedHours >= 12 ? 'PM' : 'AM';
           this.selectedHour = parsedHours % 12 || 12;
         } else {
           this.selectedHour = parsedHours;
         }
       }
     },
     formatNumber(num) {
       return num.toString().padStart(2, '0');
     },
     selectItem(type, value) {
       this[`selected${type.charAt(0).toUpperCase() + type.slice(1)}`] = value;
       const listRef = this.$refs[`${type}List`];
       if (listRef) {
         const itemHeight = 40; // Adjust this value based on your CSS
         const index = this[`${type}s`].indexOf(value);
         listRef.style.transform = `translateY(${-index * itemHeight + 80}px)`;
       }
       this.updateTime();
       this.$emit('item-selected');
     },
     selectAMPM(period) {
       this.ampm = period;
       this.updateTime();
     },
     updateTime() {
       let hours = this.selectedHour;
       if (this.format === '12') {
         if (this.ampm === 'PM' && hours < 12) {
           hours += 12;
         } else if (this.ampm === 'AM' && hours === 12) {
           hours = 0;
         }
       }
       const time = `${this.formatNumber(hours)}:${this.formatNumber(this.selectedMinute)}${this.detail === 'second' ? ':' + this.formatNumber(this.selectedSecond) : ''}`;
       this.$emit('select', time);
     },
     scrollToSelected(type = null) {
       const types = type ? [type] : ['hour', 'minute', 'second'];
       types.forEach(t => {
         const listRef = this.$refs[`${t}List`];
         if (listRef) {
           const itemHeight = 40; // Adjust this value based on your CSS
           const selectedValue = this[`selected${t.charAt(0).toUpperCase() + t.slice(1)}`];
           listRef.style.transform = `translateY(${-selectedValue * itemHeight + 80}px)`;
         }
       });
     },
     handleWheel(type, event) {
       const delta = event.deltaY > 0 ? 1 : -1;
       const listRef = this.$refs[`${type}List`];
       const items = this[`${type}s`];
       const currentIndex = items.indexOf(this[`selected${type.charAt(0).toUpperCase() + type.slice(1)}`]);
       const newIndex = (currentIndex + delta + items.length) % items.length;
       const newValue = items[newIndex];

       this[`selected${type.charAt(0).toUpperCase() + type.slice(1)}`] = newValue;
       
       if (listRef) {
         const itemHeight = 40; // Adjust this value based on your CSS
         listRef.style.transform = `translateY(${-newIndex * itemHeight + 80}px)`;
       }

       this.updateTime();
     }
   }
 }
 </script>
 
 <style scoped>
 .time-picker-popup {
   @apply flex bg-white border border-gray-200 rounded-md shadow-md p-4;
 }
 .time-columns {
   @apply flex space-x-4;
 }
 .time-column {
   @apply flex flex-col items-center;
 }
 .time-label {
   @apply text-sm font-semibold mb-2;
 }
 .time-list-container {
   @apply relative h-40 overflow-hidden;
   width: 60px;
 }
 .time-list {
   @apply absolute top-0 left-0 w-full transition-transform duration-200 ease-out;
 }
 .time-item {
   @apply py-2 px-4 cursor-pointer hover:bg-gray-100 text-center;
   height: 40px;
 }
 .time-item.selected {
   @apply bg-teal-500 text-white;
 }
 .time-list-overlay {
   @apply absolute top-0 left-0 w-full h-full pointer-events-none;
   background: linear-gradient(to bottom, 
     rgba(255,255,255,1) 0%,
     rgba(255,255,255,0) 25%,
     rgba(255,255,255,0) 75%,
     rgba(255,255,255,1) 100%
   );
 }
 .am-pm-buttons {
   @apply flex flex-col ml-4;
 }
 .am-pm-buttons button {
   @apply px-3 py-2 mb-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md;
 }
 .am-pm-buttons button.selected {
   @apply bg-teal-500 text-white;
 }
 </style>