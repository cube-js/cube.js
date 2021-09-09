cube(`Products`, {
  sql: `SELECT * FROM public.products`,

  preAggregations: {
    productsRollup: {
      type:`rollup`,
      external: true,
      dimensions: [CUBE.name, CUBE.supplierId],
    },

    combinedRollup: {
      type: `rollupJoin`,
      dimensions: [Suppliers.email, Suppliers.company, CUBE.name],
      rollups: [Suppliers.suppliersRollup, CUBE.productsRollup],
      external: true,
    },
  },

  joins: {
    Suppliers: {
      sql: `${CUBE.supplierId} = ${Suppliers.id}`,
      relationship: `belongsTo`
    }
  },

  measures: {
    count: {
      type: `count`
    },
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    },
    name: {
      sql: `name`,
      type: `string`
    },
    createdAt: {
      sql: `created_at`,
      type: `time`
    },
    supplierId: {
      sql: `supplier_id`,
      type: `number`
    },
  },

  dataSource: 'products'
});
