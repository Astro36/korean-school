const cheerio = require('cheerio');
const fs = require('fs');
const jsdom = require('jsdom');
const path = require('path');
const request = require('request');

const { JSDOM } = jsdom;

const comcigans = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/comcigan.min.json')));
const schools = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/schools.min.json')));

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
 * @property {?string} teacher
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
 * @private
 * @function
 * @param {SchoolData} school
 * @param {Function} callback
 * @returns {?Object}
 */
const getComciganData = (school, callback) => {
  for (let i = 0, len = comcigans.length; i < len; i += 1) {
    const comcigan = comcigans[i];
    if (comcigan.name === school.name) {
      request.get({
        url: `http://112.186.146.96:4080/_hourdat?sc=${comcigan.code}`,
      }, (err, httpResponse, body) => {
        if (err) {
          callback(null);
        } else {
          const data = JSON.parse(body.split('\n')[0]);
          callback(data);
        }
      });
      return;
    }
  }
  callback(null);
};

/**
 * Returns the school information from School Info.
 * @function
 * @param {SchoolData} school
 * @param {Function} callback
 * @returns {?SchoolInformation}
 */
const getInformation = (school, callback) => {
  request.post({
    url: `http://www.schoolinfo.go.kr/index.jsp?HG_CD=${school.code}`,
    encoding: null,
  }, (err, httpResponse, body) => {
    if (err) {
      callback(null);
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
      callback(data);
    }
  });
};

/**
 * Returns the school monthly meals.
 * @function
 * @param {SchoolData} school
 * @param {Date} date
 * @param {Functio} callback
 * @returns {?Array.<SchoolMeal>}
 */
const getMeals = (school, date, callback) => {
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
      callback(null);
    } else {
      const $ = cheerio.load(body);
      const meals = [];
      $('.tbl_type3 tbody tr td div').each((index, element) => {
        const { children } = element;
        if (children.data !== ' ') {
          const buffer = [];
          for (let i = 0, len = children.length; i < len; i += 1) {
            const child = children[i];
            if (i > 0 && child.type === 'text') {
              buffer.push(child.data);
            }
          }
          const str = buffer.join(' ');
          const breakfast = (str.match(/\[조식\][^[]+(\[?|^)/) || [''])[0].replace('[조식] ', '').replace(' [', '');
          const lunch = (str.match(/\[중식\][^[]+(\[?|^)/) || [''])[0].replace('[중식] ', '').replace(' [', '');
          const dinner = (str.match(/\[석식\][^[]+^/) || [''])[0].replace('[석식] ', '');
          meals[Number(children[0].data) - 1] = {
            breakfast: breakfast || null,
            lunch: lunch || null,
            dinner: dinner || null,
          };
        }
      });
      callback(meals);
    }
  });
};

/**
 * Returns the school daily meal.
 * @function
 * @param {SchoolData} school
 * @param {Date} date
 * @param {Functio} callback
 * @returns {?SchoolMeal}
 */
const getMeal = (school, date, callback) => {
  getMeals(school, date, (meals) => {
    if (meals) {
      callback(meals[date.getDate() - 1]);
    } else {
      callback(null);
    }
  });
};

/**
 * Returns the school weekly schedule.
 * @function
 * @param {SchoolData} school
 * @param {namber} grade
 * @param {namber} room
 * @param {Function} callback
 * @returns {?Array.<SchoolSchedule>}
 */
const getSchedules = (school, grade, room, callback) => {
  getComciganData(school, (data) => {
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
      callback(weeklySchedule);
    } else {
      callback(null);
    }
  });
};

/**
 * Returns the school daily schedule.
 * @function
 * @param {SchoolData} school
 * @param {number} grade
 * @param {number} room
 * @param {Date} date
 * @param {Function} callback
 * @returns {?SchoolSchedule}
 */
const getSchedule = (school, grade, room, date, callback) => {
  getSchedules(school, grade, room, (schedules) => {
    if (schedules) {
      callback(schedules[date.getDay()]);
    } else {
      callback(null);
    }
  });
};

/**
 * Returns the school teachers.
 * @function
 * @param {SchoolData} school
 * @param {Function} callback
 * @returns {?Array.<string>}
 */
const getTeachers = (school, callback) => {
  getComciganData(school, (data) => {
    if (data) {
      callback(data.성명.filter(value => value));
    } else {
      callback(null);
    }
  });
};

exports.find = find;
exports.findAll = findAll;
exports.getInformation = getInformation;
exports.getMeal = getMeal;
exports.getMeals = getMeals;
exports.getSchedule = getSchedule;
exports.getSchedules = getSchedules;
exports.getTeachers = getTeachers;
