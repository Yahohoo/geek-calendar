<template>
  <div
    :class="themeClass"
    class="card"
    @click="toggleModal"
  >
    <div class="header">
      <template v-if="isClosed">
        <img
          :src="cover"
          class="cover"
        >
        <div class="header-description">
          <!-- <div class="address">{{ address }}</div> -->
          <div class="address break-word">
            {{ room }}
          </div>
          <div class="time">
            {{ timing }}
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
    <div class="heading break-word">
      {{ title }}
    </div>
    <div class="description">
      <div class="address break-word">
        {{ room }}
      </div>
      <div class="time">
        {{ timing }}
      </div>
      <div
        v-if="age"
        class="age"
      >
        {{ age }}
      </div>
      <div
        v-if="event.teacher"
        class="teacher"
      >
        <img
          :src="require('@/assets/avatar-inside-a-circle.svg')"
          class="teacher-avatar"
        >
        <span class="teacher-name break-word">{{ event.teacher.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { format, addMinutes, isEqual } from 'date-fns';
import ru from 'date-fns/locale/ru';
import { mapMutations } from 'vuex';
import { get, update } from 'lodash-es';

export default {
  props: {
    event: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    timing() {
      const start = new Date(this.event.startDate);
      const end = addMinutes(start, this.event.baseLesson.duration);
      const startString = format(start, 'HH:mm');
      const endString = isEqual(start, end) ? '' : ` - ${format(end, 'HH:mm')}`;

      return startString + endString;
    },

    age() {
      let min; let max; let
        type;
      const bl = this.event.baseLesson;

      if (!bl.minClass && !bl.minAge) {
        return null;
      }

      if (bl.minClass) {
        min = bl.minClass;
        max = bl.maxClass;
        type = ' класс';
      } else {
        min = bl.minAge;
        max = bl.maxAge;
        type = ' лет';
      }

      return `${min}${min !== max ? `-${max}` : ''} ${type}`;
    },

    isClosed() {
      // return this.event.baseLesson.status == 2
      return true;
    },

    themeClass() {
      const lesson = this.event.baseLesson;

      if (lesson.minClass === null && lesson.minAge === null) {
        return 'no-age';
      } if (lesson.minAge && !lesson.minClass) {
        return 'preschoolars';
      } if (lesson.minClass <= 2) {
        return 'grades1-2';
      } if (lesson.minClass <= 4) {
        return 'grades3-4';
      }
      return 'grades5-11';
    },

    title() {
      return this.event.baseLesson.name.trim();
    },

    address() {
      return this.$store.state.titles.address[
        get(this.event, this.$store.state.paths.address)
      ];
    },

    date() {
      return format(
        new Date(this.event.startDate),
        'D MMMM YYYY, dddd',
        { locale: ru },
      );
    },

    cover() {
      return this.event.cover || require('@/assets/cover-default.jpg');
    },

    room() {
      return this.event.room.name;
    },

    teacher() {
      let { teacher } = this.event;

      if (!teacher) return null;

      teacher = { ...teacher };
      return update(teacher, 'avatar', ava => ava || require('@/assets/avatar-default.png'));
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
      };
    },
  },

  methods: {
    ...mapMutations(['setModalStatus', 'setModalData']),
    toggleModal() {
      this.setModalStatus({ isOpened: true });
      this.setModalData({ data: { ...this.extractedData } });
    },
  },
};
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
  }

  .header {
    display: flex;
    font-size: 0.6rem;
    align-items: center;
    margin-bottom: 8px;
  }

  .cover {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: block;
    object-fit: cover;
    margin-right: 5px;
  }

  .header-description {
    min-width: 0;
  }

  .heading {
    font-weight: bold;
    margin-bottom: 10px;
  }

  .age {
    margin-bottom: 4px;
  }

  .teacher {
    display: flex;
    align-items: center;
  }

  .teacher-avatar {
    width: 15px;
    height: 15px;
    margin-right: 6px;
  }
</style>
