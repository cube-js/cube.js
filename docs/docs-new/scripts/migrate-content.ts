import path, { dirname } from "path";
import {
  readFile,
  mkdir,
  writeFile,
  unlink,
  lstat,
  readdir,
  rmdir,
  rename,
  stat,
} from "fs/promises";
import glob from "glob";
import frontmatter from "front-matter";

async function deleteFileOrFolder(p: string) {
  try {
    const stats = await lstat(p);
    if (stats.isDirectory()) {
      const files = await readdir(p);
      for (const file of files) {
        const curPath = path.join(p, file);
        await deleteFileOrFolder(curPath);
      }
      await rmdir(p);
    } else {
      await unlink(p);
    }
  } catch (err) {
    console.error(`Error deleting ${p}: ${err}`);
  }
}

interface DocAttributes {
  permalink?: string;
  redirect_from?: string[];
  category?: string;
  subCategory?: string;
  title: string;
  menuOrder?: number;
}

async function cleanup() {
  const contents = await glob("pages/*");

  await Promise.all(
    contents
      .filter(
        (p) =>
          ![
            "pages/_app.tsx",
            "pages/_meta.js",
            "pages/index.mdx",
            "pages/docs.mdx",
          ].includes(p)
      )
      .map((p) => deleteFileOrFolder(path.resolve(p)))
  );
}

interface Override {
  ready: boolean;
  path: string;
  title: string;

  meta?: Record<string, string>;
}

const overrides: Record<string, Override> = {
  "Cube.js-Introduction.mdx": {
    ready: true,
    path: "product/introduction",
    title: "Introduction",
    meta: {
      introduction: "Introduction",
      "getting-started": "Getting Started",
      configuration: "Configuration",
      "data-modeling": "Data Modeling",
      caching: "Caching",

      auth: "Authentication & Authorization",
      "api-rest": "REST API",
      "api-graphql": "GraphQL API",
      "api-sql": "SQL API",
      "frontend-integrations": "Frontend Integrations",
      workspace: "Workspace",
      deployment: "Deployment",
      monitoring: "Monitoring",
    },
  },

  // Getting Started

  "Getting-Started/Overview.mdx": {
    ready: true,
    path: "product/getting-started/overview",
    title: "Getting started with Cube",
    meta: {
      overview: "Overview",
      core: "Cube Core",
      cloud: "Cube Cloud",
    },
  },

  // Core

  "Getting-Started/Core/01-Overview.mdx": {
    ready: true,
    path: "product/getting-started/core/overview",
    title: "Getting started with Cube Core",
    meta: {
      overview: "Overview",
      "create-a-project": "Create a project",
      "query-data": "Query data",
      "add-a-pre-aggregation": "Add a pre-aggregation",
      "learn-more": "Learn more",
    },
  },
  "Getting-Started/Core/02-Create-a-project.mdx": {
    ready: true,
    path: "product/getting-started/core/create-a-project",
    title: "Create a project",
  },
  "Getting-Started/Core/03-Query-data.mdx": {
    ready: true,
    path: "product/getting-started/core/query-data",
    title: "Query data",
  },
  "Getting-Started/Core/04-Add-a-pre-aggregation.mdx": {
    ready: true,
    path: "product/getting-started/core/add-a-pre-aggregation",
    title: "Add a pre-aggregation",
  },
  "Getting-Started/Core/05-Learn-more.mdx": {
    ready: true,
    path: "product/getting-started/core/learn-more",
    title: "Learn more",
  },

  // Cloud

  "Getting-Started/Cloud/01-Overview.mdx": {
    ready: true,
    path: "product/getting-started/cloud/overview",
    title: "Getting started with Cube Cloud",
    meta: {
      overview: "Overview",
      "create-a-deployment": "Create a deployment",
      "generate-models": "Generate models",
      "query-data": "Query data",
      "add-a-pre-aggregation": "Add a pre-aggregation",
      "learn-more": "Learn more",
    },
  },
  "Getting-Started/Cloud/02-Create-a-deployment.mdx": {
    ready: true,
    path: "product/getting-started/cloud/create-a-deployment",
    title: "Create a deployment",
  },
  "Getting-Started/Cloud/03-Generate-models.mdx": {
    ready: true,
    path: "product/getting-started/cloud/generate-models",
    title: "Generate models",
  },
  "Getting-Started/Cloud/04-Query-data.mdx": {
    ready: true,
    path: "product/getting-started/cloud/query-data",
    title: "Query data",
  },
  "Getting-Started/Cloud/05-Add-a-pre-aggregation.mdx": {
    ready: true,
    path: "product/getting-started/cloud/add-a-pre-aggregation",
    title: "Add a pre-aggregation",
  },
  "Getting-Started/Cloud/06-Learn-more.mdx": {
    ready: true,
    path: "product/getting-started/cloud/learn-more",
    title: "Learn more",
  },

  // "Getting-Started/Migrate-from-Core/Upload-with-CLI.mdx": {},
  // "Getting-Started/Migrate-from-Core/Import-GitLab-repository-via-SSH.mdx": {},
  // "Getting-Started/Migrate-from-Core/Import-GitHub-repository.mdx": {},
  // "Getting-Started/Migrate-from-Core/Import-Git-repository-via-SSH.mdx": {},
  // "Getting-Started/Migrate-from-Core/Import-Bitbucket-repository-via-SSH.mdx":
  //   {},

  // configuration
  "Configuration/Overview.mdx": {
    ready: true,
    path: "product/configuration/overview",
    title: "Overview",
    meta: {
      overview: "Overview",
      "data-sources": "Connecting to data sources",
      "visualization-tools": "Connecting to visualization tools",
      vpc: "Connecting with a VPC",
      advanced: "Advanced",
    },
  },

  "Configuration/Advanced/Multitenancy.mdx": {
    ready: true,
    path: "product/configuration/advanced/multitenancy",
    title: "Multitenancy",
  },
  "Configuration/Advanced/Multiple-Data-Sources.mdx": {
    ready: true,
    path: "product/configuration/advanced/multiple-data-sources",
    title: "Multiple Data Sources",
  },

  // VPC
  "Configuration/VPC/Connecting-with-a-VPC.mdx": {
    ready: true,
    path: "product/configuration/vpc",
    title: "Connecting with a VPC",
  },
  "Configuration/VPC/Connecting-with-a-VPC-GCP.mdx": {
    ready: true,
    path: "product/configuration/vpc/gcp",
    title: "Connecting with a VPC on GCP",
  },
  "Configuration/VPC/Connecting-with-a-VPC-Azure.mdx": {
    ready: true,
    path: "product/configuration/vpc/azure",
    title: "Connecting with a VPC on Azure",
  },
  "Configuration/VPC/Connecting-with-a-VPC-AWS.mdx": {
    ready: true,
    path: "product/configuration/vpc/aws",
    title: "Connecting with a VPC on AWS",
  },

  // Visualization
  "Configuration/Connecting-to-Downstream-Tools.mdx": {
    ready: true,
    path: "product/configuration/visualization-tools",
    title: "Connecting to visualization tools",
  },
  "Configuration/Downstream/Thoughtspot.mdx": {
    ready: true,
    path: "product/configuration/visualization-tools/thoughtspot",
    title: "Thoughtspot",
  },
  "Configuration/Downstream/Tableau.mdx": {
    ready: true,
    path: "product/configuration/visualization-tools/tableau",
    title: "Tableau",
  },
  "Configuration/Downstream/Superset.mdx": {
    ready: true,
    path: "product/configuration/visualization-tools/superset",
    title: "Superset",
  },
  "Configuration/Downstream/Streamlit.mdx": {
    ready: true,
    path: "product/configuration/visualization-tools/streamlit",
    title: "Streamlit",
  },
  "Configuration/Downstream/Retool.mdx": {
    ready: true,
    path: "product/configuration/visualization-tools/retool",
    title: "Retool",
  },
  "Configuration/Downstream/PowerBI.mdx": {
    ready: true,
    path: "product/configuration/visualization-tools/powerbi",
    title: "PowerBI",
  },
  "Configuration/Downstream/Observable.mdx": {
    ready: true,
    path: "product/configuration/visualization-tools/observable",
    title: "Observable",
  },
  "Configuration/Downstream/Metabase.mdx": {
    ready: true,
    path: "product/configuration/visualization-tools/metabase",
    title: "Metabase",
  },
  "Configuration/Downstream/Jupyter.mdx": {
    ready: true,
    path: "product/configuration/visualization-tools/jupyter",
    title: "Jupyter",
  },
  "Configuration/Downstream/Hex.mdx": {
    ready: true,
    path: "product/configuration/visualization-tools/hex",
    title: "Hex",
  },
  "Configuration/Downstream/Delphi.mdx": {
    ready: true,
    path: "product/configuration/visualization-tools/delphi",
    title: "Delphi",
  },
  "Configuration/Downstream/Deepnote.mdx": {
    ready: true,
    path: "product/configuration/visualization-tools/deepnote",
    title: "Deepnote",
  },
  "Configuration/Downstream/Budibase.mdx": {
    ready: true,
    path: "product/configuration/visualization-tools/budibase",
    title: "Budibase",
  },
  "Configuration/Downstream/Bubble.mdx": {
    ready: true,
    path: "product/configuration/visualization-tools/bubble",
    title: "Bubble",
  },
  "Configuration/Downstream/Appsmith.mdx": {
    ready: true,
    path: "product/configuration/visualization-tools/appsmith",
    title: "Appsmith",
  },

  // databases
  "Configuration/Connecting-to-the-Database.mdx": {
    ready: true,
    path: "product/configuration/data-sources",
    title: "Connecting to data sources",
  },
  "Configuration/Databases/ksqlDB.mdx": {
    ready: true,
    path: "product/configuration/data-sources/ksqldb",
    title: "ksqlDB",
  },
  "Configuration/Databases/Trino.mdx": {
    ready: true,
    path: "product/configuration/data-sources/trino",
    title: "Trino",
  },
  "Configuration/Databases/Snowflake.mdx": {
    ready: true,
    path: "product/configuration/data-sources/snowflake",
    title: "Snowflake",
  },
  "Configuration/Databases/SQLite.mdx": {
    ready: true,
    path: "product/configuration/data-sources/sqlite",
    title: "SQLite",
  },
  "Configuration/Databases/QuestDB.mdx": {
    ready: true,
    path: "product/configuration/data-sources/questdb",
    title: "QuestDB",
  },
  "Configuration/Databases/Presto.mdx": {
    ready: true,
    path: "product/configuration/data-sources/presto",
    title: "Presto",
  },
  "Configuration/Databases/Postgres.mdx": {
    ready: true,
    path: "product/configuration/data-sources/postgres",
    title: "Postgres",
  },
  "Configuration/Databases/Oracle.mdx": {
    ready: true,
    path: "product/configuration/data-sources/oracle",
    title: "Oracle",
  },
  "Configuration/Databases/MySQL.mdx": {
    ready: true,
    path: "product/configuration/data-sources/mysql",
    title: "MySQL",
  },
  "Configuration/Databases/MongoDB.mdx": {
    ready: true,
    path: "product/configuration/data-sources/mongodb",
    title: "MongoDB",
  },
  "Configuration/Databases/Materialize.mdx": {
    ready: true,
    path: "product/configuration/data-sources/materialize",
    title: "Materialize",
  },
  "Configuration/Databases/MS-SQL.mdx": {
    ready: true,
    path: "product/configuration/data-sources/ms-sql",
    title: "MS-SQL",
  },
  "Configuration/Databases/Hive.mdx": {
    ready: true,
    path: "product/configuration/data-sources/hive",
    title: "Hive",
  },
  "Configuration/Databases/Google-BigQuery.mdx": {
    ready: true,
    path: "product/configuration/data-sources/google-bigquery",
    title: "Google-BigQuery",
  },
  "Configuration/Databases/Firebolt.mdx": {
    ready: true,
    path: "product/configuration/data-sources/firebolt",
    title: "Firebolt",
  },
  "Configuration/Databases/Elasticsearch.mdx": {
    ready: true,
    path: "product/configuration/data-sources/elasticsearch",
    title: "Elasticsearch",
  },
  "Configuration/Databases/Druid.mdx": {
    ready: true,
    path: "product/configuration/data-sources/druid",
    title: "Druid",
  },
  "Configuration/Databases/Databricks-JDBC.mdx": {
    ready: true,
    path: "product/configuration/data-sources/databricks-jdbc",
    title: "Databricks-JDBC",
  },
  "Configuration/Databases/ClickHouse.mdx": {
    ready: true,
    path: "product/configuration/data-sources/clickhouse",
    title: "ClickHouse",
  },
  "Configuration/Databases/AWS-Redshift.mdx": {
    ready: true,
    path: "product/configuration/data-sources/aws-redshift",
    title: "AWS-Redshift",
  },
  "Configuration/Databases/AWS-Athena.mdx": {
    ready: true,
    path: "product/configuration/data-sources/aws-athena",
    title: "AWS-Athena",
  },

  // Data modeling

  "Schema/Getting-Started.mdx": {
    ready: true,
    path: "product/data-modeling/overview",
    title: "Getting started with data modeling",
    meta: {
      overview: "Overview",
      fundamentals: "Fundamentals",
      reference: "Reference",
      advanced: "Advanced",
    },
  },

  // data modeling / fundamentals

  "Schema/Fundamentals/Concepts.mdx": {
    ready: true,
    path: "product/data-modeling/fundamentals/concepts",
    title: "Concepts",
  },
  "Schema/Fundamentals/Syntax.mdx": {
    ready: true,
    path: "product/data-modeling/fundamentals/syntax",
    title: "Syntax",
  },
  "Schema/Fundamentals/Working-with-Joins.mdx": {
    ready: true,
    path: "product/data-modeling/fundamentals/working-with-joins",
    title: "Working-with-Joins",
  },
  "Schema/Fundamentals/Additional-Concepts.mdx": {
    ready: true,
    path: "product/data-modeling/fundamentals/additional-concepts",
    title: "Additional-Concepts",
  },

  // data modeling / reference

  "Schema/Reference/cube.mdx": {
    ready: true,
    path: "product/data-modeling/reference/cube",
    title: "Cubes",
    meta: {
      cube: "Cubes",
      view: "Views",
      measures: "Measures",
      dimensions: "Dimensions",
      joins: "Joins",
      segments: "Segments",
      "pre-aggregations": "Pre-aggregations",
      "types-and-formats": "Types and Formats",
    },
  },
  "Schema/Reference/view.mdx": {
    ready: true,
    path: "product/data-modeling/reference/view",
    title: "Views",
  },
  "Schema/Reference/measures.mdx": {
    ready: true,
    path: "product/data-modeling/reference/measures",
    title: "Measures",
  },
  "Schema/Reference/dimensions.mdx": {
    ready: true,
    path: "product/data-modeling/reference/dimensions",
    title: "Dimensions",
  },
  "Schema/Reference/joins.mdx": {
    ready: true,
    path: "product/data-modeling/reference/joins",
    title: "Joins",
  },
  "Schema/Reference/segments.mdx": {
    ready: true,
    path: "product/data-modeling/reference/segments",
    title: "Segments",
  },
  "Schema/Reference/pre-aggregations.mdx": {
    ready: true,
    path: "product/data-modeling/reference/pre-aggregations",
    title: "Pre-aggregations",
  },
  "Schema/Reference/types-and-formats.mdx": {
    ready: true,
    path: "product/data-modeling/reference/types-and-formats",
    title: "Types and Formats",
  },

  // data modeling / advanced

  "Schema/Advanced/schema-execution-environment.mdx": {
    ready: true,
    path: "product/data-modeling/advanced/schema-execution-environment",
    title: "Execution Environment (JS models)",
    meta: {
      "schema-execution-environment": "Execution Environment (JS models)",
      "code-reusability-export-and-import": "Export and import",
      "code-reusability-extending-cubes": "Extending cubes",
      "data-blending": "Data blending",
      "dynamic-schema-creation": "Dynamic data models",
      "polymorphic-cubes": "Polymorphic cubes",
      "using-dbt": "Using dbt",
    },
  },
  "Schema/Advanced/Code-Reusability-Export-and-Import.mdx": {
    ready: true,
    path: "product/data-modeling/advanced/code-reusability-export-and-import",
    title: "Export and import",
  },
  "Schema/Advanced/Code-Reusability-Extending-Cubes.mdx": {
    ready: true,
    path: "product/data-modeling/advanced/code-reusability-extending-cubes",
    title: "Extending cubes",
  },
  "Schema/Advanced/Data-Blending.mdx": {
    ready: true,
    path: "product/data-modeling/advanced/data-blending",
    title: "Data blending",
  },
  "Schema/Advanced/Dynamic-Schema-Creation.mdx": {
    ready: true,
    path: "product/data-modeling/advanced/dynamic-schema-creation",
    title: "Dynamic data models",
  },
  "Schema/Advanced/Polymorphic-Cubes.mdx": {
    ready: true,
    path: "product/data-modeling/advanced/polymorphic-cubes",
    title: "Polymorphic cubes",
  },
  "Schema/Advanced/Using-dbt.mdx": {
    ready: true,
    path: "product/data-modeling/advanced/using-dbt",
    title: "Using dbt",
  },

  // Caching

  "Caching/Overview.mdx": {
    ready: true,
    path: "product/caching/overview",
    title: "Overview",
    meta: {
      overview: "Overview",
      "getting-started-pre-aggregations":
        "Getting started with pre-aggregations",
      "using-pre-aggregations": "Using pre-aggregations",
      "lambda-pre-aggregations": "Lambda pre-aggregations",
      "running-in-production": "Running in production",
    },
  },
  "Caching/Getting-Started-Pre-Aggregations.mdx": {
    ready: true,
    path: "product/caching/getting-started-pre-aggregations",
    title: "Getting started with pre-aggregations",
  },
  "Caching/Using-Pre-Aggregations.mdx": {
    ready: true,
    path: "product/caching/using-pre-aggregations",
    title: "Using pre-aggregations",
  },
  "Caching/Lambda-Pre-Aggregations.mdx": {
    ready: true,
    path: "product/caching/lambda-pre-aggregations",
    title: "Lambda pre-aggregations",
  },
  "Caching/Running-in-Production.mdx": {
    ready: true,
    path: "product/caching/running-in-production",
    title: "Running in production",
  },

  // "Workspace/SQL-Runner.mdx": {},
  // "Workspace/Preferences.mdx": {},
  // "Workspace/Inspecting-Queries.mdx": {},
  // "Workspace/Inspecting-Pre-aggregations.mdx": {},
  // "Workspace/Development-API.mdx": {},
  // "Workspace/Developer-Playground.mdx": {},
  // "Workspace/Cube-IDE.mdx": {},
  // "Workspace/CLI.mdx": {},
  // "Workspace/Access Control.mdx": {},
  // "Workspace/Single-Sign-On/SAML.mdx": {},
  // "Workspace/Single-Sign-On/Overview.mdx": {},
  // "Workspace/Single-Sign-On/Okta.mdx": {},

  // "Style-Guide/Overview.mdx": {},
  // "SQL-API/Template.mdx": {},
  // "SQL-API/Overview.mdx": {},
  // "SQL-API/Joins.mdx": {},
  // "SQL-API/Authentication-and-Authorization.mdx": {},
  // "REST-API/REST-API.mdx": {},
  // "REST-API/Query-Format.mdx": {},
  // "Monitoring/Log-Export.mdx": {},
  // "Monitoring/Alerts.mdx": {},
  // "GraphQL-API/GraphQL-API.mdx": {},
  // "Frontend-Integrations/Real-Time-Data-Fetch.mdx": {},
  // "Frontend-Integrations/Introduction.mdx": {},
  // "Frontend-Integrations/Introduction-vue.mdx": {},
  // "Frontend-Integrations/Introduction-react.mdx": {},
  // "Frontend-Integrations/Introduction-angular.mdx": {},
  // "FAQs/Troubleshooting.mdx": {},
  // "FAQs/Tips-and-Tricks.mdx": {},
  // "FAQs/General.mdx": {},

  // "Auth/Security-Context.mdx": {},
  // "Auth/Overview.mdx": {},

  // "Deployment/Core/Overview.mdx": {},
  // "Deployment/Cloud/Pricing.mdx": {},
  // "Deployment/Cloud/Overview.mdx": {},
  // "Deployment/Cloud/Deployment-Types.mdx": {},
  // "Deployment/Cloud/Custom-Domains.mdx": {},
  // "Deployment/Cloud/Continuous-Deployment.mdx": {},
  // "Deployment/Cloud/Auto-Suspension.mdx": {},
  // "Deployment/Production-Checklist.mdx": {},
  // "Deployment/Overview.mdx": {},

  "Reference/Configuration/Config.mdx": {
    ready: true,
    path: "reference/configuration/config",
    title: "Configuration options",
  },
  "Reference/Configuration/Environment-Variables-Reference.mdx": {
    ready: true,
    path: "reference/configuration/environment-variables",
    title: "Environment-variables",
  },
  "Reference/Frontend/@cubejs-client-vue.mdx": {
    ready: true,
    path: "reference/frontend/cubejs-client-vue",
    title: "@cubejs-client/vue",
  },
  // "Reference/Frontend/@cubejs-client-ngx.mdx": {},

  // "Reference/REST-API/REST-API.mdx": {},
  // "Reference/GraphQL-API/GraphQL-API.mdx": {},
  // "Reference/CLI/CLI-Reference.mdx": {},
  // "Reference/SQL-API/SQL-Functions-and-Operators.mdx": {},
  // "Reference/SQL-API/SQL-Commands.mdx": {},

  // "Examples-Tutorials-Recipes/Examples.mdx": {},
  "Examples-Tutorials-Recipes/Recipes.mdx": {
    ready: true,
    path: "guides/recipes",
    title: "Recipes",
  },
  "Examples-Tutorials-Recipes/Recipes/Upgrading-Cube/Migrating-from-Express-to-Docker.mdx":
    {
      ready: true,
      path: "guides/recipes/migrating-from-express-to-docker",
      title: "Migrating from Express to Docker",
    },
  // "Examples-Tutorials-Recipes/Recipes/Query-acceleration/using-originalsql-and-rollups-effectively.mdx":
  //   {},
  // "Examples-Tutorials-Recipes/Recipes/Query-acceleration/non-additivity.mdx":
  //   {},
  // "Examples-Tutorials-Recipes/Recipes/Query-acceleration/joining-multiple-data-sources.mdx":
  //   {},
  // "Examples-Tutorials-Recipes/Recipes/Query-acceleration/incrementally-building-pre-aggregations-for-a-date-range.mdx":
  //   {},
  // "Examples-Tutorials-Recipes/Recipes/Query-acceleration/Refreshing-select-partitions.mdx":
  //   {},

  // "Examples-Tutorials-Recipes/Recipes/Queries/pagination.mdx": {},
  // "Examples-Tutorials-Recipes/Recipes/Queries/getting-unique-values-for-a-field.mdx":
  //   {},
  // "Examples-Tutorials-Recipes/Recipes/Queries/enforcing-mandatory-filters.mdx":
  //   {},
  // "Examples-Tutorials-Recipes/Recipes/Data-modeling/using-dynamic-measures.mdx":
  //   {},
  // "Examples-Tutorials-Recipes/Recipes/Data-modeling/snapshots.mdx": {},
  // "Examples-Tutorials-Recipes/Recipes/Data-modeling/percentiles.mdx": {},
  // "Examples-Tutorials-Recipes/Recipes/Data-modeling/passing-dynamic-parameters-in-a-query.mdx":
  //   {},
  // "Examples-Tutorials-Recipes/Recipes/Data-modeling/entity-attribute-value.mdx":
  //   {},
  // "Examples-Tutorials-Recipes/Recipes/Data-modeling/dynamic-union-tables.mdx":
  //   {},
  // "Examples-Tutorials-Recipes/Recipes/Code-reusability/schema-generation.mdx":
  //   {},
  // "Examples-Tutorials-Recipes/Recipes/Data-sources/using-ssl-connections-to-data-source.mdx":
  //   {},
  // "Examples-Tutorials-Recipes/Recipes/Data-sources/multiple-sources-same-schema.mdx":
  //   {},
  // "Examples-Tutorials-Recipes/Recipes/Auth/Auth0-Guide.mdx": {},
  // "Examples-Tutorials-Recipes/Recipes/Auth/AWS-Cognito.mdx": {},
  // "Examples-Tutorials-Recipes/Recipes/Access-control/using-different-schemas-for-tenants.mdx":
  //   {},
  // "Examples-Tutorials-Recipes/Recipes/Access-control/role-based-access.mdx": {},
  // "Examples-Tutorials-Recipes/Recipes/Access-control/controlling-access-to-cubes-and-views.mdx":
  //   {},
  // "Examples-Tutorials-Recipes/Recipes/Access-control/column-based-access.mdx":
  //   {},
  // "Examples-Tutorials-Recipes/Recipes/Analytics/funnels.mdx": {},
  // "Examples-Tutorials-Recipes/Recipes/Analytics/event-analytics.mdx": {},
  // "Examples-Tutorials-Recipes/Recipes/Analytics/cohort-retention.mdx": {},
  // "Examples-Tutorials-Recipes/Recipes/Analytics/active-users.mdx": {},
};

async function main() {
  await cleanup();

  const mdxFiles = await glob("../content/**/*.mdx");

  await Promise.all(
    mdxFiles.map(async (filePath) => {
      const override = overrides[filePath.slice(11)];

      if (override && override.ready && override.path) {
        const file = await readFile(filePath, "utf8");
        const data = frontmatter<DocAttributes>(file);
        const permalink = data.attributes.permalink;

        if (data.attributes.category === "Internal") {
          return;
        }

        const targetFilePath = `pages/${override.path}.mdx`;

        const folderPath = dirname(targetFilePath);
        const folderExists = await stat(folderPath).catch(() => false);

        if (!folderExists) {
          await mkdir(folderPath, {
            recursive: true,
          });
        }

        if (override.meta) {
          await writeFile(
            path.resolve(folderPath, "_meta.js"),
            `module.exports = ${JSON.stringify(override.meta, null, 2)}`
          );
        }

        const redirects = data.attributes.redirect_from
          ? [...data.attributes.redirect_from, permalink]
          : [permalink];

        const content = `---
redirect_from:
${redirects.map((r) => `  - ${r}`).join("\n")}
---

# ${override.title}
${data.body
  .replaceAll(/<--\{"id"\s*:\s*"[^"]*"\}-->/g, "")
  .replaceAll(/<\!--(.+)-->/g, "")
  .replaceAll(/!\[image\|\d+x\d+\]\([^)]+\)/g, "")
  .replaceAll(`style="text-align: center"`, `style={{ textAlign: "center" }}`)
  .replaceAll("<pre><code>", '<pre><code>{"')
  .replaceAll("</code></pre>", '"}</code></pre>')
  .replaceAll(`style="border: none"`, `style={{ border: "none" }}`)
  .replaceAll(
    `style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"`,
    `style={{
      width: "100%",
      height:500,
      border:0,
      borderRadius: 4,
      overflow:"hidden"
    }}`
  )}`;

        // uncomment when ready to move docs content
        // await rename(filePath, path.resolve(targetFilePath));

        await writeFile(path.resolve(targetFilePath), content);
      }
    })
  );
}

try {
  main();
} catch (err) {
  console.error(err);
}
