/* globals window */
import fetch from './playgroundFetch';

// TODO
const indexCss = `
@import '~antd/dist/antd.css';
body {
  background-color: #f0f2f5 !important;
}
`;

const fetchWithRetry = (url, options, retries) => fetch(url, { ...options, retries });

class DashboardSource {
  async load(createApp, { chartLibrary, templatePackageName } = {}) {
    this.loadError = null;
    this.playgroundContext = await this.loadContext();
    if (createApp) {
      await this.applyTemplatePackages(
        ['create-react-app', templatePackageName, `${chartLibrary}-charts`, 'antd-tables', 'credentials'], {
          credentials: this.playgroundContext
        }
      );
    }
    const res = await fetchWithRetry('/playground/dashboard-app-create-status', undefined, 10);
    const result = await res.json();
    if (result.error) {
      this.loadError = result.error;
    } else {
      this.dashboardCreated = result.status === 'created';
      this.installedTemplates = result.installedTemplates;
    }
  }

  applyTemplatePackages(templatePackages, templateConfig) {
    return fetchWithRetry('/playground/apply-template-packages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        templatePackages,
        templateConfig
      })
    });
  }

  async loadContext() {
    const res = await fetch('/playground/context');
    const result = await res.json();
    return {
      cubejsToken: result.cubejsToken,
      apiUrl: result.apiUrl || window.location.href.split('#')[0].replace(/\/$/, '')
    };
  }

  get templatePackages() { // TODO load
    return [
      { name: 'react-antd-dynamic', description: 'React Antd Dynamic' },
      { name: 'react-antd-static', description: 'React Antd Static' }
    ];
  }

  async canAddChart() {
    await this.load();
    if (this.loadError) {
      return this.loadError;
    }
    return !!this.installedTemplates['react-antd-static'];
  }

  async addChart(chartCode) {
    await this.load();
    if (this.loadError) {
      return;
    }
    await this.applyTemplatePackages(['create-react-app', 'react-antd-static', 'static-chart'], {
      'static-chart': {
        chartCode
      }
    });
  }
}

export default DashboardSource;
