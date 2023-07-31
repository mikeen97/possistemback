const boom = require('@hapi/boom');
const { models } = require('../../libs/sequelize');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

class UsersService {
    async find(query) {
        const { limit, offset, search, sortColumn, sortDirection } = query;

        const options = {
            order: [(sortColumn) ? [sortColumn, sortDirection] : ['id', 'DESC']],
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            },
            include: [
                {
                    model: models.Role,
                    as: 'roles',
                    attributes: ['name', 'id'],
                    through: {
                        attributes: []
                    }
                },
                'employee'
            ]
        }
        const optionsCount = {};

        if (limit && offset) {
            options.limit = limit;
            options.offset = offset;
        }

        if (search) {
            options.where = {
                username: {
                    [Op.iLike]: `%${search}%`
                }
            }

            optionsCount.where = {
                username: {
                    [Op.iLike]: `%${search}%`
                }
            }
        }

        const users = await models.User.findAll(options);
        const totalUsers = await models.User.count(optionsCount);

        return { users, totalUsers };
    }

    async findRoles() {
        const roles = await models.Role.findAll();
        return roles;
    }

    async create(data) {
        const hash = await bcrypt.hash(data.password, 10);
        const user = await models.User.create({
            ...data,
            password: hash
        });

        if (data.roles && data.roles.length > 0) {
            data.roles.forEach(async (id) => {
                const role = await models.Role.findByPk(id);
                await user.addRole(role);
            });
        }

        delete user.dataValues.password;
        return user;
    }

    async addRole(data) {
        const res = await models.RoleUser.create(data);
        return res;
    }

    async findOne(id) {
        const user = await models.User.findByPk(id, {
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            },
            include: [
                {
                    model: models.Role,
                    as: 'roles',
                    through: {
                        attributes: []
                    }
                },
                {
                    model: models.Employee,
                    as: 'employee',
                    attributes: ['fullname', 'dni', 'id']
                }
            ]
        });
        if (!user) {
            throw boom.notFound('No se encontro ningún usuario');
        }
        return user;
    }

    async findByUsername(username) {
        const user = await models.User.findOne({
            where: { username },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            include: [
                {
                    model: models.Role,
                    as: 'roles',
                    attributes: ['name'],
                    through: {
                        attributes: []
                    }
                }, {
                    model: models.Employee,
                    as: 'employee',
                    attributes: ['fullname', 'id']
                }
            ]
        });
        return user;
    }

    async update(id, changes) {
        let user = await this.findOne(id);
        // const hash = await bcrypt.hash(changes.password, 10);

        user = await user.update(changes);

        if (changes.roles && changes.roles.length > 0) {
            await models.RoleUser.destroy({
                where: {
                    userId: id
                }
            });
            changes.roles.forEach(async (id) => {
                const role = await models.Role.findByPk(id);
                await user.addRole(role);
            });
        }

        delete user.dataValues.password;
        delete user.dataValues.roles;

        return user;
    }

    async updatePassword(id, changes) {
        let user = await this.findOne(id);
        const hash = await bcrypt.hash(changes.password, 10);

        user = await user.update({
            password: hash
        });

        delete user.dataValues.password;
        delete user.dataValues.roles;

        return user;
    }

    async delete(id) {
        const user = await this.findOne(id);
        await user.destroy();
        return { id };
    }
}

module.exports = UsersService;