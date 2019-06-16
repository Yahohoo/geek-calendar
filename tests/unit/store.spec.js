import {
  state, availableValues, getters, actions, mutations,
} from '@/store.js';
import { expect } from 'chai';
import { cloneDeep } from 'lodash-es';

import {
  startOfWeek,
  endOfWeek,
  eachDay,
  addWeeks,
  subWeeks,
} from 'date-fns';

const lessons = [
  {
    id: 23050,
    name: 'Занятие 13',
    room: {
      id: 6,
      name: 'Чебышев',
      affiliate_id: 4,
    },
    branch: 'Геккон - основной',
    textStatus: 'Идёт запись',
    type: 0,
    textType: 'Кружок',
    startDate: '2018-11-30T16:00:00+03:00',
    direction: 'Развитие способностей',
    cover: null,
    description: null,
    baseLesson: {
      id: 1158,
      name: 'Шахматы (начало)',
      duration: 60,
      directionId: 8,
      status: 1,
      minClass: null,
      maxClass: null,
      minAge: null,
      maxAge: null,
    },
    teachersName: ['Кушнерев Олег'],
    teacher: {
      name: 'Кушнерев Олег',
      bio: '',
      avatar: '',
    },
  },
  {
    id: 23647,
    name: 'Занятие 13',
    room: {
      id: 7,
      name: 'Сикорский',
      affiliate_id: 1,
    },
    branch: 'Геккон - основной',
    textStatus: 'Идёт запись',
    type: 1,
    textType: 'Кружок',
    startDate: '2019-04-02T17:00:00+03:00',
    direction: null,
    cover: null,
    description: null,
    baseLesson: {
      id: 1213,
      name: 'Судомоделирование',
      duration: 90,
      directionId: null,
      status: 1,
      minClass: 1,
      maxClass: 4,
      minAge: null,
      maxAge: null,
    },
    teachersName: ['Воробьев Сергей Иванович'],
    teacher: {
      name: 'Воробьев Сергей Иванович',
      bio: '',
      avatar: '',
    },
  },
  {
    id: 21406,
    name: 'Занятие 13',
    room: {
      id: 7,
      name: 'Сикорский',
      affiliate_id: 1,
    },
    branch: 'Геккон - основной',
    textStatus: 'Идёт запись',
    type: 0,
    textType: 'Кружок',
    startDate: '2019-04-05T17:00:00+03:00',
    direction: 'Чанк Инженерное проектирование',
    cover:
      'https://static.tildacdn.com/tild3130-6235-4738-b430-393963393531/3.jpg',
    description: '',
    baseLesson: {
      id: 1084,
      name: 'Инженеры-изобретатели',
      duration: 90,
      directionId: 7,
      status: 1,
      minClass: 1,
      maxClass: 2,
      minAge: null,
      maxAge: null,
    },
    teachersName: ['Ситдикова Камилла'],
    teacher: {
      name: 'Ситдикова Камилла',
      bio: '',
      avatar: '',
    },
  },
  {
    id: 21442,
    name: 'Занятие 13',
    room: {
      id: 8,
      name: 'Леонардо',
      affiliate_id: 3,
    },
    branch: 'Геккон - основной',
    textStatus: 'Идёт запись',
    type: 1,
    textType: 'Кружок',
    startDate: '2019-04-05T17:00:00+03:00',

    direction: 'Развитие способностей',
    cover:
      'https://static.tildacdn.com/tild3562-3466-4636-a132-623131396338/1.jpg',
    description: '',
    baseLesson: {
      id: 1085,
      name: 'Шахматы(продолжающие)',
      duration: 60,
      directionId: 8,
      status: 1,
      minClass: null,
      maxClass: null,
      minAge: null,
      maxAge: null,
    },
    teachersName: ['Кушнерев Олег'],
    teacher: {
      name: 'Кушнерев Олег',
      bio: '',
      avatar: '',
    },
  },
];

state.lessons = lessons;
state.currentWeekStartDay = startOfWeek(new Date('2019-04-05T04:25:59.399Z'), { weekStartsOn: 1 });

const teachers = [
  { value: 'Кушнерев Олег', title: 'Кушнерев Олег' },
  {
    value: 'Воробьев Сергей Иванович',
    title: 'Воробьев Сергей Иванович',
  },
  { value: 'Ситдикова Камилла', title: 'Ситдикова Камилла' },
];

const directions = [
  {
    value: 'Развитие способностей',
    title: 'Развитие способностей',
  },
  { value: null, title: null },
  {
    value: 'Чанк Инженерное проектирование',
    title: 'Чанк Инженерное проектирование',
  },
];

const types = [
  { value: 'Кружок', title: 'Кружок' },
];

const addresses = [
  { value: 4, title: 'ул. Народного ополчения, 9к5' },
  { value: 1, title: 'ул. Академика Анохина, 4к1' },
  { value: 3, title: 'ул. Олимпийская деревня, 23к1' },
];

describe('Мутации хранилища', () => {
  let mutatableState;
  beforeEach(() => (mutatableState = cloneDeep(state)));
});

describe('Геттеры хранилища', () => {
  const selections = {
    direction: directions,
    teacher: teachers,
    type: types,
    address: addresses,
    age: state.ageSelections,
  };
  it('возвращает все доступные варианты выбора для всех категорий', () => {
    const availableSelections = getters.availableSelections(state);

    expect(availableSelections).to.be.eql(selections);
  });

  it('Возвращает конфигурацию для всех селекторов', () => {
    const selectors = [
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
    ];

    const mockGetters = {
      availableSelections: selections,
    };

    expect(getters.selectors(state, mockGetters)).to.eql(selectors);
  });

  it('Возвращает уроки, которые прошли через фильтрацию', () => {
    expect(getters.filteredLessons);
  });
});

describe('Действия хранилища', () => {
  it('заполняет хранилище ', () => { });
});

describe('Извлечение вариантов выбора', () => {
  const fetchers = [
    {
      field: 'имя преподавателя',
      path: state.paths.teacher,
      selections: teachers,
    },
    {
      field: 'направление',
      path: state.paths.direction,
      selections: directions,
    },
    {
      field: 'тип',
      path: state.paths.type,
      selections: types,
    },
    {
      field: 'адрес',
      path: state.paths.address,
      selections: addresses,
    },
  ];

  for (const fetcher of fetchers) {
    it(`получает все уникальные значения поля ${fetcher.field}`, () => {
      const values = availableValues(lessons, fetcher.path);

      expect(values).to.have.members(
        fetcher.selections.map(selection => selection.value),
      );
    });
  }
});
