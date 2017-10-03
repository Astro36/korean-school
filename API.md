# API

## Table of Contents

- `school`
  - [.find(address, schoolName)](#schoolfindaddress-schoolname)
  - [.findAll(address, schoolName)](#schoolfindalladdress-schoolname)
  - `.neis`
    - [.getMeal(school, date, callback)](#schoolneisgetmealschool-date-callback)
    - [.getMeals(school, date, callback)](#schoolneisgetmealsschool-date-callback)

## KoreanSchool

### school.find(address, schoolName)

- `adress` <[String]> A part of school's address
- `schoolName` <[String]> A part of school's name
- returns: <[Object]|[Null]>
  - `code` <[String]>
  - `office` <[String]>
  - `officeDomain` <[String]>
  - `nameShort` <[String]>
  - `name` <[String]>
  - `zipCode` <[String]>
  - `address` <[String]>
  - `phone` <[String]>
  - `details` <[String]>

This method gets the school data which appears first from DB with school's address and name.

An example of getting the school data:

```javascript
const school = require('korean-school');
school.find('고양시', '백석고');
```

### school.findAll(address, schoolName)

- `adress` <[String]> A part of school's address
- `schoolName` <[String]> A part of school's name
- returns: <[Object]|[Null]>
  - `code` <[String]>
  - `office` <[String]>
  - `officeDomain` <[String]>
  - `nameShort` <[String]>
  - `name` <[String]>
  - `zipCode` <[String]>
  - `address` <[String]>
  - `phone` <[String]>
  - `details` <[String]>

This method gets the all school data from DB with school's address and name.

An example of getting the all school data:

```javascript
const school = require('korean-school');
school.findAll('고양시', '고등학교');
```

### school.neis.getMeal(school, date, callback)

- `school` <[Object]>
  - `code` <[String]> (required)
  - `officeDomain` <[String]> (required)
- `date` <[Date]>
- `callback` <[Function]>
- returns: <[Object]<[String]|[Null]>|[Null]>
  - `breakfast` <[String]|[Null]>
  - `lunch` <[String]|[Null]>
  - `dinner` <[String]|[Null]>

This method fetches the daily school meal.

An example of fetching the daily school meal:

```javascript
const school = require('korean-school');
school.neis.getMeal(school.find('고양시', '백석고'), new Date(), (meal) => {
  if (meal !== null) {
    console.log(meal.breakfast);
    console.log(meal.lunch);
    console.log(meal.dinner);
  }
});
```

### school.neis.getMeals(school, date, callback)

- `school` <[Object]>
  - `code` <[String]> (required)
  - `officeDomain` <[String]> (required)
- `date` <[Date]>
- `callback` <[Function]>
- returns: <[Array]<[Object]<[String]|[Null]>>|[Null]>
  - `breakfast` <[String]|[Null]>
  - `lunch` <[String]|[Null]>
  - `dinner` <[String]|[Null]>

This method fetches the monthly school meals.

An example of fetching the monthly school meals:

```javascript
const school = require('korean-school');
school.neis.getMeals(school.find('고양시', '백석고'), new Date(), (meals) => {
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
school.neis.getMeals(school.find('고양시', '백석고'), new Date(), (meals) => {
  if (meals !== null) {
    meals[14]; // This is 15th day's meal.
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
[String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type "String"
