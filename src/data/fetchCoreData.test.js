/* eslint-env jest */

import { fetchCoreData, SP_APIS } from './fetchCoreData';

it('API returns correct arrays', () => {
  return fetchCoreData().then(data => {
    expect(data).toBeDefined();
    SP_APIS.forEach((api) => {
      expect(data[api]).toBeDefined();
      expect(data[api].length).toBeGreaterThan(0);
    });
  });
});
