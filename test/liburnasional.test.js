const chai = require('chai');
const random = require('lodash.random');

const { INDO_OFFSET_GMT } = require('../src/constants');
const LiburNasional = require('../src/liburnasional');

chai.should();

const liburNasional = new LiburNasional();

describe('#Liburan', () => {
  before(async () => {
    await liburNasional.initialize();
  });

  it('should be able to crawl data', () => {
    Object.keys(liburNasional.$holidays).length.should.to.be.above(0);
  });

  it('should be able to validate some commons national holiday', () => {
    const currentYear = (new Date()).getFullYear();

    const ISOFormat = `${currentYear}-05-31T17:00:00.000Z`; // Hari Lahir Pancasila
    const randomTime = (() => {
      const t = new Date(`${currentYear}-12-24T17:00:00.000Z`); // Natal
      t.setHours(
        (-t.getTimezoneOffset() / 60) - INDO_OFFSET_GMT + random(23),
        random(59),
        random(59),
        0,
      );
      return t.toISOString();
    })();

    liburNasional.isHoliday(ISOFormat).should.be.true;
    liburNasional.isHoliday(randomTime).should.be.true;
  });

  it('should be able to validate weekends', () => {
    const saturday = '2018-01-05T17:00:00.000Z';
    const sunday = '2018-01-06T17:00:00.000Z';

    liburNasional.isHoliday(sunday).should.be.true;
    liburNasional.isHoliday(saturday).should.be.true;
  });

  it('should be able to validate non-holidays', () => {
    const nonHoliday = new Date('2018-01-07T17:00:00.000Z');

    for (let i = 0; i < 5; i += 1) {
      liburNasional.isHoliday(nonHoliday.toISOString()).should.be.false;
      nonHoliday.setHours(2);
    }
  });
});
