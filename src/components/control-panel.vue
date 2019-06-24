<template>
  <div class="panel">
    <div class="panel-element">
      <div class="switchers">
        <button
          class="button today-switcher"
          @click="switchToCurrentWeek">
          Сегодня
        </button>
        <font-awesome-icon
          class="week-switcher"
          icon="caret-left"
          @click="switchToPreviousWeek" />
        <button
          class="current-month button"
          @click="switchDatepickerShow">
          <font-awesome-icon :icon="['far', 'calendar-alt']" />
          {{ currentMonth }}
        </button>
        <font-awesome-icon
          class="week-switcher"
          icon="caret-right"
          @click="switchToNextWeek" />
      </div>
      <datepicker
        v-if="showDatepicker"
        v-on-clickaway="switchDatepickerShow"
        class="panel-element datepicker"
        :language="ru"
        inline
        @selected="handleDatePick" />
    </div>
    <div class="panel-element week-days-switchers">
      <button
        v-for="(day, index) in currentWeekDays"
        :key="day.getDay()"
        :class="{ current: $store.state.soloColumnIndex === index }"
        class="button week-day-switcher"
        @click="setSoloColumnIndex({ index })">
        <div class="day-name">
          {{ day | formatDate('dd') }}
        </div>
        <div class="day-date">
          {{ day | formatDate('D') }}
        </div>
      </button>
    </div>
    <div class="panel-element color-legend">
      <span class="color-legend-element preschoolars">Дошкольники</span>
      <span class="color-legend-element grades1-2">1-2 класс</span>
      <span class="color-legend-element grades3-4">3-4 класс</span>
      <span class="color-legend-element grades5-11">5-11 класс</span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'

import Datepicker from 'vuejs-datepicker'
import { ru } from 'vuejs-datepicker/src/locale'

import {
  startOfWeek,
  getISODay,
} from 'date-fns'

export default {
  components: {
    Datepicker,
  },

  mixins: [clickaway],

  data() {
    return {
      ru,
      showDatepicker: false,
    }
  },

  computed: {
    ...mapGetters([
      'currentMonth',
      'currentWeekDays',
    ]),
  },

  methods: {
    ...mapMutations([
      'setSoloColumnIndex',
      'setWeekStart',
    ]),

    ...mapActions([
      'switchToNextWeek',
      'switchToPreviousWeek',
      'switchToCurrentWeek',
    ]),

    switchDatepickerShow() {
      this.showDatepicker = !this.showDatepicker
    },

    handleDatePick(date) {
      this.setWeekStart({ startDay: startOfWeek(date, { weekStartsOn: 1 }) })
      this.setSoloColumnIndex({ index: getISODay(date) - 1 })
    },
  },
}
</script>

<style lang="scss" scoped>
.panel {
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  color: #7f8285;
  position: relative;
  align-items: flex-start;
}

.panel-element {
  margin-bottom: 15px;
}

.switchers {
  justify-content: center;
  align-items: center;
  display: flex;
}

.today-switcher {
  margin-right: 15px;
}

.current-month {
  cursor: pointer;
  text-transform: capitalize;
  font-size: 1.1rem;
  margin: 0 10px;
}

.datepicker {
  // position: absolute;
  margin: 10px;
}

@media (min-width: 1100px) {
  .week-days-switchers {
    display: none;
  }
}

.week-switcher {
  cursor: pointer;
  font-size: 2rem;
}

.week-day-switcher {
  margin: 0 5px;
}

.week-day-switcher.current {
  background-color: #7281f1;
  color: #fff;
}

@media (max-width: 420px) {
  .week-day-switcher {
    margin: 0 2px;
  }
}

.color-legend-element {
  margin: 0 10px;
  box-sizing: border-box;
  font-size: 0.9rem;
  display: inline-block;
  border-style: solid;
  border-width: 0 0 2px 0;
  border-radius: 1px;
}
</style>
