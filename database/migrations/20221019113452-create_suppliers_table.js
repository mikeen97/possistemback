'use strict';

const { SUPPLIER_TABLE, SupplierSchema } = require('../models/supplier.model');

module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(SUPPLIER_TABLE, SupplierSchema);
  },

  async down (queryInterface) {
    await queryInterface.dropTable(SUPPLIER_TABLE);
  }
};
