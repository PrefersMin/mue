import React, { useState } from 'react';
import { Row, Content, Action } from 'components/Layout/Settings/Item';
import variables from 'config/variables';
import Slider from '../../../Form/Settings/Slider/Slider';

import EventBus from 'utils/eventbus';

const PreferencesWrapper = ({ children, ...props }) => {
  const [shown, setShown] = useState(localStorage.getItem(props.setting) === 'true');

  EventBus.on('toggle', (setting) => {
    if (setting === props.setting) {
      setShown(!shown);
    }
  });

  return (
    <div className={shown ? 'preferences' : 'preferencesInactive'}>
      {props.zoomSetting && (
        <Row>
          <Content
            title={variables.getMessage(
              'modals.main.settings.sections.appearance.accessibility.widget_zoom',
            )}
            subtitle={variables.getMessage('modals.main.settings.sections.header.size')}
          />
          <Action>
            <Slider
              name={props.zoomSetting}
              min="10"
              max="400"
              default="100"
              display="%"
              // marks={values.zoom}
              category={props.zoomCategory || props.category}
            />
          </Action>
        </Row>
      )}
      {children}
    </div>
  );
};

export { PreferencesWrapper as default, PreferencesWrapper };
