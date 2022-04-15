'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((t: any) => {
      return Promise.all([
        queryInterface.addColumn('answers', 'flow', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((t: any) => {
      return Promise.all([
        queryInterface.removeColumn('answers', 'flow', { transaction: t }),
      ]);
    });
  }
};
