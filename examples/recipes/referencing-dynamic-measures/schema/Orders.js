const statuses = [
  'processing',
  'shipped',
  'completed'
];

const createTotalByStatusMeasure = (status) => ({
  [`Total_${status}_orders`]: {
    type: `count`,
    title: `Total ${status} orders`,
    filters: [
      {
        sql: (CUBE) => `${CUBE}."status" = '${status}'`,
      },
    ],
  },
});

const createPercentangeMeasure = (status) => ({
  [`Percentage_of_${status}`]: {
    type: `number`,
    format: `percent`,
    title: `Percentage of ${status} orders`,
    sql: (CUBE) =>
      `${CUBE[`Total_${status}_orders`]}::decimal / ${CUBE.totalOrders}::decimal * 100.0`,
  },
});

cube(`Orders`, {
  sql: `SELECT * FROM public.orders`,

  measures: Object.assign(
    {
      totalOrders: {
        type: `count`,
        title: `Total orders`,
      },
    },
    statuses.reduce(
      (all, status) => ({
        ...all,
        ...createTotalByStatusMeasure(status),
        ...createPercentangeMeasure(status),
      }),
      {}
    )
  ),
});
