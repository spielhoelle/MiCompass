'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((t: any) => {
      return Promise.all([
        queryInterface.addColumn('flows', 'flowname', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t }),
        queryInterface.addColumn('flows', 'renderselector', {
          type: Sequelize.DataTypes.STRING,
        }, { transaction: t })
      ]);
    });
  },
  down: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((t: any) => {
      return Promise.all([
        queryInterface.removeColumn('flows', 'flowname', { transaction: t }),
        queryInterface.removeColumn('flows', 'renderselector', { transaction: t })
      ]);
    });
  }
}