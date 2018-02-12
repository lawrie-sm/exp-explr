/*
  Called by the React app on startup.
  Makes API calls to the Scottish Parliament.
  Returns the APIs in a coreData array for processing by getMembers.
  Caching should be done by service worker.

  See https://data.parliament.scot/#/api-list
  NB: 'telephones' (w/ 'telephonetypes') doesn't currently
  have any numbers (2/18).

*/

const SP_API_ROOT = 'https://data.parliament.scot/api/';

const SP_APIS = [
  'members',
  'MemberElectionConstituencyStatuses',
  'MemberElectionregionStatuses',
  'constituencies',
  'regions',
  'parties',
  'memberparties',
  'partyroles',
  'memberpartyroles',
  'governmentroles',
  'membergovernmentroles',
  'addresses',
  'addresstypes',
  'emailaddresses',
  'emailaddresstypes',
  'websites',
  'websitetypes',
  'membercrosspartyroles',
  'crosspartygrouproles',
  'crosspartygroups',
  'personcommitteeroles',
  'committeeroles',
  'committees',
  'committeetypelinks',
  'committeetypes',
];

// Returns a promise for calling the API using fetch
function get(url) {
  return new Promise((resolve, reject) => {
    fetch(url, { method: 'get' })
      .then((response) => response.json())
      .then((data) => {
        if (data) resolve(data);
        else reject(new Error(`Could not access ${url}`));
      });
  });
}

// Main promise for returning the data
function fetchCoreDataFromAPIs() {
  return new Promise((resolve, reject) => {
    const promiseList = SP_APIS.map((endpoint) => (
      get(`${SP_API_ROOT}${endpoint}`)
    ));
    Promise.all(promiseList).then((dataArr) => {
      const returnData = {};
      SP_APIS.forEach((endpoint, i) => {
        returnData[endpoint] = dataArr[i];
      });
      if (returnData) resolve(returnData);
      else reject(new Error('Could not access SP APIs.'));
    });
  });
}

export default fetchCoreDataFromAPIs;
