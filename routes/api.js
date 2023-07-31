const express = require('express');
const passport = require('passport');

const brandsRouter = require('./catalogue/brands.router');
const categoriesRouter = require('./catalogue/categories.router');
const subcategoriesRouter = require('./catalogue/subcategories.router');
const propertiesRouter = require('./catalogue/properties.router');
const productsRouter = require('./catalogue/products.router');
const featuresRouter = require('./catalogue/features.router');
const authRouter = require('./auth/auth.router');

const employeesRouter = require('./organization/employees.router');
const usersRouter = require('./organization/users.router');
const suppliersRouter = require('./organization/suppliers.router');

const purchasesRouter = require('./transaction/purchases.router');
const cashiersRouter = require('./transaction/cashier.router');
const openingsRouter = require('./transaction/openings.router');
const salesRouter = require('./transaction/sales.router');
const configsRouter = require('./transaction/configs.router');

const customersRouter = require('./client/customers.router');
const enterprisesRouter = require('./client/enterprises.router');

const { checkRoles } = require('../middlewares/auth.handler');

function apiRouter(app) {
    const router = express.Router();

    app.use('/api/v1/', router);

    router.use('/brands',
        passport.authenticate('jwt', { session: false }),
        checkRoles('almacenero'),
        brandsRouter
    );

    router.use('/categories', passport.authenticate('jwt',
        { session: false }),
        checkRoles('almacenero'),
        categoriesRouter
    );

    router.use('/subcategories', passport.authenticate('jwt',
        { session: false }),
        checkRoles('almacenero'),
        subcategoriesRouter
    );

    router.use('/properties', passport.authenticate('jwt',
        { session: false }),
        checkRoles('almacenero'),
        propertiesRouter
    );

    router.use('/products', passport.authenticate('jwt',
        { session: false }),
        checkRoles('almacenero'),
        productsRouter
    );

    router.use('/features', passport.authenticate('jwt',
        { session: false }),
        checkRoles('almacenero'),
        featuresRouter
    );

    router.use('/employees', passport.authenticate('jwt',
        { session: false }),
        checkRoles('almacenero'),
        employeesRouter
    );

    router.use('/suppliers', passport.authenticate('jwt',
        { session: false }),
        checkRoles('almacenero'),
        suppliersRouter
    );

    router.use('/purchases', passport.authenticate('jwt',
        { session: false }),
        checkRoles('almacenero'),
        purchasesRouter
    );

    router.use('/customers', passport.authenticate('jwt',
        { session: false }),
        checkRoles('almacenero'),
        customersRouter
    );

    router.use('/enterprises', passport.authenticate('jwt',
        { session: false }),
        checkRoles('almacenero'),
        enterprisesRouter
    );

    router.use('/openings', passport.authenticate('jwt',
        { session: false }),
        checkRoles('cajero'),
        openingsRouter
    );

    router.use('/cashiers', passport.authenticate('jwt',
        { session: false }),
        checkRoles('cajero'),
        cashiersRouter
    );

    router.use('/sales', passport.authenticate('jwt',
        { session: false }),
        checkRoles('cajero'),
        salesRouter
    );

    router.use('/configs', passport.authenticate('jwt',
        { session: false }),
        checkRoles('cajero'),
        configsRouter
    );

    router.use('/users', usersRouter);
    router.use('/auth', authRouter);
}

module.exports = apiRouter;