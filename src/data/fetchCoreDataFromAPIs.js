/*
Makes API calls to the Scottish Parliament.
Called by getData
*/

// This is the basic URL for all Parliamentary API calls
const SP_API_ROOT = 'https://data.parliament.scot/api/';

// Hardcoded list of APIs for appending to root url
// See https://data.parliament.scot/#/api-list
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
  'telephones',
  'telephonetypes',
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
      .then((data) => resolve(data));
  });
}

// Main function for returning the data
function fetchCoreDataFromAPIs() {
  return new Promise((resolve, reject) => {
    const promiseList = SP_APIS.map((endpoint) => {
      return get(`${SP_API_ROOT}${endpoint}`);
    });
    Promise.all(promiseList).then((dataArr) => {
      const returnData = {};
      SP_APIS.forEach((endpoint, i) => {
        returnData[endpoint] = dataArr[i];
      });
      resolve(returnData);
    });
  });
}

export default fetchCoreDataFromAPIs;
