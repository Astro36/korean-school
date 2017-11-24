/* KoreanSchool
Copyright (C) 2017  Astro

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>. */

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
  schoolTeacherScheduleSchema,
  schoolTeacherScheduleArraySchema,
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

  describe('.getTeacherSchedule(school, teacher, date)', () => {
    it('should return the school\'s teacher daily schedule', async () => expect(await school.getTeacherSchedule(schoolData, '김지은', now)).to.be.jsonSchema(createNullableSchema(schoolTeacherScheduleSchema)));
  });

  describe('.getTeacherSchedules(school, teacher)', () => {
    it('should return the school\'s teacher weekly schedule', async () => expect(await school.getTeacherSchedules(schoolData, '김지은')).to.be.jsonSchema(createNullableSchema(schoolTeacherScheduleArraySchema)));
  });
});
