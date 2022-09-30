import React from "react";
import { Col, Row } from "antd";
import ChartRenderer from "../components/ChartRenderer";
import Dashboard from "../components/Dashboard";
import DashboardItem from "../components/DashboardItem";

const RealtimeDashboardItems = [
  {
    id: 10,
    name: "Users Online",
    vizState: {
      query: {
        measures: ["OnlineUsers.count"],
        timeDimensions: [
          {
            dimension: "OnlineUsers.lastSeen",
            dateRange: "last 120 seconds"
          }
        ]
      },
      chartType: "number"
    },
    size: 8
  },
  {
    id: 2,
    name: "Total Button Clicks",
    vizState: {
      query: {
        measures: ["Events.count"],
        timeDimensions: [],
        filters: [{
          member: `Events.type`,
          operator: `equals`,
          values: ['track']
        }]
      },
      chartType: "number"
    },
    size: 8
  },
  {
    id: 3,
    name: "Total Page Views",
    vizState: {
      query: {
        measures: ["Events.count"],
        timeDimensions: [],
        filters: [{
          member: `Events.type`,
          operator: `equals`,
          values: ['page']
        }]
      },
      chartType: "number"
    },
    size: 8
  },
  {
    id: 4,
    name: "Real Time Events",
    vizState: {
      query: {
        measures: ["Events.count"],
        timeDimensions: [
          {
            dimension: "Events.time",
            granularity: "second",
            dateRange: "last 60 seconds"
          }
        ],
        order: {
          "Events.time": "asc"
        },
      },
      chartType: "line"
    },
    size: 12
  },
  {
    id: 5,
    name: "Last Events",
    vizState: {
      query: {
        measures: [],
        timeDimensions: [
          {
            dimension: "Events.time"
          }
        ],
        dimensions: [
          "Events.anonymousId",
          "Events.type",
          "Events.time"
        ],
        filters: [],
        order: {
          "Events.time": "desc"
        },
        limit: 6
      },
      chartType: "table"
    },
    size: 12
  },
];

const LastDayDashboardItems = [
  {
    id: 10,
    name: "Users Online Last 24 Hours",
    vizState: {
      query: {
        measures: ["OnlineUsers.count"],
        timeDimensions: [
          {
            dimension: "OnlineUsers.lastSeen",
            dateRange: "last 24 hours"
          }
        ]
      },
      chartType: "number"
    },
    size: 8
  },
  {
    id: 2,
    name: "Button Clicks Last 24 Hours",
    vizState: {
      query: {
        measures: ["Events.count"],
        timeDimensions: [{
          dimension: "Events.time",
          dateRange: "last 24 hours"
        }],
        filters: [{
          member: `Events.type`,
          operator: `equals`,
          values: ['track']
        }]
      },
      chartType: "number"
    },
    size: 8
  },
  {
    id: 3,
    name: "Page Views Last 24 Hours",
    vizState: {
      query: {
        measures: ["Events.count"],
        timeDimensions: [{
          dimension: "Events.time",
          dateRange: "last 24 hours"
        }],
        filters: [{
          member: `Events.type`,
          operator: `equals`,
          values: ['page']
        }]
      },
      chartType: "number"
    },
    size: 8
  },
  {
    id: 4,
    name: "Events Last 24 Hours",
    vizState: {
      query: {
        measures: ["Events.count"],
        timeDimensions: [
          {
            dimension: "Events.time",
            granularity: "hour",
            dateRange: "last 24 hours"
          }
        ],
        order: {
          "Events.time": "asc"
        },
      },
      chartType: "line"
    },
    size: 12
  },
  {
    id: 5,
    name: "Last Events",
    vizState: {
      query: {
        measures: [],
        timeDimensions: [
          {
            dimension: "Events.time"
          }
        ],
        dimensions: [
          "Events.anonymousId",
          "Events.type",
          "Events.time"
        ],
        filters: [],
        order: {
          "Events.time": "desc"
        },
        limit: 6
      },
      chartType: "table"
    },
    size: 12
  },
];

const DashboardPage = () => {
  const dashboardItem = item => (
    <Col
      span={24}
      lg={item.size}
      key={item.id}
      style={{
        marginBottom: "24px"
      }}
    >
      <DashboardItem title={item.name}>
        <ChartRenderer vizState={item.vizState} />
      </DashboardItem>
    </Col>
  );

  const Empty = () => (
    <div
      style={{
        textAlign: "center",
        padding: 12
      }}
    >
      <h2>There are no charts on this dashboard</h2>
    </div>
  );

  return (
<div>
  {RealtimeDashboardItems.length ? (
    <div
      style={{
        padding: "0 12px 12px 12px",
        margin: "10px 8px"
      }}
    >
      <h2>Realtime Events</h2>
      <Row
        style={{
          padding: "0 20px"
        }}
      ></Row>
      <Row>
        <Dashboard dashboardItems={RealtimeDashboardItems}>
          {RealtimeDashboardItems.map(dashboardItem)}
        </Dashboard>
      </Row>
    </div>
  ) : (
    <Empty />
  )}

  {LastDayDashboardItems.length ? (
      <div
          style={{
            padding: "0 12px 12px 12px",
            margin: "10px 8px"
          }}
      >
        <h2>Last 24 Hours Events</h2>
        <Row
            style={{
              padding: "0 20px"
            }}
        ></Row>
        <Row>
          <Dashboard dashboardItems={LastDayDashboardItems}>
            {LastDayDashboardItems.map(dashboardItem)}
          </Dashboard>
        </Row>
      </div>
  ) : (
      <Empty />
  )}
  {LastDayDashboardItems.length || RealtimeDashboardItems.length ? (
      <DashboardItem title="Architecture">
        <div>
          <img width="100%" src="https://ucarecdn.com/4efc3459-88b4-4a54-8596-8a0e6fa16814/" alt="Architecture" />
        </div>
      </DashboardItem>
    ) : (
        <Empty />
  )}
</div>)
};

export default DashboardPage;
