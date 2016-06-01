var windowingServices = angular.module('windowingServices', ['ngResource']);


// AB TODO -- research JSONP
windowingServices.factory('HistogramJSONP', ['$resource',
  function($resource) {
    return $resource(server + 'ocp/stats/:token/:channel/hist/', {},
      {
        query: {
          method: 'JSONP',
          params: {callback: 'JSON_CALLBACK'},
        }
      }
    );
  }
]);

// standard get request. Must be on same server or CORS must be disabled
windowingServices.factory('Histogram', ['$resource',
  function($resource) {
    return $resource(server + 'ocp/stats/:token/:channel/hist/', {},
      { query: { method: 'GET', } }
    );
  }
]);

// standard get request. Must be on same server or CORS must be disabled
// we make a single http request here to get the histogram and some interesting statistics
windowingServices.factory('AllStats', ['$resource',
  function($resource) {
    return $resource(server + 'ocp/stats/:token/:channel/all/', {},
      { query: { method: 'GET', } }
    );
  }
]);

// get arbitrary percentiles
windowingServices.factory('Percentile', ['$resource',
  function($resource) {
    return $resource(server + 'ocp/stats/:token/:channel/percentile/:percent/', {},
      { query: { method: 'GET', } }
    );
  }
]);

// get projinfo contents
windowingServices.factory('ProjInfo', ['$resource',
  function($resource) {
    return $resource(server + '/ocp/ca/:token/info/', {},
      { query: { method: 'GET', } }
    );
  }
]);
