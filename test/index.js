const chai = require('chai');

chai.use(require('chai-json-schema'));

const { expect } = chai;
const school = require('../lib');
const {
  createNullableSchema,
  comciganDataSchema,
  schoolDataArraySchema,
  schoolDataSchema,
  schoolInformationSchema,
  schoolMealArraySchema,
  schoolMealSchema,
  schoolScheduleArraySchema,
  schoolScheduleSchema,
  schoolTeachersSchema,
} = require('./schemas');

describe('school', () => {
  const schoolData = school.find('경기도', '백석고');
  const now = new Date();

  describe('.find(office, schoolName)', () => {
    context('when not present', () => {
      it('should return null', () => expect(school.find('해리포터', '호그와트')).to.be.null);
    });
    context('when present', () => {
      it('should return the school data which is best match in the DB with school\'s office and name', () => expect(school.find('경기도', '백석고')).to.be.jsonSchema(schoolDataSchema));
    });
  });

  describe('.findAll(office, schoolName)', () => {
    context('when not present', () => {
      it('should return null', () => expect(school.find('해리포터', '호그와트')).to.be.null);
    });
    context('when present', () => {
      it('should return all matched school data from DB with school\'s office and name.', () => expect(school.findAll('경기도', '고등학교')).to.be.jsonSchema(schoolDataArraySchema));
    });
  });

  describe('.getAll()', () => {
    it('should return all school data from DB', () => expect(school.getAll()).to.be.jsonSchema(schoolDataArraySchema));
  });

  describe('.getComciganData(school)', () => {
    it('should return the school data from Comcigan server', async () => expect(await school.getComciganData(schoolData)).to.be.jsonSchema(createNullableSchema(comciganDataSchema)));
  });

  describe('.getInformation(school)', () => {
    it('should the school information from School Info', async () => expect(await school.getInformation(schoolData)).to.be.jsonSchema(createNullableSchema(schoolInformationSchema)));
  });

  describe('.getMeal(school, date)', () => {
    it('should return the school daily meal', async () => expect(await school.getMeal(schoolData, now)).to.be.jsonSchema(createNullableSchema(schoolMealSchema)));
  });

  describe('.getMeals(school, date)', () => {
    it('should return the school monthly meals', async () => expect(await school.getMeals(schoolData, now)).to.be.jsonSchema(createNullableSchema(schoolMealArraySchema)));
  });

  describe('.getSchedule(school, grade, room, date)', () => {
    it('should return the school daily schedule', async () => expect(await school.getSchedule(schoolData, 1, 1, now)).to.be.jsonSchema(createNullableSchema(schoolScheduleSchema)));
  });

  describe('.getSchedules(school, grade, room)', () => {
    it('should return the school weekly schedule', async () => expect(await school.getSchedules(schoolData, 1, 1)).to.be.jsonSchema(createNullableSchema(schoolScheduleArraySchema)));
  });

  describe('.getTeachers(school)', () => {
    it('should return the school teachers', async () => expect(await school.getTeachers(schoolData)).to.be.jsonSchema(createNullableSchema(schoolTeachersSchema)));
  });
});
