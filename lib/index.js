const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const request = require('request');
const schools = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/schools.min.json')));

const find = (address, schoolName) => {
  for (let i = 0, len = schools.length; i < len; i++) {
    const school = schools[i];
    if (school.address.search(address) >= 0 && school.name.search(schoolName) >= 0) {
      return school;
    }
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
            for (const i in children) {
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
exports.neis = neis;
