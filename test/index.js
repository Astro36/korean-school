const { expect } = require('chai');
const school = require('../lib');

describe('school', () => {
  const schoolData = school.find('경기도', '백석고');
  const now = new Date();

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

  describe('.getInformation(school, callback)', () => {
    context('when present', () => {
      it('should return the school info as an object', (done) => {
        school.getInformation(schoolData, (content) => {
          expect(content).to.be.a('object');
          done();
        });
      });
    });
  });

  describe('.getMeal(school, date, callback)', () => {
    context('when present', () => {
      it('should return the school daily meal info as an object', (done) => {
        school.getMeal(schoolData, now, (content) => {
          expect(content).to.be.a('object');
          done();
        });
      });
    });
  });

  describe('.getMeals(school, date, callback)', () => {
    context('when present', () => {
      it('should return the school monthly meal info as an array', (done) => {
        school.getMeals(schoolData, now, (content) => {
          expect(content).to.be.a('array');
          done();
        });
      });
    });
  });

  describe('.getSchedule(school, grade, room, date, callback)', () => {
    context('when present', () => {
      it('should return the school daily schedule as an array', (done) => {
        school.getSchedule(schoolData, 1, 1, now, (content) => {
          expect(content).to.be.a('array');console.log(content)
          done();
        });
      });
    });
  });

  describe('.getSchedules(school, grade, room, callback)', () => {
    context('when present', () => {
      it('should return the school weekly schedules as an array', (done) => {
        school.getSchedules(schoolData, 1, 1, (content) => {
          expect(content).to.be.a('array');
          done();
        });
      });
    });
  });
});
