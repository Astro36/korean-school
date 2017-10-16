# Changelog

## v0.4.0

Released Oct 16, 2017

### Added

- Add [.getSummary(school, callback)](#schoolschoolinfogetsummaryschool-callback) method.

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
