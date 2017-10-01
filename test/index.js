const expect = require('chai').expect;
const school = require('../lib');

describe('school', () => {
  describe('#find', () => {
    context('when not present', () => {
      it('should return null', () => expect(school.find('해리포터', '호그와트')).to.be.null);
    });
    context('when present', () => {
      it('should return the RealmObject where the element first appears in the RealmResults', () => expect(school.find('고양시', '백석고').name).to.have.string('백석고'));
    });
  });
});
