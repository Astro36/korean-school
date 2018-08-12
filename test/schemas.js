/* KoreanSchool
Copyright (C) 2018  Seungjae Park

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

const createNullableSchema = type => ({ oneOf: [type, { type: 'null' }] });

const nullableStringSchema = createNullableSchema({ type: 'string' });
const comciganDataSchema = {
  type: 'object',
  properties: {
    교사수: 'number',
    성명: {
      type: 'array',
      items: { type: 'string' },
    },
    학급수: {
      type: 'array',
      items: { type: 'number' },
    },
    요일별시수: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'number' },
      },
    },
    긴과목명: {
      type: 'array',
      items: { type: 'string' },
    },
    과목명: {
      type: 'array',
      items: { type: 'string' },
    },
    시간표: {
      type: 'array',
      items: { type: 'array' },
    },
    전일제: {
      type: 'array',
      items: { type: 'number' },
    },
    버젼: { type: 'string' },
    동시수업수: { type: 'number' },
    담임: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'number' },
      },
    },
    가상학급수: {
      type: 'array',
      items: { type: 'number' },
    },
    특별실수: { type: 'number' },
    열람제한일: { type: 'string' },
    저장일: { type: 'string' },
    학기시작일자: { type: 'string' },
    학교명: { type: 'string' },
    지역명: { type: 'string' },
    학년도: { type: 'number' },
    복수교사: {
      type: 'array',
      items: { type: 'string' },
    },
    시작일: { type: 'string' },
    일과시간: {
      type: 'array',
      items: { type: 'string' },
    },
    일자자료: {
      type: 'array',
      items: {
        type: 'array',
        items: [
          { type: 'number' },
          { type: 'string' },
        ],
      },
    },
    오늘r: { type: 'number' },
    학급시간표: {
      type: 'array',
      items: { type: 'array' },
    },
    교사시간표: {
      type: 'array',
      items: { type: 'array' },
    },
  },
  required: ['교사수', '성명', '학급수', '요일별시수', '긴과목명', '과목명', '시간표', '전일제', '버젼', '동시수업수', '담임', '가상학급수', '특별실수', '열람제한일', '저장일', '학기시작일자', '학교명', '지역명', '학년도', '복수교사', '시작일', '일과시간', '일자자료', '오늘r', '학급시간표', '교사시간표'],
};
const schoolDataSchema = {
  type: 'object',
  properties: {
    code: 'string',
    office: 'string',
    officeDomain: 'string',
    name: 'string',
  },
  required: ['code', 'office', 'officeDomain', 'name'],
};
const schoolDataArraySchema = {
  type: 'array',
  items: schoolDataSchema,
};
const schoolInformationSchema = {
  type: 'object',
  properties: {
    address: nullableStringSchema,
    area: nullableStringSchema,
    class: nullableStringSchema,
    office: nullableStringSchema,
    phone: nullableStringSchema,
    fax: nullableStringSchema,
    establishmentDate: nullableStringSchema,
    establishmentType: nullableStringSchema,
    schoolAnniversary: nullableStringSchema,
    schoolType: nullableStringSchema,
    site: nullableStringSchema,
  },
  required: ['address', 'area', 'class', 'office', 'phone', 'fax', 'establishmentDate', 'establishmentType', 'schoolAnniversary', 'schoolType', 'site'],
};
const schoolMealSchema = {
  type: 'object',
  properties: {
    breakfast: nullableStringSchema,
    lunch: nullableStringSchema,
    dinner: nullableStringSchema,
  },
  required: ['breakfast', 'lunch', 'dinner'],
};
const schoolMealArraySchema = {
  type: 'array',
  items: createNullableSchema(schoolMealSchema),
};
const schoolScheduleSchema = {
  type: 'array',
  items: createNullableSchema({
    type: 'object',
    properties: {
      subject: nullableStringSchema,
      subjectOriginal: nullableStringSchema,
      teacher: nullableStringSchema,
      isChanged: 'boolean',
    },
    required: ['subject', 'subjectOriginal', 'teacher', 'isChanged'],
  }),
};
const schoolScheduleArraySchema = {
  type: 'array',
  items: createNullableSchema(schoolScheduleSchema),
};
const schoolTeachersSchema = {
  type: 'array',
  items: {
    type: 'string',
  },
};
const schoolTeacherScheduleSchema = {
  type: 'array',
  items: createNullableSchema({
    type: 'object',
    properties: {
      grade: 'number',
      room: 'number',
      subject: nullableStringSchema,
      subjectOriginal: nullableStringSchema,
      isChanged: 'boolean',
    },
    required: ['grade', 'room', 'subject', 'subjectOriginal', 'isChanged'],
  }),
};
const schoolTeacherScheduleArraySchema = {
  type: 'array',
  items: createNullableSchema(schoolTeacherScheduleSchema),
};

exports.createNullableSchema = createNullableSchema;
exports.nullableStringSchema = nullableStringSchema;
exports.comciganDataSchema = comciganDataSchema;
exports.schoolDataArraySchema = schoolDataArraySchema;
exports.schoolDataSchema = schoolDataSchema;
exports.schoolInformationSchema = schoolInformationSchema;
exports.schoolMealArraySchema = schoolMealArraySchema;
exports.schoolMealSchema = schoolMealSchema;
exports.schoolScheduleArraySchema = schoolScheduleArraySchema;
exports.schoolScheduleSchema = schoolScheduleSchema;
exports.schoolTeachersSchema = schoolTeachersSchema;
exports.schoolTeacherScheduleSchema = schoolTeacherScheduleSchema;
exports.schoolTeacherScheduleArraySchema = schoolTeacherScheduleArraySchema;
