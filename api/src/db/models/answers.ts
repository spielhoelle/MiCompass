module.exports = (sequelize: any, DataTypes: any) => {
  const answers = sequelize.define(
    'answers',
    {
      flow: DataTypes.STRING,
      data: DataTypes.JSONB
    },
    {}
  );
  answers.associate = (models: any) => {
    // associations can be defined here
  };
  return answers;
};
