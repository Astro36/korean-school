# KoreanSchool

> Fetch Korean Schools Data Online

[![npm](https://img.shields.io/npm/v/korean-school.svg?style=flat-square)](https://www.npmjs.com/package/korean-school) [![npm](https://img.shields.io/npm/dt/korean-school.svg?style=flat-square)](https://www.npmjs.com/package/korean-school)

## ChangeLog

See [CHANGELOG](./CHANGELOG.md)

## Features

- Find the school data by its location and name
- Fetch the school information from [School Info](http://www.schoolinfo.go.kr)
- Fetch the school meal from [NEIS](http://www.neis.go.kr)
- Fetch the school schedule from [Comcigan](http://comcigan.co.kr)

## Installation

- Install with npm:

```bash
npm install korean-school --save
```

- Clone the repo:

```bash
git clone https://github.com/Astro36/KoreanSchool.git
```

## Usage

### API Documentation

See [API](http://astro36.me/KoreanSchool/index.html)

### Example

Fetch the school daily meal:

```javascript
const school = require('korean-school');
(async () => {
  const meal = await school.getMeal(school.find('경기도', '백석고'), new Date());
  if (meal !== null) {
    console.log(meal.breakfast);
    console.log(meal.lunch);
    console.log(meal.dinner);
  }
})();
```

## License

```text
KoreanSchool
Copyright (C) 2018  Astro

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
