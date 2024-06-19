import variables from 'config/variables';
import { PureComponent } from 'react';

class About extends PureComponent {
  constructor() {
    super();
    this.state = {
      update: variables.getMessage('modals.main.settings.sections.about.version.checking_update'),
      loading: variables.getMessage('modals.main.loading'),
    };
    this.controller = new AbortController();
  }

  async getGitHubData() {
    let versionData;

    try {
      versionData = await (
        await fetch(
          variables.constants.GITHUB_URL +
          '/repos/' +
          variables.constants.ORG_NAME +
          '/' +
          variables.constants.REPO_NAME +
          '/releases',
          { signal: this.controller.signal },
        )
      ).json();
    } catch (e) {
      if (this.controller.signal.aborted === true) {
        return;
      }

      return this.setState({
        update: variables.getMessage('modals.main.settings.sections.about.version.error.title'),
        loading: variables.getMessage(
          'modals.main.settings.sections.about.version.error.description',
        ),
      });
    }

    if (this.controller.signal.aborted === true) {
      return;
    }

    const newVersion = versionData[0].tag_name;

    let update = variables.getMessage('modals.main.settings.sections.about.version.no_update');
    if (
      Number(variables.constants.VERSION.replaceAll('.', '')) <
      Number(newVersion.replaceAll('.', ''))
    ) {
      update = `${variables.getMessage(
        'modals.main.settings.sections.about.version.update_available',
      )}: ${newVersion}`;
    }

    this.setState({
      // exclude bots
      update,
      loading: null,
    });
  }

  componentDidMount() {
    if (navigator.onLine === false || localStorage.getItem('offlineMode') === 'true') {
      this.setState({
        update: variables.getMessage('modals.main.marketplace.offline.description'),
        loading: variables.getMessage('modals.main.marketplace.offline.description'),
      });
      return;
    }

    this.getGitHubData();
  }

  componentWillUnmount() {
    // stop making requests
    this.controller.abort();
  }

  render() {
    return (
      <div className="modalInfoPage">
        <div className="settingsRow" style={{ justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexFlow: 'column', gap: '5px' }}>
            <img
              draggable={false}
              className="aboutLogo"
              src={'src/assets/icons/logo.svg'}
              alt="Logo"
            />
            <div className="aboutText">
              <span className="title">PrefersMin Tab</span>
              <span className="subtitle">
                {variables.getMessage('modals.main.settings.sections.about.version.title')}{' '}
                {variables.constants.VERSION}
              </span>
              <span className="subtitle">({this.state.update})</span>
            </div>
            <div>
              <span className="subtitle">
                Copyright 2018-
                {new Date().getFullYear()}{' '}
                <a
                  className="link"
                  href={
                    'https://github.com/' +
                    variables.constants.ORG_NAME +
                    '/' +
                    variables.constants.REPO_NAME +
                    '/graphs/contributors'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  The Mue Authors
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { About };
