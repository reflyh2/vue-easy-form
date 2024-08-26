<template>
  <div class="calendar" @mousedown.stop>
    <div class="calendar-header">
      <button @click="prevView">&lt;</button>
      <span @click="toggleView">{{ currentViewTitle }}</span>
      <button @click="nextView">&gt;</button>
    </div>
    <div v-if="currentView === 'date'" class="calendar-body">
      <div v-for="day in daysOfWeek" :key="day" class="calendar-day-header">{{ day }}</div>
      <div
        v-for="date in calendarDates"
        :key="date.toISOString()"
        class="calendar-date"
        :class="{
          'current-month': isCurrentMonth(date),
          'selected': isSelected(date),
          'disabled': isDisabled(date)
        }"
        @click="selectDate(date)"
      >
        {{ date.getDate() }}
      </div>
    </div>
    <div v-else-if="currentView === 'month'" class="calendar-body month-view">
      <div
        v-for="(month, index) in months"
        :key="month"
        class="calendar-month"
        :class="{ 'selected': index === currentDate.getMonth() }"
        @click="selectMonth(index)"
      >
        {{ month }}
      </div>
    </div>
    <div v-else-if="currentView === 'year'" class="calendar-body year-view">
      <div
        v-for="year in yearRange"
        :key="year"
        class="calendar-year"
        :class="{ 'selected': year === currentDate.getFullYear() }"
        @click="selectYear(year)"
      >
        {{ year }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalendarPopup',
  props: {
    selectedDate: {
      type: Date,
      required: true
    },
    minDate: {
      type: Date,
      default: null
    },
    maxDate: {
      type: Date,
      default: null
    }
  },
  data() {
    return {
      currentDate: new Date(this.selectedDate),
      daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      currentView: 'date'
    }
  },
  computed: {
    currentViewTitle() {
      if (this.currentView === 'date') {
        return this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
      } else if (this.currentView === 'month') {
        return this.currentDate.getFullYear().toString()
      } else {
        return `${this.yearRange[0]} - ${this.yearRange[this.yearRange.length - 1]}`
      }
    },
    calendarDates() {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()
      const firstDay = new Date(year, month, 1)
      const startOffset = firstDay.getDay()

      const dates = []
      for (let i = -startOffset; i < (42 - startOffset); i++) {
        dates.push(new Date(year, month, i + 1))
      }
      return dates
    },
    yearRange() {
      const currentYear = this.currentDate.getFullYear()
      const startYear = (Math.floor(currentYear / 10) * 10) + 1
      return Array.from({ length: 20 }, (_, i) => startYear + i)
    }
  },
  methods: {
    toggleView() {
      if (this.currentView === 'date') {
        this.currentView = 'month'
      } else if (this.currentView === 'month') {
        this.currentView = 'year'
      } else {
        this.currentView = 'date'
      }
    },
    prevView() {
      if (this.currentView === 'date') {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1)
      } else if (this.currentView === 'month') {
        this.currentDate = new Date(this.currentDate.getFullYear() - 1, 0, 1)
      } else {
        this.currentDate = new Date(this.currentDate.getFullYear() - 20, 0, 1)
      }
    },
    nextView() {
      if (this.currentView === 'date') {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
      } else if (this.currentView === 'month') {
        this.currentDate = new Date(this.currentDate.getFullYear() + 1, 0, 1)
      } else {
        this.currentDate = new Date(this.currentDate.getFullYear() + 20, 0, 1)
      }
    },
    isCurrentMonth(date) {
      return date.getMonth() === this.currentDate.getMonth()
    },
    isSelected(date) {
      return date.toDateString() === this.selectedDate.toDateString()
    },
    selectDate(date) {
      if (this.isDisabled(date)) return;
      this.$emit('select', date);
    },
    selectMonth(index) {
      this.currentDate = new Date(this.currentDate.getFullYear(), index, 1)
      this.currentView = 'date'
    },
    selectYear(year) {
      this.currentDate = new Date(year, this.currentDate.getMonth(), 1)
      this.currentView = 'date'
    },
    isDisabled(date) {
      return (this.minDate && date < this.minDate) || (this.maxDate && date > this.maxDate);
    }
  }
}
</script>

<style scoped>
.calendar {
  @apply bg-white border border-gray-200 rounded-md shadow-md p-2;
}
.calendar-header {
  @apply flex justify-between items-center mb-2 font-semibold;
}
.calendar-body {
  @apply grid grid-cols-7 gap-1;
}
.calendar-day-header {
  @apply text-center text-sm font-semibold text-gray-600;
}
.calendar-date {
  @apply text-center p-1 cursor-pointer hover:bg-gray-100 rounded-md;
}
.current-month {
  @apply font-semibold;
}
.selected {
  @apply bg-teal-500 text-white hover:bg-teal-600;
}
.calendar-month {
  @apply text-center p-1 cursor-pointer hover:bg-gray-100 rounded-md;
}
.calendar-year {
  @apply text-center p-1 cursor-pointer hover:bg-gray-100 rounded-md;
}
.calendar-body.month-view {
  @apply grid-cols-3;
}
.calendar-body.year-view {
  @apply grid-cols-4;
}
.calendar-month, .calendar-year {
  @apply text-center p-2 cursor-pointer hover:bg-gray-100 rounded-md;
}
.disabled {
  @apply text-gray-300 cursor-not-allowed font-medium hover:bg-white;
}
</style>