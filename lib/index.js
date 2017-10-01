const Realm = require('realm');
const cheerio = require('cheerio');
const path = require('path');
const request = require('request');

const schoolRealm = new Realm({ path: path.resolve(__dirname, '../data/schools.realm') });

const find = (address, schoolName) => schoolRealm.objects('School').filtered(`address CONTAINS "${address}" AND (name CONTAINS "${schoolName}" OR name_short CONTAINS "${schoolName}")`).slice()[0] || null;

const neis = {
  getMeals(school, date, callback) {
    request.post({
      url: `http://stu.${school.office_domain}.kr/sts_sci_md00_001.do`,
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
            meals[Number(children[0].data)] = {
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
      callback(meals[date.getDate()]);
    });
  },
};

exports.find = find;
exports.neis = neis;
