import { useCallback } from 'react';
import { MdAutoAwesome } from 'react-icons/md';
import { Header, Row, Content, Action, PreferencesWrapper } from 'components/Layout/Settings';
import { useLocalStorageState } from 'utils/useLocalStorageState';
import { Radio, Dropdown, Checkbox } from 'components/Form/Settings';
import { TextField } from '@mui/material';
import variables from 'config/variables';

const useWeatherSettings = () => {
  const [location, setLocation] = useLocalStorageState('location', '');
  const [windSpeed, setWindSpeed] = useLocalStorageState('windspeed', 'true');

  const showReminder = useCallback(() => {
    document.querySelector('.reminder-info').style.display = 'flex';
    localStorage.setItem('showReminder', true);
  }, []);

  const changeLocation = (e) => {
    localStorage.removeItem('currentWeather');
    setLocation(e.target.value);
    showReminder();
  };

  const getAutoLocation = useCallback(() => {
    setLocation(variables.getMessage('modals.main.loading'));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const data = await (
          await fetch(
            `${variables.constants.API_URL}/gps?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`,
          )
        ).json();
        setLocation(data[0].name);
        showReminder();
      },
      (error) => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
      },
    );
  }, [setLocation, showReminder]);

  return {
    location,
    windSpeed: windSpeed !== 'true',
    setWindSpeed,
    changeLocation,
    getAutoLocation,
  };
};

const WeatherOptions = () => {
  const { location, windSpeed, setWindSpeed, changeLocation, getAutoLocation } =
    useWeatherSettings();
  const weatherType = localStorage.getItem('weatherType');
  const WEATHER_SECTION = 'modals.main.settings.sections.weather';

  const WidgetType = () => (
    <Row>
      <Content title={variables.getMessage(`${WEATHER_SECTION}.widget_type`)} />
      <Action>
        <Dropdown
          label={variables.getMessage('modals.main.settings.sections.time.type')}
          name="weatherType"
          category="weather"
          onChange={() => this.forceUpdate()}
          items={[
            { value: '1', text: variables.getMessage(`${WEATHER_SECTION}.options.basic`) },
            { value: '2', text: variables.getMessage(`${WEATHER_SECTION}.options.standard`) },
            { value: '3', text: variables.getMessage(`${WEATHER_SECTION}.options.expanded`) },
            { value: '4', text: variables.getMessage(`${WEATHER_SECTION}.options.custom`) },
          ]}
        />
      </Action>
    </Row>
  );

  const LocationSetting = () => (
    <Row>
      <Content title={variables.getMessage(`${WEATHER_SECTION}.location`)} />
      <Action>
        <TextField
          label={variables.getMessage(`${WEATHER_SECTION}.location`)}
          value={location}
          onChange={changeLocation}
          placeholder="London"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
        />
        <span className="link" onClick={getAutoLocation}>
          <MdAutoAwesome />
          {variables.getMessage(`${WEATHER_SECTION}.auto`)}
        </span>
      </Action>
    </Row>
  );

  const TemperatureFormat = () => (
    <Row final={weatherType !== '4'}>
      <Content title={variables.getMessage(`${WEATHER_SECTION}.temp_format.title`)} />
      <Action>
        <Radio
          name="tempformat"
          options={[
            {
              name: `${variables.getMessage(`${WEATHER_SECTION}.temp_format.celsius`)} (°C)`,
              value: 'celsius',
            },
            {
              name: `${variables.getMessage(`${WEATHER_SECTION}.temp_format.fahrenheit`)} (°F)`,
              value: 'fahrenheit',
            },
            {
              name: `${variables.getMessage(`${WEATHER_SECTION}.temp_format.kelvin`)} (K)`,
              value: 'kelvin',
            },
          ]}
          category="weather"
        />
      </Action>
    </Row>
  );

  const CustomOptions = () => {
    const weatherOptions = [
      {
        name: 'weatherdescription',
        textKey: `${WEATHER_SECTION}.extra_info.show_description`,
      },
      {
        name: 'cloudiness',
        textKey: `${WEATHER_SECTION}.extra_info.cloudiness`,
      },
      { name: 'humidity', textKey: `${WEATHER_SECTION}.extra_info.humidity` },
      {
        name: 'visibility',
        textKey: `${WEATHER_SECTION}.extra_info.visibility`,
      },
      {
        name: 'windspeed',
        textKey: `${WEATHER_SECTION}.extra_info.wind_speed`,
        onChange: () => setWindSpeed(localStorage.getItem('windspeed') !== 'true'),
      },
      {
        name: 'windDirection',
        textKey: `${WEATHER_SECTION}.extra_info.wind_direction`,
        disabled: windSpeed,
      },
      {
        name: 'atmosphericpressure',
        textKey: `${WEATHER_SECTION}.extra_info.atmospheric_pressure`,
      },
    ];

    return (
      <Row final={true}>
        <Content title={variables.getMessage(`${WEATHER_SECTION}.custom_settings`)} />
        <Action>
          {weatherOptions.map((item) => (
            <Checkbox
              key={item.name}
              name={item.name}
              text={variables.getMessage(item.textKey)}
              category="weather"
              onChange={item.onChange}
              disabled={item.disabled}
            />
          ))}
        </Action>
      </Row>
    );
  };

  return (
    <>
      <Header
        title={variables.getMessage(`${WEATHER_SECTION}.title`)}
        setting="weatherEnabled"
        category="widgets"
        zoomSetting="zoomWeather"
        zoomCategory="weather"
        visibilityToggle={true}
      />
      <PreferencesWrapper
        setting="weatherEnabled"
        zoomSetting="zoomWeather"
        zoomCategory="weather"
        visibilityToggle={true}
      >
        <WidgetType />
        {/* https://stackoverflow.com/a/65328486 when using inputs it may defocus so we do the {} instead of <> */}
        {LocationSetting()}
        <TemperatureFormat />
        {weatherType === '4' && <CustomOptions />}
      </PreferencesWrapper>
    </>
  );
};

export { WeatherOptions as default, WeatherOptions };
