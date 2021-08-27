---
title: Working with Joins
permalink: /schema/fundamentals/joins
category: Data Schema
subCategory: Fundamentals
menuOrder: 4
redirect_from:
  - /direction-of-joins
  - /many-to-many-relationship
---

## Many-to-many joins

> The next paragraph is super word salad. Remove/improve.

A many-to-many relationship is a type of cardinality that refers to the
relationship between two entities, A and B, in which A may contain a parent
instance for which there are many children in B and vice versa.

For example, we have Topics and Posts. A Post can cover many Topics, and a Topic
could be covered by many Posts.

In a database, in this case, you most likely have an associative table (also
known as a junction table or cross-reference table). In our example, this table
would be `post_topics`.

<!-- prettier-ignore-start -->
[[info | ]]
| You can [jump to this section][self-many-to-many-no-assoc-table] if you don't
| have an associative table in your database.
<!-- prettier-ignore-end -->

The diagram below shows the tables `posts`, `topics`, `post_topics`, and their
relationship.

<div
  style="text-align: center"
>
  <img
  alt="Many-to-Many Entity Diagram for posts, topics and post_topics"
  src="https://raw.githubusercontent.com/cube-js/cube.js/master/docs/content/Schema/Fundamentals/many-to-many-1.png"
  style="border: none"
  width="100%"
  />
</div>

In the same way the `PostTopics` table was specifically created to handle this
association in DB, we need to create an associative cube `PostTopics`, and
declare the relationships from it to `Topics` cube and from `Posts` to
`PostTopics`. Please note, we’re using the `hasMany` relationship on the
`PostTopics` cube and direction of joins becomes
`Posts -> PostTopics -> Topics`. [Read more about direction of joins
here][self-join-direction].

```javascript
cube(`Posts`, {
  sql: `SELECT * FROM posts`,

  joins: {
    PostTopics: {
      relationship: `belongsTo`,
      sql: `${PostTopics}.post_id = ${Posts}.id`,
    },
  },
});

cube(`Topics`, {
  sql: `SELECT * FROM topics`,
});

cube(`PostTopics`, {
  sql: `SELECT * FROM post_topics`,

  joins: {
    Topic: {
      relationship: `hasMany`,
      sql: `${PostTopics}.topic_id = ${Topics}.id`,
    },
  },
});
```

In scenarios where a table doesn't define a primary key, one can be generated
using SQL:

```javascript
cube(`PostTopics`, {
  dimensions: {
    id: {
      sql: `CONCAT(${CUBE}.post_id, ${CUBE}.topic_id)`,
      type: `number`,
      primaryKey: true,
    },
  },
});
```

### Many-to-many joins without an associative table

Sometimes there is no associative table in the database, when in reality, there
is a many-to-many relationship. In this case, the solution is to extract some
data from existing tables and create a virtual (not backed by a real table in
the database) associative cube.

Let’s consider the following example. We have tables `Emails` and
`Transactions`. The goal is to calculate the amount of transactions per
campaign. Both `Emails` and `Transactions` have a `campaign_id` column. We don’t
have a campaigns table, but data about campaigns is part of the `Emails` table.

Let’s take a look at the `Emails` cube first:

```javascript
cube(`Emails`, {
  sql: `SELECT * FROM emails`,

  measures: {
    count: {
      type: `count`,
    },
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true,
    },

    campaignName: {
      sql: `campaign_name`,
      type: `string`,
    },

    campaignId: {
      sql: `campaign_id`,
      type: `number`,
    },
  },
});
```

We can extract campaigns data into a virtual `Campaigns` cube:

```javascript
cube(`Campaigns`, {
  sql: `
SELECT
  campaign_id,
  campaign_name,
  customer_name,
  MIN(created_at) AS started_at
FROM emails
GROUP BY 1, 2, 3
`,

  measures: {
    count: {
      type: `count`,
    },
  },

  dimensions: {
    id: {
      sql: `campaign_id`,
      type: `string`,
      primaryKey: true,
    },

    name: {
      sql: `campaign_name`,
      type: `string`,
    },
  },
});
```

The following diagram shows our data schema with the `Campaigns` cube:

<div
  style="text-align: center"
>
  <img
  alt="Many-to-Many Entity Diagram for emails, campaigns and transactions"
  src="https://raw.githubusercontent.com/cube-js/cube.js/master/docs/content/Schema/Fundamentals/many-to-many-2.png"
  style="border: none"
  width="100%"
  />
</div>

The last piece is to finally declare a many-to-many relationship. This should be
done by declaring a [`hasMany` relationship][ref-schema-ref-joins-relationship]
on the associative cube, `Campaigns` in our case.

```javascript
cube(`Emails`, {
  sql: `select * emails`,

  joins: {
    Campaigns: {
      relationship: `belongsTo`,
      sql: `${Emails}.campaign_id = ${Campaigns}.campaign_id
      AND ${Emails}.customer_name = ${Campaigns}.customer_name`,
    },
  },

  measures: {
    count: {
      type: `count`,
    },
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true,
    },

    campaignName: {
      sql: `campaign_name`,
      type: `string`,
    },

    campaignId: {
      sql: `campaign_id`,
      type: `number`,
    },
  },
});

cube(`Campaigns`, {
  joins: {
    Transactions: {
      relationship: `hasMany`,
      sql: `${Transactions}.customer_name = ${Campaigns}.customer_name
      AND ${Transactions}.campaign_id = ${Campaigns}.campaign_id`,
    },
  },
});
```

## Directions of joins

The direction of [joins][ref-schema-ref-joins] greatly influences the final
result set. As an example, let's take two cubes, `Orders` and `Customers`:

```javascript
cube('Orders', {
  sql: `SELECT * FROM orders`,

  measures: {
    count: {
      sql: 'id',
      type: 'count',
    },
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true,
    },
  },
});
```

```javascript
cube('Customers', {
  sql: `SELECT * FROM customers`,

  measures: {
    count: {
      sql: 'id',
      type: 'count',
    },
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true,
    },

    customerId: {
      sql: `customer_id`,
      type: `number`,
    },
  },
});
```

The first case is to calculate total orders revenue. Let's give `totalRevenue`
name for this metric. We also need to be aware of the fact that orders can be
placed without customer registration (anonymous customers/guest checkouts).
Because of anonymous customers, we should start the join from the `Orders` onto
the `Customers` cube in order not to lose data about anonymous orders:

```javascript
cube('Orders', {
  sql: `SELECT * FROM orders`,

  joins: {
    Customers: {
      relationship: `belongsTo`,
      sql: `${Orders}.customer_id = ${Customers}.id`,
    },
  },

  measures: {
    count: {
      sql: 'id',
      type: 'count',
    },

    totalRevenue: {
      sql: 'revenue',
      type: 'sum',
    },
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true,
      shown: true,
    },
  },
});
```

The second case is to find customers without any orders. Let's call this metric
`count`. In this case we should join the `Customers` cube with the `Orders` cube
to find customers with 0 orders placed. The reverse order of joins would result
in a dataset without data for customers without orders. Therefore, in this
instance, we declare the join in the `Customers` cube:

```javascript
cube('Customers', {
  sql: `SELECT * FROM customers`,

  joins: {
    Orders: {
      relationship: `hasMany`,
      sql: `${Customers}.id = ${Orders}.customer_id`,
    },
  },

  measures: {
    count: {
      sql: 'id',
      type: 'count',
    },
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true,
      shown: true,
    },

    customerId: {
      sql: `customer_id`,
      type: `number`,
    },
  },
});
```

### Transitive join pitfalls

> I'd like to rewrite this away from `A/B/C` - I wonder if `Orders`, `LineItems`
> and `Products` would work as a replacement for these examples

Let's consider an example where we have a many-to-many relationship between
`Users` and `Organizations` through an `OrganizationUsers` cube:

```javascript
cube(`Users`, {

  ...,

  measures: {
    count: {
      type: `count`,
    },
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true,
    },
  },
});

cube(`OrganizationUsers`, {

  ...,

  joins: {
    Users: {
      sql: `${CUBE}.user_id = ${Users}.id`,
      relationship: `hasMany`,
    },
    Organizations: {
      sql: `${CUBE}.organization_id = ${Organizations}.id`,
      relationship: `hasMany`,
    },
  },

  dimensions: {
    id: {
      // Joins require a primary key, so we'll create one on-the-fly
      sql: `CONCAT(${CUBE}.user_id, ':', ${CUBE}.organization_id)`,
      type: `string`,
      primaryKey: true,
    },
  },
});

cube(`Organizations`, {

  ...,

  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true,
    },
    name: {
      sql: `category`,
      type: `string`,
    },
  },
});
```

Let's try and execute a query:

```json
{
  "measures": ["Users.count"],
  "dimensions": ["Organizations.name"]
}
```

You'll get an error:
`Error: Can't find join path to join 'Users', 'Organizations'`. The problem is
joins are directed and if we try to connect `Users` and `Organizations` there's
no path from `Users` to `Organizations` or either from `Organizations` to
`Users`. One possible solution is to move the `Users-OrganizationUsers` join
from `OrganizationUsers` cube to `Users`, although this affects the query
semantics and thus the final results:

```javascript
cube(`Users`, {

  ...,

  joins: {
    OrganizationUsers: {
      sql: `${OrganizationUsers}.user_id = ${Users}.id`,
      relationship: `hasMany`,
    },
  },

  measures: {
    type: `count`,
  },
});

cube(`OrganizationUsers`, {

  ...,

  joins: {
    Organizations: {
      sql: `${OrganizationUsers}.organization_id = ${Organizations}.id`,
      relationship: `hasMany`,
    },
  },
});
```

> Check if the following is correct

Another solution is to create a new cube which joins the required cubes directly in the [`sql` property][ref-schema-ref-cubes-sql]:

```javascript
cube('AllOrganizationUsers', {
  sql: `
WITH users AS (${Users.sql()}),
organizations AS (${Organizations.sql()}),
organization_users AS (${OrganizationUsers.sql()})

SELECT users.*, organization.name AS org_name
FROM organization_users
WHERE organization_users.user_id = users.id
AND organization_users.organization_id = organization_id
`,

  measures: {
    count: {
      type: `count`,
    },
  },

  dimensions: {
    organizationName: {
      sql: `org_name`,
      type: `string`,
    }
  }
})
```

[ref-schema-ref-cubes-sql]: /schema/reference/cube#parameters-sql
[ref-schema-ref-joins]: /schema/reference/joins
[ref-schema-ref-joins-relationship]:
  /schema/reference/joins#parameters-relationship
[self-many-to-many-no-assoc-table]:
  #many-to-many-relationship#many-to-many-relationship-without-an-associative-table
[self-join-direction]: /schema/fundamentals/joins#directions-of-joins
