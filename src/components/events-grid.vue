<template>
  <div>
    <div class="events-grid">
      <div
        v-for="(day, index) in currentWeekDays"
        :key="index"
        :class="{solo: $store.state.soloColumnIndex === index}"
        class="col"
      >
        <div
          :class="{'current-day': isToday(day)}"
          class="col-head"
        >
          <div class="day-date">
            {{ day | formatDate('D') }}
          </div>
          <div class="day-name">
            {{ day | formatDate('dd') }}
          </div>
        </div>
        <template v-if="$store.state.isDataLoaded">
          <transition-group
            appear
            enter-active-class="animated fadeInUp"
            leave-active-class="animated bounceOutRig"
          >
            <div
              v-if="!weekSchedule[index].length"
              key="free-day"
              class="free-day-wrapper"
            >
              <div
                class="free-day"
              >
                Нет занятий
              </div>
            </div>
            <event-card
              v-for="event in weekSchedule[index]"
              :key="event.id"
              :event="event"
            />
          </transition-group>
        </template>
      </div>
    </div>
    <div
      v-if="!$store.state.isDataLoaded"
      class="preloader"
    >
      <div class="lds-roller">
        <div /><div /><div /><div /><div /><div /><div /><div />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { isSameDay, getISODay, isToday } from 'date-fns';
import eventCard from './event-card.vue';

export default {
  name: 'EventsGrid',
  components: {
    eventCard,
  },
  data() {
    return {
      today: new Date(),
    };
  },
  computed: {
    weekSchedule() {
      const events = Array(7)
        .fill(null)
        .map(() => []);
      for (const event of this.filteredLessons) {
        // ISO день недели от 1 (пн) до 7 (вс)
        const day = getISODay(new Date(event.startDate)) - 1;
        events[day].push(event);
      }

      return events;
    },
    ...mapGetters(['currentWeekDays', 'filteredLessons']),
  },
  methods: {
    isToday,
  },
};
</script>

<style lang="scss" scoped>
.preloader {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.events-grid {
  display: flex;
}

.col {
  width: calc(100% / 7);
  padding: 5px;
}

.col-head {
  padding-left: 5px;
  display: flex;
  align-items: center;
  height: 50px;
}

.day-name {
  position: relative;
  top: -2px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.day-date {
  margin-right: 5px;
  font-size: 1.4rem;
  font-weight: 800;
  text-transform: capitalize;
}

.free-day-wrapper {
  display: flex;
  justify-content: center;
}

.free-day {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  white-space: nowrap;
  font-size: 1.2rem;
  color: #dedede;
  margin-bottom: 50px;
}

@media (max-width: 900px) {
  .col:not(.solo) {
    display: none;
  }

  .col {
    width: 100%;
  }

  .col-head {
    display: none;
  }

  .free-day {
      transform: rotate(-40deg) translateY(10px) translateX(-10px);
  }
}
</style>
