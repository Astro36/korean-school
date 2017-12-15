/* KoreanSchool
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
along with this program.  If not, see <http://www.gnu.org/licenses/>. */

const fs = require('fs');
const jsdom = require('jsdom');
const path = require('path');
const request = require('request');

const { JSDOM } = jsdom;
const getLastLine = buffer => buffer.slice(buffer.lastIndexOf('\n'));

const comcigans = JSON.parse(getLastLine(fs.readFileSync(path.resolve(__dirname, '../data/comcigan.min.json'))));
const schools = JSON.parse(getLastLine(fs.readFileSync(path.resolve(__dirname, '../data/schools.min.json'))));

const alias = {
  office: {
    서울시: '서울특별시',
    부산시: '부산광역시',
    대구시: '대구광역시',
    인천시: '인천광역시',
    광주시: '광주광역시',
    대전시: '대전광역시',
    울산시: '울산광역시',
    세종시: '세종특별자치시',
    세종특별시: '세종특별자치시',
    충북: '충청북도',
    충남: '충청남도',
    전북: '전라북도',
    전남: '전라남도',
    경북: '경상북도',
    경남: '경상남도',
    제주시: '제주특별자치도',
    제주특별시: '제주특별자치도',
  },
};

const cache = {
  comcigan: {},
};

/**
 * @typedef {Object} ComciganData
 * @property {number} 교사수
 * @property {Array.<string>} 성명
 * @property {Array.<number>} 학급수
 * @property {Array.<Array.<number>>} 요일별시수
 * @property {Array.<string>} 긴과목명
 * @property {Array.<string>} 과목명
 * @property {Array.<Array>} 시간표
 * @property {Array.<number>} 전일제
 * @property {string} 버젼
 * @property {number} 동시수업수
 * @property {Array.<Array.<number>>} 담임
 * @property {Array.<number>} 가상학급수
 * @property {number} 특별실수
 * @property {string} 열람제한일
 * @property {string} 저장일
 * @property {string} 학기시작일자
 * @property {string} 학교명
 * @property {string} 지역명
 * @property {number} 학년도
 * @property {Array.<string>} 복수교사
 * @property {string} 시작일
 * @property {Array.<string>} 일과시간
 * @property {Array.<Array.<number|string>>} 일자자료
 * @property {number} 오늘r
 * @property {Array.<Array>} 학급시간표
 * @property {Array.<Array>} 교사시간표
 */

/**
 * @typedef {Object} SchoolData
 * @property {string} code
 * @property {string} office
 * @property {string} officeDomain
 * @property {string} name
 */

/**
 * @typedef {Object} SchoolInformation
 * @property {?string} address
 * @property {?string} area
 * @property {?string} class
 * @property {?string} office
 * @property {?string} phone
 * @property {?string} fax
 * @property {?string} establishmentDate
 * @property {?string} establishmentType
 * @property {?string} schoolAnniversary
 * @property {?string} schoolType
 * @property {?string} site
 */

/**
 * @typedef {Object} SchoolMeal
 * @property {?string} breakfast
 * @property {?string} lunch
 * @property {?string} dinner
 */

/**
 * @typedef {Object} SchoolSchedule
 * @property {?string} subject
 * @property {?string} subjectOriginal
 * @property {?string} teacher
 * @property {boolean} isChanged
 */

/**
 * @typedef {Object} SchoolTeacherSchedule
 * @property {number} grade
 * @property {number} room
 * @property {?string} subject
 * @property {?string} subjectOriginal
 * @property {boolean} isChanged
 */

/**
 * Returns all matched school data from DB with school's office and name.
 * @function
 * @param {string} office
 * @param {string} schoolName
 * @param {string} [useAlias=true]
 * @returns {?Array.<SchoolData>}
 */
const findAll = (office, schoolName, useAlias = true) => {
  const matches = [];
  for (let i = 0, len = schools.length; i < len; i += 1) {
    const school = schools[i];
    let check = false;
    if (typeof office === 'string') {
      if (useAlias) {
        if (office in alias.office) {
          check = school.office.search(alias.office[office]) >= 0;
        } else {
          check = school.office.search(office) >= 0;
        }
      } else {
        check = school.office.search(office) >= 0;
      }
    } else if (typeof office === 'object' && office instanceof RegExp) {
      check = office.test(school.office);
    }
    if (check) {
      if (typeof schoolName === 'string') {
        if (useAlias) {
          check = school.name.replace(/초$/, '초등학교')
            .replace(/중$/, '중학교')
            .replace(/고$/, '고등학교')
            .replace(/여자?중학교/, '여자중학교')
            .replace(/여자?고등학교/, '여자고등학교')
            .search(schoolName) >= 0;
        } else {
          check = school.name.search(schoolName) >= 0;
        }
      } else if (typeof schoolName === 'object' && schoolName instanceof RegExp) {
        check = schoolName.test(school.name);
      }
      if (check) {
        matches.push(school);
      }
    }
  }
  if (matches.length > 0) {
    return matches;
  }
  return null;
};

/**
 * Returns the school data which is best match in the DB with school's office and name.
 * @function
 * @param {string} office
 * @param {string} schoolName
 * @param {string} [useAlias=true]
 * @returns {?SchoolData}
 */
const find = (office, schoolName, useAlias = true) => {
  let schoolNameLength;
  if (useAlias) {
    schoolNameLength = schoolName.replace(/초$/, '초등학교')
      .replace(/중$/, '중학교')
      .replace(/고$/, '고등학교')
      .replace(/여자?중학교/, '여자중학교')
      .replace(/여자?고등학교/, '여자고등학교').length;
  } else {
    schoolNameLength = schoolName.length;
  }
  const schoolData = findAll(office, schoolName, useAlias);
  if (schoolData) {
    return schoolData.reduce((accumulator, currentValue) => {
      if (schoolNameLength / accumulator.length < schoolNameLength / currentValue.length) {
        return currentValue;
      }
      return accumulator;
    });
  }
  return null;
};

/**
 * Returns all school data from DB.
 * @function
 * @returns {Array.<SchoolData>}
 */
const getAll = () => schools;

/**
 * Returns the school data from Comcigan server.
 * @async
 * @function
 * @param {SchoolData} school
 * @returns {?ComciganData}
 */
const getComciganData = school => new Promise((resolve) => {
  for (let i = 0, len = comcigans.length; i < len; i += 1) {
    const comcigan = comcigans[i];
    if (comcigan.name === school.name) {
      const { code } = comcigan;
      if (code in cache.comcigan && cache.comcigan[code].date > Date.now() - 10000) {
        resolve(JSON.parse(cache.comcigan[code].data));
        return;
      }
      request.get({
        url: `http://112.186.146.96:4080/_hourdat?sc=${code}&nal=1&s=0`,
      }, (err, httpResponse, body) => {
        if (err) {
          resolve(null);
        } else {
          const data = body.split('\n')[0];
          cache.comcigan[code] = {
            data,
            date: Date.now(),
          };
          resolve(JSON.parse(data));
        }
      });
      return;
    }
  }
  resolve(null);
});

/**
 * Returns the school information from School Info.
 * @async
 * @function
 * @param {SchoolData} school
 * @returns {?SchoolInformation}
 */
const getInformation = school => new Promise((resolve) => {
  request.post({
    url: `http://www.schoolinfo.go.kr/index.jsp?HG_CD=${school.code}`,
    encoding: null,
  }, (err, httpResponse, body) => {
    if (err) {
      resolve(null);
    } else {
      const { document } = (new JSDOM(body)).window;
      const data = { // default values
        address: null,
        area: document.querySelector('.School_Division .mapD_Area._10').textContent || null,
        class: document.querySelector('.School_Division .mapD_Class._04').textContent || null,
        office: null,
        phone: null,
        fax: null,
        establishmentDate: null,
        establishmentType: null,
        schoolAnniversary: null,
        schoolType: null,
        site: null,
      };
      document.querySelectorAll('.School_Data li').forEach((element) => {
        if (element.textContent.search('학교주소') >= 0) {
          data.address = element.textContent.replace(/^\s*학교주소\s*/, '').replace(/\s*$/, '');
        } else if (element.textContent.search('관할교육청') >= 0) {
          data.office = element.textContent.replace(/^\s*관할교육청\s*/, '').replace(/\s*$/, '');
        } else if (element.textContent.search('전화/팩스') >= 0) {
          const str = element.textContent.replace(/^\s*전화\/팩스\s*/, '').replace(/\s*$/, '');
          if (str.search('전화') >= 0) {
            [, data.phone] = str.match(/전화([0-9-]+)/);
          }
          if (str.search('팩스') >= 0) {
            [, data.fax] = str.match(/팩스([0-9-]+)/);
          }
        } else if (element.textContent.search('설립일') >= 0) {
          data.establishmentDate = element.textContent.replace(/^\s*설립일\s*/, '').replace(/\s*$/, '');
        } else if (element.textContent.search('설립구분') >= 0) {
          data.establishmentType = element.textContent.replace(/^\s*설립구분\s*/, '').replace(/\s*$/, '');
        } else if (element.textContent.search('개교기념일') >= 0) {
          data.schoolAnniversary = element.textContent.replace(/^\s*개교기념일\s*/, '').replace(/\s*$/, '');
        } else if (element.textContent.search('설립유형') >= 0) {
          data.schoolType = element.textContent.replace(/^\s*설립유형\s*/, '').replace(/\s*$/, '');
        } else if (element.textContent.search('홈페이지') >= 0) {
          data.site = element.textContent.replace(/^\s*홈페이지\s*/, '').replace(/\s*$/, '');
        }
      });
      resolve(data);
    }
  });
});

/**
 * Returns the school monthly meals.
 * @async
 * @function
 * @param {SchoolData} school
 * @param {Date} date
 * @returns {?Array.<SchoolMeal>}
 */
const getMeals = (school, date) => new Promise((resolve) => {
  request.post({
    url: `http://stu.${school.officeDomain}.kr/sts_sci_md00_001.do`,
    form: {
      schulCode: school.code,
      schulCrseScCode: 4,
      ay: date.getFullYear(),
      mm: (`0${date.getMonth() + 1}`).substr(-2),
    },
  }, (err, httpResponse, body) => {
    if (err) {
      resolve(null);
    } else {
      const { document } = (new JSDOM(body)).window;
      const meals = [];
      document.querySelectorAll('.tbl_type3 tbody tr td div').forEach((element) => {
        const content = element.innerHTML.split('<br>').join('\n').split('&amp;').join('&');
        if (content.trim()) {
          const breakfast = (content.match(/\[조식\][^[]+(\[?|^)/) || [''])[0].replace(/\[조식\]\s*/, '').replace(/\s*\[/, '');
          const lunch = (content.match(/\[중식\][^[]+(\[?|^)/) || [''])[0].replace(/\[중식\]\s*/, '').replace(/\s*\[/, '');
          const dinner = (content.match(/\[석식\][^[]+^/) || [''])[0].replace(/\[석식\]\s*/, '');
          meals[Number(content.match(/^\d+/)[0]) - 1] = {
            breakfast: breakfast || null,
            lunch: lunch || null,
            dinner: dinner || null,
          };
        }
      });
      resolve(meals);
    }
  });
});

/**
 * Returns the school daily meal.
 * @async
 * @function
 * @param {SchoolData} school
 * @param {Date} date
 * @returns {?SchoolMeal}
 */
const getMeal = (school, date) => new Promise(async (resolve) => {
  const meals = await getMeals(school, date);
  if (meals) {
    resolve(meals[date.getDate() - 1]);
  } else {
    resolve(null);
  }
});

/**
 * Returns the school weekly schedule.
 * @async
 * @function
 * @param {SchoolData} school
 * @param {namber} grade
 * @param {namber} room
 * @returns {?Array.<SchoolSchedule>}
 */
const getSchedules = (school, grade, room) => new Promise(async (resolve) => {
  const data = await getComciganData(school);
  if (data) {
    const weeklySchedule = data.학급시간표[grade][room];
    weeklySchedule[0] = null;
    for (let day = 1; day < 6; day += 1) {
      const schedule = weeklySchedule[day];
      for (let period = 0, len2 = schedule.length; period < len2; period += 1) {
        const subject = schedule[period];
        if (subject > 100) {
          weeklySchedule[day][period] = {
            subject: data.과목명[subject % 100] || null,
            subjectOriginal: data.긴과목명[subject % 100] || null,
            teacher: data.성명[Math.floor(subject / 100)] || null,
            isChanged: subject !== data.시간표[grade][room][day][period],
          };
        } else {
          weeklySchedule[day][period] = null;
        }
      }
      weeklySchedule[day].splice(0, 1);
    }
    weeklySchedule[6] = null;
    resolve(weeklySchedule);
  } else {
    resolve(null);
  }
});

/**
 * Returns the school daily schedule.
 * @async
 * @function
 * @param {SchoolData} school
 * @param {number} grade
 * @param {number} room
 * @param {Date} date
 * @returns {?SchoolSchedule}
 */
const getSchedule = (school, grade, room, date) => new Promise(async (resolve) => {
  const schedules = await getSchedules(school, grade, room);
  if (schedules) {
    resolve(schedules[date.getDay()]);
  } else {
    resolve(null);
  }
});

/**
 * Returns the school teachers.
 * @async
 * @function
 * @param {SchoolData} school
 * @returns {?Array.<string>}
 */
const getTeachers = school => new Promise(async (resolve) => {
  const data = await getComciganData(school);
  if (data) {
    resolve(data.성명.filter(value => value));
  } else {
    resolve(null);
  }
});

/**
 * Returns the school's teacher weekly schedule.
 * @async
 * @function
 * @param {SchoolData} school
 * @param {string} teacher
 * @returns {?Array.<SchoolTeacherSchedule>}
 */
const getTeacherSchedules = (school, teacher) => new Promise(async (resolve) => {
  const data = await getComciganData(school);
  if (data) {
    const teacherIndex = data.성명.indexOf(teacher);
    if (teacherIndex >= 0) {
      const weeklySchedule = data.교사시간표[teacherIndex];
      weeklySchedule[0] = null;
      for (let day = 1; day < 6; day += 1) {
        const schedule = weeklySchedule[day];
        for (let period = 0, len2 = schedule.length; period < len2; period += 1) {
          const teacherData = schedule[period];
          if (teacherData > 100) {
            const tmp = Math.floor(teacherData / 100);
            const grade = Math.floor(tmp / 100);
            const room = tmp % 100;
            const subject = data.시간표[grade][room][day][period] % 100;
            weeklySchedule[day][period] = {
              grade,
              room,
              subject: data.과목명[teacherData % 100] || null,
              subjectOriginal: data.긴과목명[teacherData % 100] || null,
              isChanged: teacherData !== (grade * 10000) + (room * 100) + subject,
            };
          } else {
            weeklySchedule[day][period] = null;
          }
        }
        weeklySchedule[day].splice(0, 1);
      }
      weeklySchedule[6] = null;
      resolve(weeklySchedule);
    } else {
      resolve(null);
    }
  } else {
    resolve(null);
  }
});

/**
 * Returns the school's teacher daily schedule.
 * @async
 * @function
 * @param {SchoolData} school
 * @param {string} teacher
 * @param {Date} date
 * @returns {?SchoolTeacherSchedule}
 */
const getTeacherSchedule = (school, teacher, date) => new Promise(async (resolve) => {
  const schedules = await getTeacherSchedules(school, teacher);
  if (schedules) {
    resolve(schedules[date.getDay()]);
  } else {
    resolve(null);
  }
});

exports.find = find;
exports.findAll = findAll;
exports.getAll = getAll;
exports.getComciganData = getComciganData;
exports.getInformation = getInformation;
exports.getMeal = getMeal;
exports.getMeals = getMeals;
exports.getSchedule = getSchedule;
exports.getSchedules = getSchedules;
exports.getTeachers = getTeachers;
exports.getTeacherSchedule = getTeacherSchedule;
exports.getTeacherSchedules = getTeacherSchedules;
