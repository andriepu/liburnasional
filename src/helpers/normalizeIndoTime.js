const { INDO_OFFSET_GMT } = require('../constants');

module.exports = (date) => {
  const diffHoursGMT = (-date.getTimezoneOffset() / 60) - INDO_OFFSET_GMT;
  date.setHours(diffHoursGMT, 0, 0, 0);
  return date;
};
