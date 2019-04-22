import Vuex from 'vuex'
import Vue from 'vue'

import {
  get,
  keys,
  isEqual,
  at,
  inRange,
  values,
  some
} from 'lodash-es'

import {
  isSameDay,
  startOfWeek,
  endOfWeek,
  eachDay,
  addWeeks,
  subWeeks,
  format,
  getISODay
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
    address: ['room', 'affiliate_id']
  },

  agePaths: {
    minAge: ['baseLesson', 'minAge'],
    maxAge: ['baseLesson', 'maxAge'],
    minClass: ['baseLesson', 'minClass'],
    maxClass: ['baseLesson', 'maxClass']
  },

  ageSelections: [
    {
      title: 'Дошкольники',
      value: {
        minAge: 0,
        maxAge: 7
      }
    },
    {
      title: '1-2 класс',
      value: {
        minClass: 1,
        maxClass: 2
      }
    },
    {
      title: '3-4 класс',
      value: {
        minClass: 3,
        maxClass: 4
      }
    },
    {
      title: '5-11 класс',
      value: {
        minClass: 5,
        maxClass: 11
      }
    }
  ],

  titles: {
    address: {
      1: 'ул. Академика Анохина, 4к1',
      2: 'ул. Кременчугская, 13',
      3: 'ул. Олимпийская деревня, 23к1',
      4: 'ул. Народного ополчения, 9к5',
      5: 'Ленинский пр-т, 2к4, МИСиС КБ 17',
      6: 'ул. Мосфильмовская, 88к5'
    }
  },

  filters: {
    age: [],
    teacher: [],
    type: [],
    direction: [],
    address: []
  }
}

export const mutations = {
  setLessons: (state, lessons) => {
    state.lessons = lessons
  },

  setWeekToNext: state => {
    state.currentWeekStartDay = addWeeks(state.currentWeekStartDay, 1)
  },

  setWeekToPrevious: state => {
    state.currentWeekStartDay = subWeeks(state.currentWeekStartDay, 1)
  },

  setWeekToCurrent: state => {
    state.currentWeekStartDay = startOfWeek(new Date(), { weekStartsOn: 1 })
    state.soloColumnIndex = getISODay(new Date()) - 1
  },

  updateFilter: (state, { category, selection }) => {
    state.filters[category] = selection
  },

  setSoloColumnIndex: (state, { index }) => {
    state.soloColumnIndex = index
  },

  setLoadedStatus: (state, { isLoaded }) => {
    state.isDataLoaded = isLoaded
  },

  setModalStatus: (state, { isOpened }) => {
    state.isModalOpened = isOpened
  },

  setModalData: (state, { data }) => {
    state.modalData = data
  }
}

export const getters = {
  availableSelections: state => {
    let selections = {}

    selections.teacher = availableValues(
      state.lessons,
      state.paths.teacher
    ).map(value => ({ value, title: value }))

    selections.direction = availableValues(
      state.lessons,
      state.paths.direction
    ).map(value => ({ value, title: value }))

    selections.type = availableValues(state.lessons, state.paths.type).map(
      value => ({ value, title: value })
    )

    selections.address = availableValues(
      state.lessons,
      state.paths.address
    ).map(value => ({ value, title: state.titles.address[value] }))

    selections.age = state.ageSelections

    return selections
  },

  selectors: (state, getters) => {
    const selections = getters.availableSelections

    return [
      {
        name: 'Преподаватель',
        selections: selections.teacher,
        category: 'teacher'
      },
      {
        name: 'Адрес',
        selections: selections.address,
        category: 'address'
      },
      {
        name: 'Тип занятия',
        selections: selections.type,
        category: 'type'
      },
      {
        name: 'Направление',
        selections: selections.direction,
        category: 'direction'
      },
      {
        name: 'Возраст',
        selections: selections.age,
        category: 'age'
      }
    ]
  },

  currentWeekDays: state => {
    return eachDay(
      state.currentWeekStartDay,
      endOfWeek(state.currentWeekStartDay, { weekStartsOn: 1 })
    )
  },

  currentMonth: state => {
    let weekStartDay = state.currentWeekStartDay
    let weekEndDay = endOfWeek(state.currentWeekStartDay, { weekStartsOn: 1 })

    let startMonth = format(weekStartDay, 'MMMM', { locale: ru })
    let endMonth = format(weekEndDay, 'MMMM', { locale: ru })

    let startYear = weekStartDay.getFullYear()
    let endYear = weekEndDay.getFullYear()

    let isSameMonth = startMonth === endMonth
    let isSameYear = startYear === endYear

    return `
      ${startMonth} ${
      !isSameYear ? startYear : ''
      } ${
      !isSameMonth ? ` - ${endMonth}` : ''
      } ${
      endYear
      }
    `
  },

  lessonsForCurrentWeek: (state, { currentWeekDays }) => {
    return state.lessons.filter(lesson =>
      currentWeekDays.some(date => {
        return isSameDay(date, new Date(lesson.startDate))
      })
    )
  },

  filteredLessons: (state, getters) => {
    let lessons = getters.lessonsForCurrentWeek

    for (const field of Object.keys(state.filters)) {
      if (state.filters[field].length) {
        if (field === 'age') {
          lessons = lessons.filter(lesson => filterByAgeField(lesson, state, field))
        } else {
          lessons = lessons.filter(lesson => filterByField(lesson, state, field))
        }
      }
    }

    return lessons
  }
}

export const actions = {
  async loadDataForWeek({ commit, state }) {
    commit('setLoadedStatus', { isLoaded: false })

    let dateForApi = format(state.currentWeekStartDay, 'DD-MM-YYYY')
    let response = await fetch(`https://db2.gekkon-club.ru/api/calendar?from=${dateForApi}`)

    commit('setLessons', await response.json())
    commit('setLoadedStatus', { isLoaded: true })
  },

  switchToCurrentWeek({ dispatch, commit}) {
    commit('setWeekToCurrent')
    dispatch('loadDataForWeek')
  },

  switchToNextWeek({ dispatch, commit}) {
    commit('setWeekToNext')
    dispatch('loadDataForWeek')
  },

  switchToPreviousWeek({ dispatch, commit}) {
    commit('setWeekToPrevious')
    dispatch('loadDataForWeek')
  }
}

export function availableValues(lessons, path) {
  let values = []
  let value

  for (const lesson of lessons) {
    value = get(lesson, path)
    if (!values.includes(value)) {
      values.push(value)
    }
  }

  return values
}

export function filterByField(lesson, state, field) {
  return state
    .filters[field]
    .map(filter => filter.value)
    .includes(get(lesson, state.paths[field]))
}

export function filterByAgeField(lesson, state, field) {
  let filters = state.filters[field]

  let checkSet = filters.map(filter => {
    let ageFields = keys(filter.value)

    let lessonValues = at(lesson.baseLesson, ageFields).sort()
    if (!some(lessonValues)) return false
    lessonValues[1] = lessonValues[1] + 1
    let filterValues = values(filter.value)


    return inRange(filterValues[0], ...lessonValues) ||
          inRange(filterValues[1], ...lessonValues)
  })

  return some(checkSet)
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
