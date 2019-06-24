/* eslint-disable no-shadow */
import Vuex from 'vuex'
import Vue from 'vue'
import {
  get,
  keys,
  at,
  inRange,
  values,
  some,
} from 'lodash-es'

import {
  isSameDay,
  startOfWeek,
  endOfWeek,
  eachDay,
  addWeeks,
  subWeeks,
  format,
  getISODay,
} from 'date-fns'

import ru from 'date-fns/locale/ru'


Vue.use(Vuex)

export const state = {
  lessons: [],
  isDataLoaded: false,
  soloColumnIndex: getISODay(new Date()) - 1,
  currentWeekStartDay: startOfWeek(new Date(), { weekStartsOn: 1 }),

  isModalOpened: false,
  modalData: {},

  paths: {
    teacher: ['teacher', 'name'],
    direction: ['direction'],
    type: ['textType'],
    address: ['room', 'affiliate_id'],
  },

  agePaths: {
    minAge: ['baseLesson', 'minAge'],
    maxAge: ['baseLesson', 'maxAge'],
    minClass: ['baseLesson', 'minClass'],
    maxClass: ['baseLesson', 'maxClass'],
  },

  ageSelections: [
    {
      title: 'Дошкольники',
      value: {
        minAge: 0,
        maxAge: 7,
      },
    },
    {
      title: '1-2 класс',
      value: {
        minClass: 1,
        maxClass: 2,
      },
    },
    {
      title: '3-4 класс',
      value: {
        minClass: 3,
        maxClass: 4,
      },
    },
    {
      title: '5-11 класс',
      value: {
        minClass: 5,
        maxClass: 11,
      },
    },
  ],

  maps: {
    address: {
      1: 'Ул. Академика Анохина, 4к1',
      2: 'Ул. Кременчугская, 13',
      3: 'Ул. Олимпийская деревня, 23к1',
      4: 'Ул. Народного ополчения, 9к5',
      5: 'Ленинский пр-т, 2к4, МИСиС КБ 17',
      6: 'Ул. Мосфильмовская, 88к5',
    },
  },

  filters: {
    age: [],
    teacher: [],
    type: [],
    direction: [],
    address: [],
  },
}

const setWeekStart = (state, { startDay }) => {
  state.currentWeekStartDay = startDay
}

const setSoloColumnIndex = (state, { index }) => {
  state.soloColumnIndex = index
}

export const mutations = {
  setSoloColumnIndex,
  setWeekStart,

  setLessons: (state, lessons) => {
    state.lessons = lessons
  },

  setWeekToNext: (state) => {
    const startDay = addWeeks(state.currentWeekStartDay, 1)
    setWeekStart(state, { startDay })
  },

  setWeekToPrevious: (state) => {
    const startDay = subWeeks(state.currentWeekStartDay, 1)
    setWeekStart(state, { startDay })
  },

  setWeekToCurrent: (state) => {
    const startDay = startOfWeek(new Date(), { weekStartsOn: 1 })
    const index = getISODay(new Date()) - 1
    setSoloColumnIndex(state, { index })
    setWeekStart(state, { startDay })
  },

  updateFilter: (state, { category, selection }) => {
    state.filters[category] = selection
    state.filters = { ...(state.filters), [category]: selection }
  },

  updateFilters: (state, { filters }) => {
    state.filters = filters
  },


  setLoadedStatus: (state, { isLoaded }) => {
    state.isDataLoaded = isLoaded
  },

  setModalStatus: (state, { isOpened }) => {
    state.isModalOpened = isOpened
  },

  setModalData: (state, { data }) => {
    state.modalData = data
  },
}

export const getters = {
  availableSelections: (state) => {
    const selections = {}

    selections.teacher = availableValues(
      state.lessons,
      state.paths.teacher,
    ).map(value => ({ value, title: value }))

    selections.direction = availableValues(
      state.lessons,
      state.paths.direction,
    ).map(value => ({ value, title: value }))

    selections.type = availableValues(state.lessons, state.paths.type).map(
      value => ({ value, title: value }),
    )

    selections.address = availableValues(
      state.lessons,
      state.paths.address,
    ).map(value => ({ value, title: state.maps.address[value] }))

    selections.age = state.ageSelections

    return selections
  },

  selectors: (state, getters) => {
    const selections = getters.availableSelections

    return [
      {
        name: 'Преподаватель',
        selections: selections.teacher,
        category: 'teacher',
      },
      {
        name: 'Адрес',
        selections: selections.address,
        category: 'address',
      },
      {
        name: 'Тип занятия',
        selections: selections.type,
        category: 'type',
      },
      {
        name: 'Направление',
        selections: selections.direction,
        category: 'direction',
      },
      {
        name: 'Возраст',
        selections: selections.age,
        category: 'age',
      },
    ]
  },

  currentWeekDays: state => eachDay(
    state.currentWeekStartDay,
    endOfWeek(state.currentWeekStartDay, { weekStartsOn: 1 }),
  ),

  currentMonth: (state) => {
    const weekStartDay = state.currentWeekStartDay
    const weekEndDay = endOfWeek(state.currentWeekStartDay, { weekStartsOn: 1 })

    const startMonth = format(weekStartDay, 'MMMM', { locale: ru })
    const endMonth = format(weekEndDay, 'MMMM', { locale: ru })

    const startYear = weekStartDay.getFullYear()
    const endYear = weekEndDay.getFullYear()

    const isSameMonth = startMonth === endMonth
    const isSameYear = startYear === endYear

    /* eslint-disable */
    return `
      ${startMonth} ${
        !isSameYear ? startYear : ''
      } ${
        !isSameMonth ? ` - ${endMonth}` : ''
      } ${
        endYear
      }
    `
    /* eslint enable */
  },

  lessonsForCurrentWeek: (state, { currentWeekDays }) => state
    .lessons
    .filter(lesson => currentWeekDays.some(date => isSameDay(date, new Date(lesson.startDate)))),

  filteredLessons: (state, getters) => {
    let lessons = getters.lessonsForCurrentWeek

    Object.keys(state.filters).forEach((field) => {
      if (state.filters[field].length) {
        if (field === 'age') {
          lessons = lessons.filter(lesson => filterByAgeField(lesson, state, field))
        } else {
          lessons = lessons.filter(lesson => filterByField(lesson, state, field))
        }
      }
    })

    return lessons
  },
}

export const actions = {
  async loadDataForWeek({ commit, state }) {
    commit('setLoadedStatus', { isLoaded: false })

    const dateForApi = format(state.currentWeekStartDay, 'DD-MM-YYYY')
    const response = await fetch(`https://db2.gekkon-club.ru/api/calendar?from=${dateForApi}`)

    commit('setLessons', await response.json())
    commit('setLoadedStatus', { isLoaded: true })
  },

  switchToCurrentWeek({ dispatch, commit }) {
    commit('setWeekToCurrent')
    dispatch('loadDataForWeek')
  },

  switchToNextWeek({ dispatch, commit }) {
    commit('setWeekToNext')
    dispatch('loadDataForWeek')
  },

  switchToPreviousWeek({ dispatch, commit }) {
    commit('setWeekToPrevious')
    dispatch('loadDataForWeek')
  },
}

export function availableValues(lessons, path) {
  const values = []
  let value

  lessons.forEach((lesson) => {
    value = get(lesson, path)
    if (!values.includes(value)) {
      values.push(value)
    }
  })

  return values
}

export function filterByField(lesson, state, field) {
  return state
    .filters[field]
    .map(filter => filter.value)
    .includes(get(lesson, state.paths[field]))
}

export function filterByAgeField(lesson, state, field) {
  const filters = state.filters[field]

  const checkSet = filters.map((filter) => {
    const ageFields = keys(filter.value)

    const lessonValues = at(lesson.baseLesson, ageFields).sort()
    if (!some(lessonValues)) return false
    lessonValues[1] += 1
    const filterValues = values(filter.value)


    return inRange(filterValues[0], ...lessonValues)
          || inRange(filterValues[1], ...lessonValues)
  })

  return some(checkSet)
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
})
