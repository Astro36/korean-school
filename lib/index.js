const Realm = require('realm');
const path = require('path');

const schoolRealm = new Realm({ path: path.resolve(__dirname, '../data/schools.realm') });

const find = (address, schoolName) => {
  return schoolRealm.objects('School').filtered(`address CONTAINS "${address}" AND (name CONTAINS "${schoolName}" OR name_short CONTAINS "${schoolName}")`).slice()[0] || null;
};

exports.find = find;
