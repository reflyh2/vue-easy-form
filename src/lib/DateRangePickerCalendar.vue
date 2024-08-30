<template>
   <div class="date-range-calendar-container" @mousedown.stop>
      <div class="quick-ranges" v-if="quickRanges.length > 0">
         <button
            v-for="(range, index) in quickRanges"
            :key="index"
            @click="selectQuickRange(range)"
            class="quick-range-button"
         >
            {{ range.label }}
         </button>
      </div>
      <div class="date-range-calendar">
         <div class="calendar-header">
            <button @click="prevMonth">&lt;</button>
            <span>{{ currentMonthTitle }} - {{ nextMonthTitle }}</span>
            <button @click="nextMonth">&gt;</button>
         </div>
         <div class="calendars-container">
            <div class="calendar">
            <div v-for="day in daysOfWeek" :key="day" class="calendar-day-header">{{ day }}</div>
            <div
               v-for="date in currentMonthDates"
               :key="date.toISOString()"
               class="calendar-date"
               :class="getDateClasses(date)"
               @click="selectDate(date)"
            >
               {{ date.getDate() }}
            </div>
            </div>
            <div class="calendar">
            <div v-for="day in daysOfWeek" :key="day" class="calendar-day-header">{{ day }}</div>
            <div
               v-for="date in nextMonthDates"
               :key="date.toISOString()"
               class="calendar-date"
               :class="getDateClasses(date, true)"
               @click="selectDate(date)"
            >
               {{ date.getDate() }}
            </div>
            </div>
         </div>
      </div>
   </div>
</template>
 
<script>
export default {
   name: 'DateRangePickerCalendar',
   props: {
      startDate: {
         type: String,
         default: null
      },
      endDate: {
         type: String,
         default: null
      },
      minDate: {
         type: Date,
         default: null
      },
      maxDate: {
         type: Date,
         default: null
      },
      quickRanges: {
         type: Array,
         default: () => []
      }
   },
   data() {
      return {
         currentDate: new Date(),
         daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
         selectionStart: this.startDate ? new Date(this.startDate) : null,
         selectionEnd: this.endDate ? new Date(this.endDate) : null
      }
   },
   computed: {
      currentMonthTitle() {
         return this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      },
      nextMonthTitle() {
         const nextMonth = new Date(this.currentDate);
         nextMonth.setMonth(nextMonth.getMonth() + 1);
         return nextMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
      },
      currentMonthDates() {
         return this.getMonthDates(this.currentDate);
      },
      nextMonthDates() {
         const nextMonth = new Date(this.currentDate);
         nextMonth.setMonth(nextMonth.getMonth() + 1);
         return this.getMonthDates(nextMonth);
      },
      nextMonthDate() {
         const nextMonth = new Date(this.currentDate);
         nextMonth.setMonth(nextMonth.getMonth() + 1);
         return nextMonth;
      }
   },
   methods: {
      getMonthDates(date) {
         const year = date.getFullYear();
         const month = date.getMonth();
         const firstDay = new Date(year, month, 1);
         const startOffset = firstDay.getDay();

         const dates = [];
         for (let i = -startOffset; i < (42 - startOffset); i++) {
            dates.push(new Date(year, month, i + 1));
         }
         return dates;
      },
      prevMonth() {
         this.currentDate.setMonth(this.currentDate.getMonth() - 1);
         this.currentDate = new Date(this.currentDate);
      },
      nextMonth() {
         this.currentDate.setMonth(this.currentDate.getMonth() + 1);
         this.currentDate = new Date(this.currentDate);
      },
      selectDate(date) {
         if (this.isDisabled(date)) return;

         const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

         if (!this.selectionStart || (this.selectionStart && this.selectionEnd)) {
            this.selectionStart = utcDate;
            this.selectionEnd = null;
         } else {
            if (utcDate < this.selectionStart) {
            this.selectionEnd = this.selectionStart;
            this.selectionStart = utcDate;
            } else {
            this.selectionEnd = utcDate;
            }
            this.$emit('select', {
            startDate: this.selectionStart.toISOString().split('T')[0],
            endDate: this.selectionEnd.toISOString().split('T')[0]
            });
         }
      },
      getDateClasses(date, isNextMonth = false) {
         const isCurrentMonth = isNextMonth ? date.getMonth() === this.nextMonthDate.getMonth() : date.getMonth() === this.currentDate.getMonth();
         
         return {
            'current-month': isCurrentMonth,
            'in-range': isCurrentMonth && this.isInRange(date),
            'selected-date': isCurrentMonth && (this.isSelectedStart(date) || this.isSelectedEnd(date)),
            'range-start': isCurrentMonth && this.isSelectedStart(date) && !this.isSelectedEnd(date),
            'range-end': isCurrentMonth && this.isSelectedEnd(date) && !this.isSelectedStart(date),
            'disabled': this.isDisabled(date)
         };
      },
      isSelectedStart(date) {
         return this.selectionStart && this.toUTCDate(date).getTime() === this.selectionStart.getTime();
      },
      isSelectedEnd(date) {
         return this.selectionEnd && this.toUTCDate(date).getTime() === this.selectionEnd.getTime();
      },
      isInRange(date) {
         const utcDate = this.toUTCDate(date);
         return this.selectionStart && this.selectionEnd &&
               utcDate > this.selectionStart && utcDate < this.selectionEnd;
      },
      isDisabled(date) {
         return (this.minDate && date < this.minDate) || (this.maxDate && date > this.maxDate);
      },
      toUTCDate(date) {
         return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      },
      selectQuickRange(range) {
         const { startDate, endDate } = range.getRange();
         this.selectionStart = startDate;
         this.selectionEnd = endDate;
         this.$emit('select', {
            startDate: this.selectionStart.toISOString().split('T')[0],
            endDate: this.selectionEnd.toISOString().split('T')[0]
         });
      }
   }
}
</script>
 
<style scoped>
   .date-range-calendar-container {
      @apply flex bg-white border border-gray-200 rounded-md shadow-md;
   }
   .quick-ranges {
      @apply flex flex-col mr-4 space-y-2 border-r py-4 px-2;
   }
   .quick-range-button {
      @apply px-3 py-2 text-sm text-gray-700 hover:bg-main-100 rounded-md transition-colors duration-200 text-left;
   }
   .date-range-calendar {
      @apply flex-grow py-4 pl-2 pr-4;
   }
   .calendar-header {
      @apply flex justify-between items-center mb-2 font-semibold;
   }
   .calendars-container {
      @apply flex gap-4;
   }
   .calendar {
      @apply grid grid-cols-7 gap-1;
   }
   .calendar-day-header {
      @apply text-center text-sm font-semibold text-gray-600;
   }
   .calendar-date {
      @apply text-center p-1 cursor-pointer text-gray-400 hover:bg-gray-100 rounded-md;
   }
   .current-month {
      @apply text-black;
   }
   .selected-date {
      @apply bg-main-500 text-white hover:bg-main-600;
   }
   .in-range {
      @apply bg-main-100;
   }
   .disabled {
      @apply text-gray-300 cursor-not-allowed hover:bg-white;
   }
   .range-start {
      @apply rounded-l-md;
   }
   .range-end {
      @apply rounded-r-md;
   }
   .in-range:hover {
      @apply bg-main-200;
   }
   /* Ensure selected-date styles override in-range styles */
   .calendar-date.in-range.selected-date {
      @apply bg-main-500 text-white hover:bg-main-600;
   }
</style>