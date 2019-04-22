<template>
  <div class="calendar-app">
    <modal/>
    <selectors/>
    <control-panel/>
    <events-grid/>
  </div>
</template>

<script>
import modal from './components/modal.vue'
import selectors from './components/selectors'
import controlPanel from './components/control-panel.vue'
import eventsGrid from './components/events-grid.vue'
import schedule from './data.js'
import Vue from 'vue'
import { mapActions } from 'vuex'

export default {
  name: 'App',

  components: {
    modal,
    selectors,
    controlPanel,
    eventsGrid
  },

  computed: {
    filteredSchedule() {
      var filtered = this.schedule.filter(lesson => {
        return Object.values(lesson._filters).every(el => el)
      })
      return filtered
    }
  },

  created() {
    this.loadDataForWeek()
  },

  methods: {
    ...mapActions(['loadDataForWeek'])
  }
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
  max-width: 1200px;
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
