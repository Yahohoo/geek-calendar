<template>
  <div
    :class="themeClass"
    class="card"
    @click="toggleModal">
    <div class="header">
      <template v-if="isClosed">
        <img
          v-if="event.cover"
          :src="event.cover"
          class="cover">
        <div class="header-description">
          <div class="header-title break-word">
            {{ title }}
          </div>
          <div class="header-description-info">
            <div
              v-if="age"
              class="age">
              <font-awesome-icon
                class="icon"
                icon="child" />
              <!-- <img
                :src="require('@/assets/age-icon.svg')"
                class="icon"> -->
              <span>{{ age }}</span>
            </div>
            <div v-if="duration">
              <font-awesome-icon
                class="icon"
                icon="hourglass-half" />
              {{ duration }} мин.
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="future-event-cover">
          <div class="lds-ripple">
            <div />
            <div />
          </div>
        </div>
        <div class="future-event-start-date" />
        <div class="future-event-label" />
      </template>
    </div>
    <div class="description">
      <div class="description-item">
        <font-awesome-icon
          class="icon"
          :icon="['far', 'clock']" />
        {{ timing }}
      </div>
      <div class="description-item break-word">
        <font-awesome-icon
          class="icon"
          icon="map-marker-alt" />
        {{ address }}
      </div>
      <div
        v-if="event.teacher && event.teacher.name"
        class="description-item">
        <!-- <img
          :src="require('@/assets/avatar-inside-a-circle.svg')"
          class="icon"> -->
        <font-awesome-icon
          class="icon"
          icon="chalkboard-teacher" />
        {{ event.teacher.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { format, addMinutes, isEqual } from 'date-fns'
import ru from 'date-fns/locale/ru'
import { mapMutations } from 'vuex'
import { get, update } from 'lodash-es'

// const coverDefault = require('@/assets/cover-default.jpg')
const avatarDefault = require('@/assets/avatar-default.png')

export default {
  props: {
    event: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    duration() {
      return this.event.baseLesson.duration
    },

    timing() {
      const start = new Date(this.event.startDate)
      const end = addMinutes(start, this.event.baseLesson.duration)
      const startString = format(start, 'HH:mm')
      const endString = isEqual(start, end) ? '' : ` - ${format(end, 'HH:mm')}`

      return startString + endString
    },

    age() {
      let min; let max; let
        type
      const bl = this.event.baseLesson

      if (!bl.minClass && !bl.minAge) {
        return null
      }

      if (bl.minClass) {
        min = bl.minClass
        max = bl.maxClass
        type = ' класс'
      } else {
        min = bl.minAge
        max = bl.maxAge
        type = ' лет'
      }

      return `${min}${min !== max ? `-${max}` : ''} ${type}`
    },

    isClosed() {
      // return this.event.baseLesson.status == 2
      return true
    },

    themeClass() {
      const lesson = this.event.baseLesson

      if (lesson.minClass === null && lesson.minAge === null) {
        return 'no-age'
      } if (lesson.minAge && !lesson.minClass) {
        return 'preschoolars'
      } if (lesson.minClass <= 2) {
        return 'grades1-2'
      } if (lesson.minClass <= 4) {
        return 'grades3-4'
      }
      return 'grades5-11'
    },

    title() {
      return this.event.baseLesson.name.trim()
    },

    address() {
      return this.$store.state.maps.address[
        get(this.event, this.$store.state.paths.address)
      ]
    },

    date() {
      return format(
        new Date(this.event.startDate),
        'D MMMM YYYY, dddd',
        { locale: ru },
      )
    },

    room() {
      return this.event.room.name
    },

    teacher() {
      let { teacher } = this.event

      if (!teacher) return null

      teacher = { ...teacher }
      return update(teacher, 'avatar', ava => ava || avatarDefault)
    },

    extractedData() {
      return {
        timing: this.timing,
        age: this.age,
        themeClass: this.themeClass,
        title: this.title,
        address: this.address,
        date: this.date,
        cover: this.cover,
        room: this.room,
        teacher: this.teacher,
        id: this.event.id,
        baseId: this.event.baseLesson.id,
        duration: this.event.baseLesson.duration,
        description: this.event.description,
      }
    },
  },

  methods: {
    ...mapMutations(['setModalStatus', 'setModalData']),
    toggleModal() {
      this.setModalStatus({ isOpened: true })
      this.setModalData({ data: { ...this.extractedData } })
    },
  },
}
</script>

<style lang="scss" scoped>
  .card {
    font-size: 0.7rem;
    border-radius: 3px;
    border-style: solid;
    border-width: 0 0 0 7px;
    margin-bottom: 10px;
    padding: 7px;
      max-width: 400px;
    margin-right: auto;
    margin-left: auto;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.12);
    transition: 0.4s ease-out;
    cursor: pointer;
  }

  // .card:hover::before {
  //   content: 'Записаться';
  //   position: absolute;
  //   top: 0;
  //   bottom: 0;
  //   left: 0;
  //   right: 0;
  //   font-weight: bold;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   font-size: 0.8rem;
  //   color: #00c853;
  //   background-color: #ffffffdd;
  //   border-radius: 16px;
  // }

  .card:hover {
    // filter: blur(2px) opacity(0.6);
    transform: scale(1.05);
    box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14),
      0 4px 2px -3px rgba(0, 0, 0, 0.12);
  }

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .cover {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: block;
    object-fit: cover;
    margin-right: 5px;
  }

  .header-title {
    font-weight: bold;
  }

  .header-description {
    min-width: 0;
  }

  .header-description-info {
    font-size: 0.6rem;
    margin-top: 6px;
    display: flex;
    min-width: 0;
  }

  .age {
    margin-right: 5px;
  }

  .info-line:not(:last-of-type) {
    margin: 0 5px 5px 0;
  }

  .icon {
    display: inline-flex;
    width: 15px;
    justify-content: center;
    font-size: 0.7rem;
    color: gray;
    margin-right: 5px;
  }

  .description-item {
    margin-bottom: 4px;
  }
</style>
