import React from 'react';
import Reboot from 'material-ui/Reboot';
import AppContainer from './containers/AppContainer';

const App = () => (
  <div>
    <Reboot />
    <AppContainer debug="True" />
  </div>
);

export default App;
