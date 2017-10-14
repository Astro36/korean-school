const { expect } = require('chai');
const school = require('../lib');

describe('school', () => {
  describe('.find(office, schoolName)', () => {
    context('when not present', () => {
      it('should return null', () => expect(school.find('해리포터', '호그와트')).to.be.null);
    });
    context('when present', () => {
      it('should return the school which is best match in the DB', () => expect(school.find('경기도', '백석고').name).to.have.string('백석고'));
    });
  });

  describe('.findAll(office, schoolName)', () => {
    context('when not present', () => {
      it('should return null', () => expect(school.find('해리포터', '호그와트')).to.be.null);
    });
    context('when present', () => {
      it('should return the schools as an array in the DB', () => expect(school.findAll('경기도', '고등학교')).to.be.a('array'));
    });
  });

  describe('.neis', () => {
    const schoolData = school.find('경기도', '백석고');
    const now = new Date();

    describe('.getMeals(school, date, callback)', () => {
      context('when present', () => {
        it('should return the meal info as an array', (done) => {
          school.neis.getMeals(schoolData, now, (content) => {
            expect(content).to.be.a('array');
            done();
          });
        });
      });
    });

    describe('.getMeal(school, date, callback)', () => {
      context('when present', () => {
        it('should return the meal info as an object', (done) => {
          school.neis.getMeal(schoolData, now, (content) => {
            expect(content).to.be.a('object');
            done();
          });
        });
      });
    });
  });
});
