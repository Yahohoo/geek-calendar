const shortMonthFormat = new Intl.DateTimeFormat('ru-RU', {
  month: 'short',
});

const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  weekday: 'long',
  year: 'numeric',
});

export default function extractData(apiItem) {
  const { cover } = apiItem;
  const title = extractTitle(apiItem);
  const age = extractAge(apiItem);
  const theme = chooseTheme(apiItem);
  const { id } = apiItem;
  const baseId = apiItem.baseLesson.id;
  const { duration } = apiItem.baseLesson;
  const date = extractDate(apiItem.startDate);
  const { teacher } = apiItem;
  const address = extractAddress(apiItem);
  const aboutData = {
    description: apiItem.description,
    teacher: teacher ? teacher.bio : null,
  };

  return {
    day: date.day,
    weekday: date.weekday,
    month: date.month,
    year: date.year,
    time: date.time,
    shortMonth: date.shortMonth,
    theme,
    cover,
    title,
    age,
    address,
    id,
    baseId,
    duration,
    aboutData,
    teacher,
  };
}

function extractAge(event) {
  let min; let max; let
    type;
  const bl = event.baseLesson;

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
}

function extractTitle(apiItem) {
  const lessonInfo = apiItem.baseLesson;

  return lessonInfo.name.trim()
    .split(' ')
    .slice(1, -1)
    .join(' ');
}

function chooseTheme(apiItem) {
  let theme;
  const lesson = apiItem.baseLesson;

  if (lesson.minClass === null && lesson.minAge === null) {
    theme = 'no-age';
  } else if (lesson.minAge && !(lesson.minClass)) {
    theme = 'preschoolars';
  } else if (lesson.minClass <= 2) {
    theme = 'grades1-2';
  } else if (lesson.minClass <= 4) {
    theme = 'grades3-4';
  } else {
    theme = 'grades5-11';
  }

  return theme;
}

function extractDate(date) {
  date = new Date(date);
  const dateParts = dateFormat.formatToParts(date);
  const shortMonth = shortMonthFormat.format(date);

  const dateObject = {};

  for (const part of dateParts) {
    if (part.type !== 'literal') {
      dateObject[part.type] = part.value;
    }
  }

  dateObject.time = `${dateObject.hour}:${dateObject.minute}`;
  dateObject.shortMonth = shortMonth.slice(0, -1);

  return dateObject;
}

function extractAddress(apiItem) {
  return addresses[apiItem.room.affiliate_id];
}
