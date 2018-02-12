/*
  This spinner is displayed when the API is called and the data
  is being processed.
*/

import React from 'react';
import { Loader } from 'semantic-ui-react';

const Spinner = () => (
  <Loader size="huge" active />
);

export default (Spinner);
