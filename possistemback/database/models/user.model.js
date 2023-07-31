const { Model, DataTypes } = require('sequelize');

const USER_TABLE = 'users';

const UserSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  username: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING
  },
  status: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    default: true,
    get() {
      const value = this.getDataValue('status');
      let statusText = '';
      if (value) {
          statusText = 'Activo';
      } else if (!value) {
          statusText = 'Inactivo'
      }
      return statusText;
  }
  },
  userableId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'userable_id'
  },
  userableType: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'userable_type'
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'updated_at'
  }
}

class User extends Model {
  static associate(models) {
    this.belongsToMany(models.Role, {
      as: 'roles',
      through: models.RoleUser,
      foreignKey: 'userId',
      otherKey: 'roleId'
    });

    this.belongsTo(models.Employee, {
      as: 'employee',
      foreignKey: "userableId",
      constraints: false
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamps: true
    }
  }
}


module.exports = { USER_TABLE, UserSchema, User }