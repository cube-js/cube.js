import { BaseQuery, PostgresQuery } from '../../../src/adapter';
import { prepareCompiler } from '../../unit/PrepareCompiler';
import { dbRunner } from './PostgresDBRunner';

describe('Cube Views', () => {
  jest.setTimeout(200000);

  const { compiler, joinGraph, cubeEvaluator } = prepareCompiler(`
cube(\`Orders\`, {
  sql: \`
  SELECT 1 as id, 1 as product_id, 'completed' as status, '2022-01-01T00:00:00.000Z'::timestamptz as created_at
  UNION ALL
  SELECT 2 as id, 2 as product_id, 'completed' as status, '2022-01-02T00:00:00.000Z'::timestamptz as created_at
  \`,

  preAggregations: {
    countByProductName: {
      measures: [CUBE.count],
      dimensions: [Products.name],
      timeDimension: CUBE.createdAt,
      granularity: \`day\`,
      partitionGranularity: \`month\`,
      buildRangeStart: { sql: \`SELECT '2022-01-01'\` },
      buildRangeEnd: { sql: \`SELECT '2022-03-01'\` },
    }
  },

  joins: {
    Products: {
      sql: \`\${CUBE}.product_id = \${Products}.id\`,
      relationship: \`belongsTo\`
    },
    ProductsAlt: {
      sql: \`\${CUBE}.product_id = \${ProductsAlt}.id\`,
      relationship: \`belongsTo\`
    }
  },

  measures: {
    count: {
      type: \`count\`,
      //drillMembers: [id, createdAt]
    },
  },

  dimensions: {
    id: {
      sql: \`id\`,
      type: \`number\`,
      primaryKey: true
    },

    status: {
      sql: \`status\`,
      type: \`string\`
    },
    
    createdAt: {
      sql: \`created_at\`,
      type: \`time\`
    }
  },

  dataSource: \`default\`
});

cube(\`Products\`, {
  sql: \`
  SELECT 1 as id, 1 as product_category_id, 'Tomato' as name
  UNION ALL
  SELECT 2 as id, 1 as product_category_id, 'Potato' as name
  \`,
  
  joins: {
    ProductCategories: {
      sql: \`\${CUBE}.product_category_id = \${ProductCategories}.id\`,
      relationship: \`belongsTo\`
    },
  },

  measures: {
    count: {
      type: \`count\`,
    }
  },

  dimensions: {
    id: {
      sql: \`id\`,
      type: \`number\`,
      primaryKey: true
    },

    name: {
      sql: \`name\`,
      type: \`string\`
    },
  }
});

cube(\`ProductsAlt\`, {
  sql: \`SELECT * FROM \${Products.sql()} as p WHERE id = 1\`,

  joins: {
    ProductCategories: {
      sql: \`\${CUBE}.product_category_id = \${ProductCategories}.id\`,
      relationship: \`belongsTo\`
    },
  },

  measures: {
    count: {
      type: \`count\`,
    }
  },

  dimensions: {
    id: {
      sql: \`id\`,
      type: \`number\`,
      primaryKey: true
    },

    name: {
      sql: \`name\`,
      type: \`string\`
    },
  }
});

cube(\`ProductCategories\`, {
  sql: \`
  SELECT 1 as id, 'Groceries' as name
  UNION ALL
  SELECT 2 as id, 'Electronics' as name
  \`,

  joins: {

  },

  measures: {
    count: {
      type: \`count\`,
    }
  },

  dimensions: {
    id: {
      sql: \`id\`,
      type: \`number\`,
      primaryKey: true
    },

    name: {
      sql: \`name\`,
      type: \`string\`
    },
  }
});

view(\`OrdersView\`, {
  measures: {
    count: {
      sql: \`\${Orders.count}\`,
      type: \`number\`
    },
    
    productCategoryCount: {
      sql: \`\${Orders.ProductsAlt.ProductCategories.count}\`,
      type: \`number\`
    }
  },

  dimensions: {
    createdAt: {
      sql: \`\${Orders.createdAt}\`,
      type: \`time\`
    },

    productName: {
      sql: \`\${Products.name}\`,
      type: \`string\`
    },

    categoryName: {
      sql: \`\${Orders.ProductsAlt.ProductCategories.name}\`,
      type: \`string\`
    }
  }
});
    `);

  async function runQueryTest(q: any, expectedResult: any, additionalTest?: (query: BaseQuery) => any) {
    await compiler.compile();
    const query = new PostgresQuery({ joinGraph, cubeEvaluator, compiler }, { ...q, timezone: 'UTC', preAggregationsSchema: '' });

    console.log(query.buildSqlAndParams());

    const res = await dbRunner.evaluateQueryWithPreAggregations(query);
    console.log(JSON.stringify(res));

    if (additionalTest) {
      additionalTest(query);
    }

    expect(res).toEqual(
      expectedResult
    );
  }

  it('simple view', async () => runQueryTest({
    measures: ['OrdersView.count'],
    dimensions: [
      'OrdersView.categoryName'
    ],
    order: [{ id: 'OrdersView.categoryName' }]
  }, [{
    orders_view__category_name: 'Groceries',
    orders_view__count: '1',
  }, {
    orders_view__category_name: null,
    orders_view__count: '1',
  }]));

  it('join from two join hint paths', async () => runQueryTest({
    measures: ['OrdersView.productCategoryCount'],
    dimensions: [
      'OrdersView.categoryName'
    ],
    order: [{ id: 'OrdersView.productCategoryCount' }]
  }, [{
    orders_view__category_name: null,
    orders_view__product_category_count: '0',
  }, {
    orders_view__category_name: 'Groceries',
    orders_view__product_category_count: '1',
  }]));

  it('pre-aggregation', async () => runQueryTest({
    measures: ['OrdersView.count'],
    dimensions: [
      'OrdersView.productName'
    ],
    order: [{ id: 'OrdersView.productName' }],
  }, [{
    orders_view__product_name: 'Potato',
    orders_view__count: '1',
  }, {
    orders_view__product_name: 'Tomato',
    orders_view__count: '1',
  }], (query) => {
    const preAggregationsDescription = query.preAggregations?.preAggregationsDescription();
    console.log(preAggregationsDescription);
    expect((<any>preAggregationsDescription)[0].loadSql[0]).toMatch(/count_by_product_name/);
  }));
});
