const axios = require('axios');
const Funcaches = require('funcaches');

const { INDO_OFFSET_GMT } = require('./constants');

const SOURCE_URL = 'https://andriepu.github.io/localize/api/holidays';

const funcaches = new Funcaches();

const getIndoDay = (UTCDate) => {
  const cloned = new Date(UTCDate.toUTCString());
  cloned.setUTCHours(cloned.getUTCHours() + INDO_OFFSET_GMT);
  return cloned.getUTCDay();
};

const $holidays = {};

const crawlDataByYear = year => (
  new Promise((resolve, reject) => {
    axios.get(`${SOURCE_URL}/${year}.json`)
      .then(({ data }) => {
        const holidays = data;
        resolve(holidays);
      }).catch(reject);
  })
);

const populateDataByYear = year => (
  new Promise((resolve, reject) => {
    funcaches.use(`holidays-${year}`, crawlDataByYear.bind(null, year), { ttl: Infinity })
      .then(resolve)
      .catch(reject);
  })
);

exports.initialize = (year = (new Date()).getFullYear()) => (
  new Promise((resolve, reject) => {
    populateDataByYear(year)
      .then((res) => {
        Object.assign($holidays, res);
        resolve();
      }).catch(reject);
  })
);

exports.getEvent = (UTCStr) => {
  const dateUTC = new Date(UTCStr);

  const eventExistKey = Object.keys($holidays).find((u) => {
    const d = new Date(u);
    const diffInDay = (dateUTC.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDay < 1 && diffInDay >= 0;
  });

  if (eventExistKey) {
    return $holidays[eventExistKey];
  }

  if ([0, 6].indexOf(getIndoDay(dateUTC)) !== -1) {
    return { event: 'Weekend' };
  }

  return null;
};

exports.isHoliday = UTCStr => Boolean(exports.getEvent(UTCStr));
