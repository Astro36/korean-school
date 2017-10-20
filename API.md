# API

## Table of Contents

- `school`
  - [.find(office, schoolName, useAlias = true)](#schoolfindoffice-schoolname-usealias--true)
  - [.findAll(office, schoolName, useAlias = true)](#schoolfindalloffice-schoolname-usealias--true)
  - [.getInformation(school, callback)](#schoolgetinformationschool-callback)
  - [.getMeal(school, date, callback)](#schoolgetmealschool-date-callback)
  - [.getMeals(school, date, callback)](#schoolgetmealsschool-date-callback)
  - [.getSchedule(school, grade, room, date, callback)](#schoolgetscheduleschool-grade-room-date-callback)
  - [.getSchedules(school, grade, room, callback)](#schoolgetschedulesschool-grade-room-callback)

## KoreanSchool

### school.find(office, schoolName, useAlias = true)

- `office` <[String]|[RegExp]> A part of school's office of eduction
- `schoolName` <[String]|[RegExp]> A part of school's name
- `[useAlias=true]` <[Boolean]> Use office and school name alias
- returns: <[Object]|[Null]>
  - `code` <[String]>
  - `office` <[String]>
  - `officeDomain` <[String]>
  - `name` <[String]>

This method gets the school data which is best match in the DB with school's office and name.

An example of getting the school data:

```javascript
const school = require('korean-school');
school.find('경기도', '백석고');
```

### school.findAll(office, schoolName, useAlias = true)

- `office` <[String]|[RegExp]> A part of school's office of eduction
- `schoolName` <[String]|[RegExp]> A part of school's name
- `[useAlias=true]` <[Boolean]> Use office and school name alias
- returns: <[Object]|[Null]>
  - `code` <[String]>
  - `office` <[String]>
  - `officeDomain` <[String]>
  - `name` <[String]>

This method gets the all school data from DB with school's office and name.

An example of getting the all school data:

```javascript
const school = require('korean-school');
school.findAll('경기도', '고등학교');
```

### school.getInformation(school, callback)

- `school` <[Object]>
  - `code` <[String]> (required)
  - `officeDomain` <[String]> (required)
- `callback` <[Function]>
- returns: <[Object]<[String]|[Null]>>
  - `address` <[String]|[Null]>
  - `area` <[String]|[Null]>
  - `class` <[String]|[Null]>
  - `office` <[String]|[Null]>
  - `phone` <[String]|[Null]>
  - `fax` <[String]|[Null]>
  - `establishmentDate` <[String]|[Null]>
  - `establishmentType` <[String]|[Null]>
  - `schoolAnniversary` <[String]|[Null]>
  - `schoolType` <[String]|[Null]>
  - `site` <[String]|[Null]>

This method fetches the school information from [School Info](http://www.schoolinfo.go.kr/).

An example of fetching the school information:

```javascript
const school = require('korean-school');
school.getInformation(school.find('경기도', '백석고'), (data) => {
  if (data !== null) {
    console.log(JSON.stringify(data));
  }
});
```

### school.getMeal(school, date, callback)

- `school` <[Object]>
  - `code` <[String]> (required)
  - `officeDomain` <[String]> (required)
- `date` <[Date]>
- `callback` <[Function]>
- returns: <[Object]<[String]|[Null]>|[Null]>
  - `breakfast` <[String]|[Null]>
  - `lunch` <[String]|[Null]>
  - `dinner` <[String]|[Null]>

This method fetches the school daily meal.

An example of fetching the school daily meal:

```javascript
const school = require('korean-school');
school.getMeal(school.find('경기도', '백석고'), new Date(), (meal) => {
  if (meal !== null) {
    console.log(meal.breakfast);
    console.log(meal.lunch);
    console.log(meal.dinner);
  }
});
```

### school.getMeals(school, date, callback)

- `school` <[Object]>
  - `code` <[String]> (required)
  - `officeDomain` <[String]> (required)
- `date` <[Date]>
- `callback` <[Function]>
- returns: <[Array]<[Object]<[String]|[Null]>>|[Null]>
  - `breakfast` <[String]|[Null]>
  - `lunch` <[String]|[Null]>
  - `dinner` <[String]|[Null]>

This method fetches the school monthly meals.

An example of fetching the school monthly meals:

```javascript
const school = require('korean-school');
school.getMeals(school.find('경기도', '백석고'), new Date(), (meals) => {
  if (meals !== null) {
    for (const meal of meals) {
      console.log(meal.breakfast);
      console.log(meal.lunch);
      console.log(meal.dinner);
    }
  }
});
```

**The array starts with 0!**

If you get 15th day's meals, you need to get the 14th value.

```javascript
const school = require('korean-school');
school.getMeals(school.find('경기도', '백석고'), new Date(), (meals) => {
  if (meals !== null) {
    meals[14]; // This is 15th day's meal.
  }
});
```

### school.getSchedule(school, grade, room, date, callback)

- `school` <[Object]>
  - `code` <[String]> (required)
  - `officeDomain` <[String]> (required)
- `grade` <[Number]>
- `room` <[Number]>
- `date` <[Date]>
- `callback` <[Function]>
- returns: <[Array]<[Object]<[String]|[Null]>|[Null]>>
  - `subject` <[String]|[Null]>
  - `teacher` <[String]|[Null]>

This method fetches the school daily schedule.

An example of fetching the school daily schedule:

```javascript
const school = require('korean-school');
school.getSchedule(school.find('경기도', '백석고'), 1, 1, new Date(), (schedule) => {
  if (schedule !== null) {
    console.log(schedule);
  }
});
```

### school.getSchedules(school, grade, room, callback)

- `school` <[Object]>
  - `code` <[String]> (required)
  - `officeDomain` <[String]> (required)
- `grade` <[Number]>
- `room` <[Number]>
- `callback` <[Function]>
- returns: <[Array]<[Object]<[String]|[Null]>|[Null]>>
  - `subject` <[String]|[Null]>
  - `teacher` <[String]|[Null]>

This method fetches the school weekly schedule.

An example of fetching the school weekly schedule:

```javascript
const school = require('korean-school');
school.getSchedules(school.find('경기도', '백석고'), 1, 1, (schedules) => {
  if (schedules !== null) {
    console.log(schedules);
  }
});
```

[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array "Array"
[Boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type "Boolean"
[Date]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date "Date"
[Function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function "Function"
[Null]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type "Null"
[Number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type "Number"
[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object "Object"
[RegExp]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp "RegExp"
[String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type "String"
