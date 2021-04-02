import React from 'react';
import { Layout, Row, Col, Button, Icon } from 'antd';

import styles from '../../../static/styles/index.module.scss';
import { DocsSwitcher } from '../DocsSwitcher';
import switchStyles from '../DocsSwitcher/styles.module.scss';

const layout = {
  leftSidebar: {
    width: {
      xxl: 6,
      xl: 6,
      lg: 7,
      md: 7,
      xs: 24,
    },
  },
  contentArea: {
    width: {
      xxl: { span: 12, offset: 1 },
      xl: { span: 12, offset: 1 },
      lg: { span: 9, offset: 1 },
      md: { span: 7, offset: 1 },
      xs: 0,
    },
  },
  rightSidebar: {
    width: {
      xxl: { span: 4, offset: 1 },
      xl: { span: 4, offset: 1 },
      lg: { span: 6, offset: 1 },
      md: { span: 8, offset: 1 },
      xs: 0,
    },
  },
};

type Props = {
  className?: string;
};

const Header: React.FC<Props> = (props) => (
  <Layout.Header className={props.className}>
    <div className={styles.searchDimmer}></div>
    <Row>
      <Col {...layout.leftSidebar.width} style={{ height: 'inherit' }}>
        <div className={switchStyles.docsSwitcherWrapper}>
          <DocsSwitcher />
        </div>
      </Col>
      <Col {...layout.contentArea.width}>{props.children}</Col>
      <Col
        {...layout.rightSidebar.width}
        style={{ height: 'inherit', textAlign: 'right' }}
      >
        <div className={styles.headerButtonWrapper}>
          {/*<Button href="https://github.com/statsbotco/cube.js#community" className={styles.headerButton}>*/}
          {/*  Community*/}
          {/*</Button>*/}
          <Button
            href='https://cubejs-community.herokuapp.com/'
            target='_blank'
            className={styles.headerButton}
          >
            <Icon style={{ fontSize: '22px' }} type='slack' />
            Slack
          </Button>
          <Button
            href='https://forum.cube.dev/'
            target='_blank'
            className={styles.headerButton}
          >
            <Icon style={{ fontSize: '22px' }} type='discourse' />
            Discourse
          </Button>          
          <Button
            href='https://github.com/cube-js/cube.js'
            target='_blank'
            className={styles.headerButton}
          >
            <Icon style={{ fontSize: '22px' }} type='github' />
            GitHub
          </Button>
        </div>
      </Col>
    </Row>
  </Layout.Header>
);

export default Header;
