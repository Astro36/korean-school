const Realm = require('realm');
const fs = require('fs');
const path = require('path');

const schools = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'schools.min.json')));

const SchoolSchema = {
  name: 'School',
  properties: {
    code: 'string',
    office: 'string',
    office_domain: 'string',
    name_short: 'string',
    name: 'string',
    zip_code: 'string',
    address: 'string',
    phone: 'string',
    details: 'string',
  },
};

Realm.open({ path: path.resolve(__dirname, 'schools.realm'), schema: [SchoolSchema] })
  .then((realm) => {
    realm.write(() => {
      for (const i in schools) {
        const school = schools[i];
        realm.create('School', {
          code: school.code,
          office: school.office,
          office_domain: school.officeDomain,
          name_short: school.nameShort,
          name: school.name,
          zip_code: school.zipCode,
          address: school.address,
          phone: school.phone,
          details: school.details,
        });
      }
    });
  });
