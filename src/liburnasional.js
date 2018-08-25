const axios = require('axios');
const Funcaches = require('funcaches');

const normalizeIndoTime = require('./helpers/normalizeIndoTime');

const funcaches = new Funcaches();

class Holiday {
  constructor() {
    this.baseURL = 'https://andriepu.github.io/localize-api/holidays';
    this.$holidays = {};
  }

  initialize(year = (new Date()).getFullYear()) {
    return new Promise((resolve, reject) => {
      /* eslint-disable no-console */
      this.populateDataByYear(year)
        .then((res) => {
          this.$holidays = Object.assign(this.$holidays, res);
          resolve();
        }).catch(reject);
      /* eslint-enable no-console */
    });
  }

  populateDataByYear(year) {
    return new Promise((resolve, reject) => {
      funcaches.use('holidays', this.crawlDataByYear.bind(this, year), { ttl: Infinity })
        .then(resolve)
        .catch(reject);
    });
  }

  crawlDataByYear(year) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-console
      axios.get(`${this.baseURL}/${year}.json`)
        .then(({ data }) => {
          const holidays = data;
          resolve(holidays);
        }).catch(reject);
    });
  }

  isHoliday(ISODate) {
    const date = normalizeIndoTime(new Date(ISODate));

    return [0, 6].indexOf(date.getDay()) !== -1
      || Boolean(this.$holidays[date.toISOString()]);
  }
}

module.exports = Holiday;
