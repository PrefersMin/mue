import variables from 'config/variables';
import { PureComponent } from 'react';
import { MdContactPage, MdEmail } from 'react-icons/md';
import { FaDiscord } from 'react-icons/fa';
import { SiGithubsponsors, SiOpencollective, SiX } from 'react-icons/si';
import { BiDonateHeart } from 'react-icons/bi';

import { Button } from 'components/Elements';

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
              <br></br>
              <span className="subtitle">
                Copyright 2023-2024{' '}
                <a
                  className="link"
                  href="https://kaiso.one"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {' '}
                  Kaiso One Ltd
                </a>
              </span>
            </div>
            <span className="subtitle">Licensed under the BSD-3-Clause License</span>
            <span className="subtitle">
              <a
                href={variables.constants.PRIVACY_URL}
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {variables.getMessage('modals.welcome.sections.privacy.links.privacy_policy')}
              </a>
            </span>
          </div>
        </div>

        <div className="settingsRow" style={{ flexFlow: 'column', alignItems: 'flex-start' }}>
          <span className="title">
            {variables.getMessage('modals.main.settings.sections.about.contact_us')}
          </span>
          <div className="aboutContact">
            <Button
              type="linkButton"
              href="https://muetab.com/contact"
              icon={<MdContactPage />}
              label={variables.getMessage('modals.main.settings.sections.about.form_button')}
            />
            <Button
              type="linkIconButton"
              href={'mailto:' + variables.constants.EMAIL}
              icon={<MdEmail />}
              tooltipTitle="Email"
            />
            <Button
              type="linkIconButton"
              href={'https://x.com/' + variables.constants.TWITTER_HANDLE}
              icon={<SiX />}
              tooltipTitle="X (Twitter)"
            />
            <Button
              type="linkIconButton"
              href={'https://discord.gg/' + variables.constants.DISCORD_SERVER}
              icon={<FaDiscord />}
              tooltipTitle="Discord"
            />
          </div>
        </div>

        <div className="settingsRow" style={{ flexFlow: 'column', alignItems: 'flex-start' }}>
          <span className="title">
            {variables.getMessage('modals.main.settings.sections.about.support_mue')}
          </span>
          <p>{variables.getMessage('modals.main.settings.sections.about.support_subtitle')}</p>
          <div className="aboutContact">
            <Button
              type="linkButton"
              href={'https://opencollective.com/' + variables.constants.OPENCOLLECTIVE_USERNAME}
              icon={<BiDonateHeart />}
              label={variables.getMessage('modals.main.settings.sections.about.support_donate')}
            />
            <Button
              type="linkIconButton"
              href={'https://github.com/sponsors/' + variables.constants.ORG_NAME}
              icon={<SiGithubsponsors />}
              tooltipTitle="Github Sponsors"
            />
            <Button
              type="linkIconButton"
              href={'https://opencollective.com/' + variables.constants.OPENCOLLECTIVE_USERNAME}
              icon={<SiOpencollective />}
              tooltipTitle="Open Collective"
            />
          </div>
        </div>
      </div>
    );
  }
}

export { About as default, About };
