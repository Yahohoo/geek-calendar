<template>
  <div
    v-show="isOpened"
    class="enroll-modal-box">
    <div
      :style="{ top: top + 'px' }"
      :class="data.themeClass"
      class="enroll-modal">
      <font-awesome-icon
        class="modal-close"
        icon="times"
        @click="closeModal" />
      <div class="modal-header modal-block">
        <img
          v-if="data.cover"
          :src="data.cover"
          class="modal-header-cover">
        <div class="modal-header-info">
          <div class="modal-header-title">
            {{ data.title }}
          </div>
          <div class="modal-header-extra">
            <span
              v-if="data.age"
              class="header-extra-item age">
              <font-awesome-icon
                class="extra-item-icon"
                icon="child" />
              {{ data.age }}
            </span>
            <span
              v-if="data.duration"
              class="header-extra-item duration">
              <font-awesome-icon
                class="extra-item-icon"
                icon="hourglass-half" />
              {{ data.duration }} мин
            </span>
          </div>
        </div>
      </div>

      <div
        :class="{'opened-enroll': isFormOpened}"
        class="enroll-switcher">
        <div
          class="pre-enroll">
          <div class="event-info">
            <div class="event-info-item date">
              {{ data.date }}
            </div>
            <div class="event-info-item address">
              {{ data.address }}
            </div>
            <div class="event-info-item time">
              {{ data.timing }}
            </div>
          </div>
          <button
            class="modal-button show-form"
            @click="showForm">
            Запись
          </button>
        </div>

        <div
          class="modal-enroll modal-block">
          <div
            v-if="!(success || fail)"
            class="modal-enroll-form">
            <labeled-input
              :active="isActive('name')"
              class="enroll-field-wrap"
              label="Имя (обязательно)">
              <input
                v-model="enrollForm.name"
                class="bordered enroll-input enroll-input-field"
                type="text"
                required
                @focus="enrollFormFocus.name = true"
                @blur="enrollFormFocus.name = false">
            </labeled-input>

            <labeled-input
              :active="isActive('phone')"
              :invalid="Boolean(errorMessage('phone'))"
              :label="errorMessage('phone') || 'Телефон (обязательно)'"
              class="enroll-field-wrap">
              <input
                v-model="enrollForm.phone"
                v-validate="'required|phone'"
                class="bordered enroll-input enroll-input-field"
                name="phone"
                type="tel"
                title="+79996662233"
                @focus="enrollFormFocus.phone = true"
                @blur="enrollFormFocus.phone = false">
            </labeled-input>

            <labeled-input
              :active="isActive('email')"
              :invalid="Boolean(errorMessage('email'))"
              class="enroll-field-wrap"
              :label="errorMessage('email') || 'Email'">
              <input
                v-model="enrollForm.email"
                v-validate
                class="bordered enroll-input enroll-input-field"
                type="email"
                name="email"
                @focus="enrollFormFocus.email = true"
                @blur="enrollFormFocus.email = false">
            </labeled-input>

            <button
              :class="{ disabled: !isFormValid || sendingRequest }"
              :disabled="!isFormValid || sendingRequest"
              class="modal-button enroll-input submit-enroll"
              @click="sendEnrollRequest">
              Записаться
              <div
                v-if="sendingRequest"
                class="modal-button-loader">
                <c-loader />
              </div>
            </button>
          </div>
          <div
            v-else-if="success"
            class="enroll-success enroll-status">
            Спасибо за заявку!
            <br>Мы свяжемся с вами в ближайшее время.
          </div>
          <div
            v-else
            class="enroll-fail enroll-status">
            К сожалению, что-то пошло не так и мы не смогли принять вашу
            заявку.
            <br>Вы можете связаться с нами по телефону +7(495) 255-57-10
          </div>
        </div>
      </div>

      <div
        v-if="tabs.length"
        class="modal-about modal-block">
        <div class="modal-about-tabs">
          <div
            v-for="tab in tabs"
            :key="tab.name"
            :style="{cursor: tabs.length > 1 ? 'pointer' : 'default'}"
            :class="{current: isCurrentTab(tab.tab) && tabs.length > 1}"
            class="modal-about-tab"
            @click="currentTab = tab.tab">
            {{ tab.name }}
          </div>
        </div>
        <div
          v-for="tab in tabs"
          v-show="isCurrentTab(tab.tab)"
          :key="tab.name"
          class="modal-about-tab-body">
          {{ tab.content }}
        </div>
      </div>
      <div
        v-if="data.teacher"
        class="modal-teacher modal-block">
        <img
          :src="data.teacher.avatar"
          class="modal-teacher-photo">
        <div class="modal-teacher-info">
          <span class="modal-teacher-heading">Преподаватель</span>
          <br>
          <span class="modal-teacher-name">{{ data.teacher.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { mapFields } from 'vee-validate'
import labeledInput from './labeled-input.vue'
import cLoader from './c-loader.vue'

function parsePositionMessage(message) {
  message = message.split(' ')

  return {
    viewportWidth: message[0],
    viewportHeight: message[1],
    top: message[2],
    left: message[3],
    bottom: message[4],
    right: message[5],
  }
}

export default {
  components: {
    labeledInput,
    cLoader,
  },

  data() {
    return {
      isFormOpened: false,

      currentTab: null,

      enrollForm: {
        name: '',
        email: '',
        phone: '',
      },

      enrollFormFocus: {
        name: false,
        email: false,
        phone: false,
      },

      top: 0,

      errorMessages: {
        email: 'Некорректный email',
        phone: 'Некорректный номер',
      },

      sendingRequest: false,
      success: false,
      fail: false,
    }
  },

  computed: {
    ...mapFields(['email', 'phone']),
    ...mapState({
      isOpened: 'isModalOpened',
      data: 'modalData',
    }),

    tabs() {
      return [
        {
          tab: 'description',
          name: 'О занятии',
          content: this.data.description,
        },
        {
          tab: 'teacher',
          name: 'О преподавателе',
          content: this.data.teacher && this.data.teacher.bio,
        },
        {
          tab: 'photo',
          name: 'Фото',
          content: this.data.photo,
        },
        {
          tab: 'video',
          name: 'Видео',
          content: this.data.video,
        },
      ].filter(tab => tab.content)
    },

    initialTab() {
      return this.tabs.length ? this.tabs[0].tab : null
    },

    formMetaData() {
      return {
        lessonId: this.data.id,
        regSourceId: 2, // поменять TODO
      }
    },

    isNameActive() {
      return Boolean(this.enrollForm.name || this.enrollFormFocus.name)
    },

    isEmailActive() {
      return Boolean(this.enrollForm.email || this.enrollFormFocus.email)
    },

    isPhoneActive() {
      return Boolean(this.enrollForm.phone || this.enrollFormFocus.phone)
    },

    isFormValid() {
      return this.enrollForm.name
      && (this.phone.changed || this.phone.valid)
      && (!this.email.changed || this.email.valid)
    },

    enrollFormNormalized() {
      const { name, email } = this.enrollForm

      let phoneCleaned = this.enrollForm.phone.replace(/\D/g, '')
      const len = phoneCleaned.length

      if (len > 10) {
        phoneCleaned = phoneCleaned.slice(-10)
      }

      phoneCleaned = `+7${phoneCleaned}`

      return { name, email, phone: phoneCleaned }
      // Возможно, не пригодится никогда
      // const parts = phoneCleaned.match(/(\d{3})(\d{3})(\d{2})(\d{2})/)
      // const phoneMasked = `+7 (${parts[1]}) ${parts[2]}-${parts[3]}-${parts[4]}`

      // return phoneMasked
    },
  },

  mounted() {
    this.$frame.onMessage('viewport-iframe-position', message => this.repositeModal(message))

    this.$validator.extend('phone', (phone) => {
      if (!phone.match(/^[\d+\-() ]{10,18}$/)) return false

      const phoneCleaned = phone.replace(/\D/g, '')

      const len = phoneCleaned.length
      if (len > 12 || len < 10) return false

      return true
    })
  },

  methods: {
    ...mapMutations(['setModalStatus']),

    closeModal() {
      this.setModalStatus({ isOpened: false })
      this.isFormOpened = false
    },

    showForm() {
      this.isFormOpened = true
    },

    isCurrentTab(tab) {
      return (this.currentTab || this.initialTab) === tab
    },

    sendEnrollRequest() {
      this.sendingRequest = true

      const form = new FormData()

      const data = Object.entries({ ...this.formMetaData, ...this.enrollFormNormalized })

      data.forEach(bite => form.append(...bite))

      fetch(
        'https://jsonplaceholder.typicode.com/todos',
        // 'https://db2.gekkon-club.ru/api/add-lead',
        { method: 'POST', body: form },
      ).then((resp) => {
        if (resp.ok) {
          this.success = true
          setTimeout(() => { this.success = false }, 10000)
        } else {
          this.fail = true
          setTimeout(() => { this.fail = false }, 10000)
        }

        this.sendingRequest = false
      })
    },

    isActive(field) {
      return Boolean(this.enrollForm[field] || this.enrollFormFocus[field])
    },

    repositeModal(message) {
      const parsedMessage = parsePositionMessage(message)
      const isMobile = parsedMessage.viewportWidth <= 480
      const margin = isMobile ? 50 : 100
      const top = parsedMessage.top > 0 ? margin : -parsedMessage.top + margin
      if (!this.isOpened) {
        this.top = top
      }
    },

    errorMessage(field) {
      return this[field].changed && this.errors.first(field) && this.errorMessages[field]
    },
  },
}
</script>

<style lang="scss" scoped>
  $themes: (
    'preschoolars': #d52a76,
    'grades1-2': #f4d14e,
    'grades3-4': #95c93a,
    'grades5-11': #7ed4e4,
    'no-age': #14b1cd
  );

  @each $class, $color in $themes {
    .#{$class} {
      &.enroll-modal {
        border-color: $color;
      }
    }
  }

  @mixin rounded-square($side-size) {
    width: $side-size;
    height: $side-size;
    border-radius: 50%;
  }

  $text-color: #454545;
  $background-accent: #ededee;

  .modal-block {
    color: $text-color;
    padding: 10px 40px;
    @media screen and (max-width: 480px) {
      padding: 10px 10px;
    }
  }

  .enroll-modal-box {
    z-index: 10;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    font-family: Ubuntu, sans-serif;
  }

  .enroll-modal {
    padding: 20px 0;
    width: 430px;
    background-color: #fff;
    border-radius: 5px;
    border-left: 20px solid;
    position: absolute;
    margin: 0 auto;
    left: 0;
    right: 0;
    top: 100px;

    @media screen and (max-width: 480px) {
      top: 50px;
      width: 100%;
      border: none;
    }
  }

  .modal-close {
    border: none;
    background-color: transparent;
    top: 20px;
    right: 20px;
    position: absolute;
    cursor: pointer;
    width: 30px;
    height: 30px;
    padding: 5px;

    img {
      width: 100%;
      height: auto;
    }

    @media screen and (max-width: 480px) {
      top: 30px;
    }
  }

  .modal-header {
    display: flex;
    align-items: center;
  }

  .modal-header-cover {
    display: block;
    @include rounded-square(70px);
    object-fit: cover;
  }

  .modal-header-info {
    padding: 0 20px;
  }

  .modal-header-title {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .header-extra-item {
    display: inline-flex;
    align-items: center;
    height: 20px;
    line-height: 20px;
    vertical-align: middle;
    margin-right: 8px;
  }

  .extra-item-icon {

    margin-right: 5px;
  }

  .enroll-switcher {
    border-top: 1px solid #ededed;
    border-bottom: 1px solid #ededed;
  }

  .pre-enroll {
    flex-wrap: wrap;
    align-items: center;
    padding: 10px 20px;
    display: flex;
    justify-content: space-around;
  }

  .event-info {
    @media screen and (max-width: 480px) {
      text-align: center;
      margin-bottom: 10px;
    }
  }

  .show-form {
    height: 40px;
    width: 120px;
    @media screen and (max-width: 480px) {
      width: 220px;
    }
  }

  .modal-enroll {
    display: none;
  }

  .opened-enroll {
    .pre-enroll {
      display: none;
    }

    .modal-enroll {
      display: block;
    }
  }

  .modal-enroll-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    width: 220px;
    padding: 10px 0;
  }

  .enroll-field-wrap {
    width: 100%;
    margin-bottom: 12px;
  }

  .enroll-input {
    outline: none;
    width: 100%;
    height: 40px;
    border-radius: 3px;
    border: 1px solid #7f8285;
  }

  .active {
    .enroll-input {
      border-color: #7281f1;
    }
  }

  .enroll-input-field {
    padding: 9px 20px;
    background-color: transparent;
  }

  .modal-button {
    background: #fc7878;
    border: none;
    color: #ffffff;
    box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.25);
    cursor: pointer;
    width: auto;
    padding: 10px 20px;
    font-size: 1rem;
    position: relative;
  }

  .modal-button.disabled {
    cursor: default;
    background: #ededed;
    color: #7f8285;;
  }

  .modal-button-loader {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }

  .enroll-status {
    text-align: center;
    padding: 20px 0;
  }
  .enroll-success {
    color: #43a200;
  }

  .enroll-fail {
    color: #dc3545;
  }

  .modal-about-tabs {
    display: flex;
    border-bottom: 2px solid $background-accent;
    margin-bottom: 5px;
  }

  .modal-about-tab {
    flex-grow: 1;
    transition: all 0.4s ease;
    padding: 10px;
    font-size: 13px;
    cursor: pointer;
    text-align: center;

    &.disabled {
      display: none;
      cursor: default;
      color: lighten($text-color, 30%);
    }

    @media screen and (max-width: 480px) {
      font-size: 11px;
    }
  }

  .modal-about-tab.current {
    background-color: $background-accent;
  }

  .modal-about-tab-body {
    padding: 10px;
  }

  .modal-teacher {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-teacher-photo {
    @include rounded-square(70px);
    object-fit: cover;
  }

  .modal-teacher-info {
    padding: 0 20px;
  }

  .modal-teacher-heading {
    line-height: 1.2;
  }

  .modal-teacher-name {
    font-size: 18px;
  }
</style>
