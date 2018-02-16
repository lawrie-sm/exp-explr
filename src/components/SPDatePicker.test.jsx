/* eslint-env jest */

import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import SPDatePicker from './SPDatePicker';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SPDatePicker
    selectedDate={moment()}
    dateUpdateCallback={() => {}}
  />, div);
});
