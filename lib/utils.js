/* KoreanSchool
Copyright (C) 2018  Astro

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

const request = require('request');

/**
 * Fetching Korea Digital Media High School information class
 * @class
 */
class Dimigo {
  /**
   * Returns Korea Digital Media High School daily meals.
   * @async
   * @static
   * @function
   * @param {Date} date
   * @returns {?SchoolMeal}
   */
  static getMeal(date) {
    return new Promise((resolve) => {
      request.get({
        url: `https://api.dimigo.in/dimibobs/${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      }, (err, httpResponse, body) => {
        if (err) {
          resolve(null);
        } else {
          const fmt = str => (str || '').split('/').join('\n') || null;
          const content = JSON.parse(body);
          const meal = {
            breakfast: fmt(content.breakfast),
            lunch: fmt(content.lunch),
            dinner: fmt(content.dinner),
          };
          resolve(meal);
        }
      });
    });
  }

  /**
   * Returns Korea Digital Media High School monthly meals.
   * @async
   * @static
   * @function
   * @param {Date} date
   * @returns {?Array.<SchoolMeal>}
   */
  static getMeals(date) {
    const meals = [];
    const month = date.getMonth();
    date.setDate(1);
    for (let i = 1; month === date.getMonth(); i += 1) {
      date.setDate(i);
      meals.push(Dimigo.getMeal(date));
    }
    return Promise.all(meals);
  }
}

module.exports = {
  Dimigo,
};
