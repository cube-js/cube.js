import {
  queryingCustomersDimensions,
  queryingCustomersDimensionsAndOrder,
  queryingCustomerDimensionsAndLimitTest,
  queryingCustomersDimensionsAndTotal,
  queryingCustomersDimensionsOrderLimitTotal,
  queryingCustomersDimensionsOrderTotalOffset,
  queryingCustomersDimensionsOrderLimitTotalOffset,
  filteringCustomersCubeFirst,
  filteringCustomersCubeSecond,
  filteringCustomersCubeThird,
  filteringCustomersEndsWithFilterFirst,
  filteringCustomersEndsWithFilterSecond,
  filteringCustomersEndsWithFilterThird,
  filteringCustomersStartsWithAndDimensionsFirst,
  filteringCustomersStartsWithAndDimensionsSecond,
  filteringCustomersStartsWithAndDimensionsThird,
  filteringCustomersEndsWithFilterAndDimensionsFirst,
  filteringCustomersEndsWithFilterAndDimensionsSecond,
  filteringCustomersEndsWithFilterAndDimensionsThird,
  queryingProductDimensions,
  queryingProductsDimensionsAndOrder,
  queryingProductsDimensionsAndOrderAndLimit,
  queryingProductsDimensionsOrderAndTotal,
  queryingProductsDimensionsOrderAndLimitAndTotal,
  filteringProductsContainsAndDimensionsAndOrderFirst,
  filteringProductsContainsAndDimensionsAndOrderSecond,
  filteringProductsContainsAndDimensionsAndOrderThird,
  filteringProductsStartsWithFilterDimensionsOrderFirst,
  filteringProductsStartsWithFilterDimensionsSecond,
  filteringProductsStartsWithFilterDimensionsThird,
  filteringProductsEndsWithFilterDimensionsFirst,
  filteringProductsEndsWithFilterDimensionsSecond,
  filteringProductsEndsWithFilterDimensionsThird,
  queryingECommerceDimensions,
  queryingECommerceDimensionsOrder,
  queryingECommerceDimensionsLimit,
  queryingECommerceDimensionsTotal,
  queryingECommerceDimensionsOrderLimitTotal,
  queryingECommerceDimensionsOrderTotalOffset,
  queryingECommerceDimensionsOrderLimitTotalOffset,
  queryingECommerceCountByCitiesOrder,
  queryingECommerceTotalQuantityAvgDiscountTotalSales,
  queryingECommerceTotalSalesTotalProfitByMonthAndOrder,
  filteringECommerceContainsDimensionsFirst,
  filteringECommerceContainsDimensionsSecond,
  filteringECommerceContainsDimensionsThird,
  filteringECommerceStartsWithDimensionsFirst,
  filteringECommerceStartsWithDimensionsSecond,
  filteringECommerceStartsWithDimensionsThird,
  filteringECommerceEndsWithDimensionsFirst,
  filteringECommerceEndsWithDimensionsSecond,
  filteringECommerceEndsWithDimensionsThird,
  queryingEcommerceTotalQuantifyAvgDiscountTotal,
} from './tests';
import { testSet } from './driverTest';

const skippedTestSet = testSet([
  queryingEcommerceTotalQuantifyAvgDiscountTotal,
  queryingProductDimensions,
  queryingECommerceTotalQuantityAvgDiscountTotalSales,
  queryingECommerceTotalSalesTotalProfitByMonthAndOrder
]);

const withOrderingTestSet = testSet([
  queryingCustomersDimensionsAndOrder,
  queryingCustomersDimensionsOrderLimitTotal,
  queryingCustomersDimensionsOrderTotalOffset,
  queryingCustomersDimensionsOrderLimitTotalOffset,
  queryingProductsDimensionsAndOrder,
  queryingProductsDimensionsAndOrderAndLimit,
  queryingProductsDimensionsOrderAndTotal,
  queryingProductsDimensionsOrderAndLimitAndTotal,
  filteringProductsContainsAndDimensionsAndOrderFirst,
  filteringProductsContainsAndDimensionsAndOrderSecond,
  filteringProductsContainsAndDimensionsAndOrderThird,
  filteringProductsStartsWithFilterDimensionsOrderFirst,
  filteringProductsStartsWithFilterDimensionsSecond,
  filteringProductsStartsWithFilterDimensionsThird,
  filteringProductsEndsWithFilterDimensionsFirst,
  filteringProductsEndsWithFilterDimensionsSecond,
  filteringProductsEndsWithFilterDimensionsThird,
  queryingECommerceDimensionsOrder,
  queryingECommerceDimensionsOrderLimitTotal,
  queryingECommerceDimensionsOrderTotalOffset,
  queryingECommerceDimensionsOrderLimitTotalOffset,
  queryingECommerceCountByCitiesOrder,
  queryingECommerceTotalQuantityAvgDiscountTotalSales,
  queryingECommerceTotalSalesTotalProfitByMonthAndOrder,
  queryingEcommerceTotalQuantifyAvgDiscountTotal
]);

const withoutOrderingTestSet = testSet([
  queryingCustomersDimensions,
  queryingCustomerDimensionsAndLimitTest,
  queryingCustomersDimensionsAndTotal,
  filteringCustomersCubeFirst,
  filteringCustomersCubeSecond,
  filteringCustomersCubeThird,
  filteringCustomersEndsWithFilterFirst,
  filteringCustomersEndsWithFilterSecond,
  filteringCustomersEndsWithFilterThird,
  filteringCustomersStartsWithAndDimensionsFirst,
  filteringCustomersStartsWithAndDimensionsSecond,
  filteringCustomersStartsWithAndDimensionsThird,
  filteringCustomersEndsWithFilterAndDimensionsFirst,
  filteringCustomersEndsWithFilterAndDimensionsSecond,
  filteringCustomersEndsWithFilterAndDimensionsThird,
  queryingProductDimensions,
  queryingECommerceDimensions,
  queryingECommerceDimensionsLimit,
  queryingECommerceDimensionsTotal,
  filteringECommerceContainsDimensionsFirst,
  filteringECommerceContainsDimensionsSecond,
  filteringECommerceContainsDimensionsThird,
  filteringECommerceStartsWithDimensionsFirst,
  filteringECommerceStartsWithDimensionsSecond,
  filteringECommerceStartsWithDimensionsThird,
  filteringECommerceEndsWithDimensionsFirst,
  filteringECommerceEndsWithDimensionsSecond,
  filteringECommerceEndsWithDimensionsThird
]);

export const mainTestSet = testSet([
  ...skippedTestSet,
  ...withOrderingTestSet,
  ...withoutOrderingTestSet,
]);

export const databricksTestSet = testSet([queryingCustomersDimensions]);
