'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
console.log('basename', basename)
const env = process.env.NODE_ENV || 'development';
console.log('env', env)
const config = require(__dirname + '/../config/config')[env];
console.log('config', config)
const db: any = {};

let sequelize: any;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
console.log('sequelize', sequelize)

console.log('__dirname', __dirname)
fs.readdirSync(__dirname)
  .filter((file: any) => {
    console.log('file1', file)
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      (env === 'production' ? file.slice(-3) === '.js' : file.slice(-3) === '.ts')
    );
  })
  .forEach((file: any) => {
    console.log('file2', file)
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    console.log('model', model)
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  console.log('modelName', modelName)
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
