const chai = require('chai');
const random = require('lodash.random');

const libur = require('../src/liburnasional');

chai.should();

describe('#Liburan', () => {
  let currentYear;

  before(async () => {
    currentYear = (new Date()).getFullYear();
    await libur.initialize();
  });

  it('should be able to validate some commons national holiday', () => {
    for (let i = 0; i < 10; i += 1) {
      const t = new Date(`Mon, 24 Dec ${currentYear} 17:00:00 GMT`); // Natal
      t.setUTCHours(
        t.getUTCHours() + random(23),
        random(59),
        random(59),
        0,
      );

      const randomTime = t.toUTCString();

      libur.isHoliday(randomTime).should.be.true;
    }

    const UTCStart = `Thu, 31 May ${currentYear} 17:00:00 GMT`; // Hari Lahir Pancasila
    const UTCEnd = `Thu, 01 June ${currentYear} 16:59:59 GMT`; // Hari Lahir Pancasila
    libur.isHoliday(UTCStart).should.be.true;
    libur.isHoliday(UTCEnd).should.be.true;
  });

  it('should be able to validate weekends', () => {
    const saturdayStart = `Fri, 05 Jan ${currentYear} 17:00:00 GMT`;
    const saturdayEnd = `Sat, 06 Jan ${currentYear} 16:59:59 GMT`;

    const sundayStart = `Sat, 06 Jan ${currentYear} 17:00:00 GMT`;
    const sundayEnd = `Sun, 07 Jan ${currentYear} 16:59:59 GMT`;

    libur.isHoliday(sundayStart).should.be.true;
    libur.isHoliday(sundayEnd).should.be.true;

    libur.isHoliday(saturdayStart).should.be.true;
    libur.isHoliday(saturdayEnd).should.be.true;
  });

  it('should be able to validate non-holidays', () => {
    const nonHolidayStart = new Date('Sun, 07 Jan 2018 17:00:00 GMT');
    const nonHolidayEnd = new Date('Mon, 08 Jan 2018 16:59:59 GMT');

    for (let i = 0; i < 5; i += 1) {
      libur.isHoliday(nonHolidayStart.toUTCString()).should.be.false;
      libur.isHoliday(nonHolidayEnd.toUTCString()).should.be.false;

      nonHolidayStart.setHours(24);
      nonHolidayEnd.setHours(24);
    }
  });
});
