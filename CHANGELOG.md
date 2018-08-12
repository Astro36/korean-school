# Changelog

## v0.8.5

Released Aug 12, 2018

### Fixed

- Fix `school.getComciganData` and `school.getInformation` method requesting URL.

## v0.8.4

Released Apr 27, 2018

### Fixed

- Fix cache object bug.

## v0.8.3

Released Apr 27, 2018

### Fixed

- Fix Comcigan crawler bug.
- Fix School Info crawler bug.

### Removed

- Remove Comcigan school id file.

## v0.8.2

Released Apr 12, 2018

### Changed

- Expand lifetime of Comcigan data fetching method cache: 10sec -> 5min

### Fixed

- Fix a created bug by changing Comcigan URL.

## v0.8.1

Released Apr 10, 2018

### Fixed

- Fix a created bug by changing Comcigan URL: `./_hourdat` -> `./_hourdata`

## v0.8.0

Released Apr 3, 2018

### Added

- Now support fetching Korea Digital Media High School meal information.

## v0.7.3

Released Mar 12, 2018

### Fixed

- Fix Neis crawling dinner information bug.
- Fix School Info crawler bug.

## v0.7.2

Released Mar 9, 2018

### Fixed

- Fix Neis crawling bug caused by the changed site API.

## v0.7.1

Released Dec 15, 2017

### Fixed

- Fix [.getMeal(school, date)](http://astro36.me/KoreanSchool/global.html#getMeal) and [.getMeals(school, date)](http://astro36.me/KoreanSchool/global.html#getMeals) method bug.
- Fix [.getTeacherSchedule(school, teacher, date)](http://astro36.me/KoreanSchool/global.html#getTeacherSchedule) schema bug.

### Removed

- Remove `cheerio` module from the dependencies.

## v0.7.0

Released Nov 25, 2017

### Added

- Add [.getTeacherSchedule(school, teacher, date)](http://astro36.me/KoreanSchool/global.html#getTeacherSchedule) and [.getTeacherSchedules(school, teacher)](http://astro36.me/KoreanSchool/global.html#getTeacherSchedules) method.

### Fixed

- Fix [.getComciganData(school)](http://astro36.me/KoreanSchool/global.html#getComciganData) cache copy bug.

## v0.6.1

Released Nov 23, 2017

### Fixed

- Fix test code schema bug.

### Removed

- Remove duplicate elements on DB.

## v0.6.0

Released Nov 18, 2017

### Added

- Add [.getAll()](http://astro36.me/KoreanSchool/global.html#getAll), [.getComciganData(school)](http://astro36.me/KoreanSchool/global.html#getComciganData), and [.getTeachers(school)](http://astro36.me/KoreanSchool/global.html#getTeachers) method.
- Add `subjectOriginal` property on schedule object.

### Changed

- All callback functions were changed to async functions.

## v0.5.1

Released Nov 16, 2017

### Added

- Add `isChanged` property on schedule object.

## v0.5.0

Released Oct 21, 2017

### Added

- Add Comcigan school id data on DB.
- Add [school.getSchedule(school, grade, room, date, callback)](./API.md#schoolgetscheduleschool-grade-room-date-callback) and [school.getSchedules(school, grade, room, callback)](./API.md#schoolgetschedulesschool-grade-room-callback) methods.

### Changed

- **Lots of methods were changed.** See [API](./API.md) for more information.

## v0.4.0

Released Oct 16, 2017

### Added

- Add [.getSummary(school, callback)](./API.md#schoolschoolinfogetsummaryschool-callback) method.

## v0.3.1

Released Oct 14, 2017

## Changed

- Improve school data search algorithm.

## v0.3.0

Released Oct 7, 2017

### Added

- Add elementary schools and middle schools data on DB.

### Changed

- Change the parameter of [school.find(office, schoolName)](./API.md#schoolfindoffice-schoolname) method and [school.findAll(office, schoolName)](./API.md#schoolfindalloffice-schoolname) method; `address` -> `office`

### Removed

- Remove the unused school data on DB; `nameShort`, `zipCode`, `address`, `phone`, and `details`

## v0.2.0

Released Oct 4, 2017

### Added

- Add [school.findAll(address, schoolName)](./API.md#schoolfindalladdress-schoolname) method.

## v0.1.0

Released Oct 3, 2017

First Release
