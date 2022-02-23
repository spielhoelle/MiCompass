module.exports = (sequelize: any, DataTypes: any) => {
  const flows = sequelize.define(
    'flows',
    {
      flowId: DataTypes.STRING,
      flowname: DataTypes.STRING,
      renderselector: DataTypes.STRING,
      data: DataTypes.JSONB
    },
    {}
  );
  flows.associate = (models: any) => {
    // associations can be defined here
  };
  return flows;
};
