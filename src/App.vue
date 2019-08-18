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
import {
  compressToEncodedURIComponent as compress,
  decompressFromEncodedURIComponent as decompress,
} from 'lz-string'

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
      const compressedParams = compress(JSON.stringify(newParams))
      this.$frame.sendMessage('new-state', compressedParams)
      window.history.pushState({}, '', `?__sched_state=${compressedParams}`)
    },
  },

  created() {
    this.$frame.sendMessage('ready')
    this.$frame.onMessage('data-src', (dataSrc) => {
      this.setDataSrc({ dataSrc })
      this.loadDataForWeek()
    })
    if (process.env.NODE_ENV !== 'production') {
      this.loadDataForWeek()
    }
  },

  mounted() {
    const { href } = window.location
    const params = new window.URL(href).searchParams
    const schedStateParam = params.get('__sched_state')
    const state = schedStateParam && JSON.parse(decompress(schedStateParam))

    if (state && state.filters) {
      this.updateFilters({ filters: state.filters })
    }

    if (state && state.date) {
      this.setSoloColumnIndex({ index: +state.date.day })
      this.setWeekStart({ startDay: new Date(state.date.week) })
    }
  },

  methods: {
    ...mapMutations(['updateFilters', 'setSoloColumnIndex', 'setWeekStart', 'setDataSrc']),
    ...mapActions(['loadDataForWeek']),
  },
}
</script>

<style lang="scss">
:root {
  --text-color-default: #212121;
  --bd-color-default: #6a6a6a;
  --active-color: #7281f1;
  --invalid-color: #f44336;
  --bd-color: var(--bd-color-default);
  --text-color: var(--text-color-default)
}

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
}

@media (min-width: 600px) {
  .calendar-app {
    padding: 0 50px;
  }
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
