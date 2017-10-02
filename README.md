# KoreanSchool

> Fetch Korean Schools Data from NEIS

[![npm](https://img.shields.io/npm/v/korean-school.svg?style=flat-square)](https://www.npmjs.com/package/korean-school) [![npm](https://img.shields.io/npm/dt/korean-school.svg?style=flat-square)](https://www.npmjs.com/package/korean-school)

## ChangeLog

See [CHANGELOG](./CHANGELOG.md)

## Feature

- Find the school data by its location and name
- Fetch the school meal from NEIS

## Installation

- Install with npm:

```bash
npm install korean-school -g
```

- Clone the repo:

```bash
git clone https://github.com/Astro36/KoreanSchool.git
```

## Usage

### API

#### school.find(address, schoolName)

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

This method gets the school data from DB with school's address and name.

An example of getting the school data:

```javascript
const school = require('korean-school');
school.find('고양시', '백석고');
```

#### school.neis.getMeal(school, date, callback)

- `school` <[Object]>
  - `code` <[String]>: (required)
  - `officeDomain` <[String]>: (required)
- `date` <[Date]>
- `callback` <[Function]>
- returns: <[Object]<[String]|[Null]>|[Null]>
  - `breakfast` <[String]|[Null]>
  - `lunch` <[String]|[Null]>
  - `dinner` <[String]|[Null]>

This method fecthes the daily school meal.

An example of fecthing the daily school meal:

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

#### school.neis.getMeals(school, date, callback)

- `school` <[Object]>
  - `code` <[String]>: (required)
  - `officeDomain` <[String]>: (required)
- `date` <[Date]>
- `callback` <[Function]>
- returns: <[Array]<[Object]<[String]|[Null]>>|[Null]>
  - `breakfast` <[String]|[Null]>
  - `lunch` <[String]|[Null]>
  - `dinner` <[String]|[Null]>

This method fecthes the monthly school meals.

An example of fecthing the monthly school meals:

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

## License

```text
KoreanSchool
Copyright (C) 2017  Astro

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
```

KoreanSchool is licensed under the [GPL 3.0](./LICENSE).

[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array "Array"
[Boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type "Boolean"
[Date]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date "Date"
[Function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function "Function"
[Null]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type "Null"
[Number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type "Number"
[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object "Object"
[String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type "String"
