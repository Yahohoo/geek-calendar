<template>
  <div class="calendar-app">
    <modal />
    <selectors />
    <control-panel />
    <events-grid />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import modal from './components/modal.vue'
import selectors from './components/selectors'
import controlPanel from './components/control-panel.vue'
import eventsGrid from './components/events-grid.vue'

export default {
  name: 'App',

  components: {
    modal,
    selectors,
    controlPanel,
    eventsGrid,
  },

  computed: {
    ...mapState(['filters', 'currentWeekStartDay', 'soloColumnIndex']),

    paramsForSearchString() {
      return {
        filters: this.filters,
        date: {
          week: this.currentWeekStartDay,
          day: this.soloColumnIndex,
        },
      }
    },
  },

  watch: {
    paramsForSearchString(newParams) {
      window.history.pushState(
        {},
        '',
        `?state=${encodeURI(JSON.stringify(newParams))}`,
      )
    },
  },

  created() {
    this.loadDataForWeek()
  },

  mounted() {
    const { href } = window.location
    const params = new window.URL(href).searchParams
    const state = JSON.parse(params.get('state'))

    if (state && state.filters) {
      this.updateFilters({ filters: state.filters })
    }

    if (state && state.date) {
      this.setSoloColumnIndex({ index: +state.date.day })
      this.setWeekStart({ startDay: new Date(state.date.week) })
    }
  },

  methods: {
    ...mapMutations(['updateFilters', 'setSoloColumnIndex', 'setWeekStart']),
    ...mapActions(['loadDataForWeek']),
  },
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

.calendar-app {
  @import url('https://fonts.googleapis.com/css?family=Ubuntu');
  @import url('https://fonts.googleapis.com/css?family=Open+Sans');
  font-family: 'Ubuntu', sans-serif;
  color: #212121;
  margin: auto;
  padding: 5px;
}

$themes: (
  'preschoolars': #d52a76,
  'grades1-2': #f4d14e,
  'grades3-4': #95c93a,
  'grades5-11': #7ed4e4,
  'no-age': #14b1cd
);

@each $class, $color in $themes {
  .#{$class} {
    border-color: $color;
  }
}

.break-word {
  word-wrap: break-word;
}

.button {
  color: #7f8285;
  background-color: #ebebeb;
  border: none;
  outline: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 10px;
  font-weight: bold;
}
</style>

<style lang=scss>
// загрузка в сетке
.lds-roller {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}

.lds-roller div {
  animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 32px 32px;
}

.lds-roller div:after {
  content: " ";
  display: block;
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: lightblue;
  margin: -3px 0 0 -3px;
}

.lds-roller div:nth-child(1) {
  animation-delay: -0.036s;
}

.lds-roller div:nth-child(1):after {
  top: 50px;
  left: 50px;
}

.lds-roller div:nth-child(2) {
  animation-delay: -0.072s;
}

.lds-roller div:nth-child(2):after {
  top: 54px;
  left: 45px;
}

.lds-roller div:nth-child(3) {
  animation-delay: -0.108s;
}

.lds-roller div:nth-child(3):after {
  top: 57px;
  left: 39px;
}

.lds-roller div:nth-child(4) {
  animation-delay: -0.144s;
}

.lds-roller div:nth-child(4):after {
  top: 58px;
  left: 32px;
}

.lds-roller div:nth-child(5) {
  animation-delay: -0.18s;
}

.lds-roller div:nth-child(5):after {
  top: 57px;
  left: 25px;
}

.lds-roller div:nth-child(6) {
  animation-delay: -0.216s;
}

.lds-roller div:nth-child(6):after {
  top: 54px;
  left: 19px;
}

.lds-roller div:nth-child(7) {
  animation-delay: -0.252s;
}

.lds-roller div:nth-child(7):after {
  top: 50px;
  left: 14px;
}

.lds-roller div:nth-child(8) {
  animation-delay: -0.288s;
}

.lds-roller div:nth-child(8):after {
  top: 45px;
  left: 10px;
}

@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
// запись активна
.lds-ripple {
  display: inline-block;
  position: relative;
  width: 25px;
  height: 25px;
}

.lds-ripple div {
  position: absolute;
  border: 2px solid lightblue;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}

@keyframes lds-ripple {
  0% {
    top: 10px;
    left: 10px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 20px;
    height: 20px;
    opacity: 0;
  }
}
</style>
