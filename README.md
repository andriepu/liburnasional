# Liburnasional 
> Indonesian public holidays checker

## Installation
**Node**
```
$ npm install --save liburnasional 
```
**Browser**
```
<script src="https://unpkg.com/liburnasional@1.0.0/dist/liburnasional.min.js"></script>
```

## Usage 
```
const libur = require('liburnasional');

(async () => {
  await libur.initialize(2018); // initialize the data by year

  const today = new Date();
  const newYear = new Date('Sun, 31 Dec 2017 17:00:00 GMT');

  console.log(libur.getEvent(today.toUTCString()); // -> Weekend
  console.log(libur.isHoliday(today.toUTCString()); // -> true
  
  console.log(libur.getEvent(newYear.toUTCString()); // -> Tahun Baru Masehi
  console.log(libur.isHoliday(newYear.toUTCString()); // -> true
})();
```

## API
### initialize(year: `number`)
Initialize the holidays data by year from datasource via xhr request.

```
libur.initialize(2018);
```
calling `.initialize` without parameter will make it initialized with current year data.

### getEvent(UTCString: `string`)
Get holiday event by date.

```
libur.getEvent(new Date().toUTCString());
// -> { event: ..... }
```
You have to pass UTC string format to make it run consistently in different client time zones.

### isHoliday(UTCString: `string`)
Checking whether a date is a holiday or not. Weekends are counted.
```
libur.isHoliday(new Date().toUTCString());
// -> true / false
```

## Test
```
$ yarn test
```

## Datasource
[https://publicholidays.co.id/id](https://publicholidays.co.id/id)
