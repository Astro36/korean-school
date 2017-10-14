const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const request = require('request');

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

const neis = {
  getMeals(school, date, callback) {
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
        const meals = [];
        const $ = cheerio.load(body);
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
  },
  getMeal(school, date, callback) {
    neis.getMeals(school, date, (meals) => {
      callback(meals[date.getDate() - 1]);
    });
  },
};

exports.find = find;
exports.findAll = findAll;
exports.neis = neis;
