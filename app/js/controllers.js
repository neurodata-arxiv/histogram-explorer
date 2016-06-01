var windowingControllers = angular.module('windowingControllers', []);

windowingControllers.controller('statsController', ['$scope', 'AllStats', 'Percentile', function($scope, AllStats, Percentile) {

  $scope.token = null;
  $scope.channel = null;

  $scope.error = null;

  // the value of the slider (i.e. we want curPercentSlider% of the dataset)
  $scope.curPercentSlider = 0;

  $scope.loadHistogram = function(token, channel) {
    $scope.stats = AllStats.query({token: $scope.token, channel: $scope.channel});
    // on load, plot the histogram
    $scope.stats.$promise.then(function() {
      plotHistogram($scope.stats.hist, $scope.stats.bins);
      $scope.error = null; // clear existing any errors
      // set the retrieved token and channel, and broadcast
      $scope.retrievedToken = $scope.token;
      $scope.retrievedChannel = $scope.channel;
      // we also broadcast the token and channel variables and load an initial image
      $scope.$broadcast('token', $scope.token);
      $scope.$broadcast('channel', $scope.channel);
    }, function() {
      $scope.stats = null;
      $scope.error = 'Failed to retrieve statistics! Check token / channel.';
      emptyPlot();
      // broadcast hidden to hide image
      $scope.$broadcast('hidden', true);
    });
  };

  $scope.getPercentile = function(value) {
    $scope.curPercentSliderStatus = Percentile.query({token: $scope.token, channel: $scope.channel, percent: value});
    $scope.curPercentSliderStatus.$promise.then(function() {
      $scope.curPercentSlider = $scope.curPercentSliderStatus[value];
    });
  };

  $scope.setMax = function(max) {
    $scope.$broadcast('max', max);
  }

  $scope.setMin = function(min) {
    $scope.$broadcast('min', min);
  }

}]);


windowingControllers.controller('imgController', ['$scope', 'ProjInfo', function($scope, ProjInfo) {
  $scope.max = 65536
  $scope.min = 0

  $scope.hidden = true;
  // hide if there's an error when changing the token
  $scope.$on('hidden', function(event, data) {
    $scope.hidden = true;
  });

  $scope.$on('token', function(event, data) {
    $scope.token = data;
    $scope.hidden = false;
    $scope.projinfo = ProjInfo.query({token: $scope.token});
    $scope.projinfo.$promise.then(function() {
      // grab a 750 x 750 pixel image by default
      $scope.resolution = 0; // use resolution 0 by default

      var xmid = ($scope.projinfo.dataset.imagesize[0][0] - $scope.projinfo.dataset.offset[0][0]) / 2;
      $scope.xmin = Math.round(xmid - 375);
      $scope.xmax = Math.round(xmid + 375);

      var ymid = ($scope.projinfo.dataset.imagesize[0][1] - $scope.projinfo.dataset.offset[0][1]) / 2;
      $scope.ymin = Math.round(ymid - 375);
      $scope.ymax = Math.round(ymid + 375);

      $scope.zidx = $scope.projinfo.dataset.offset[0][2];

      $scope.reloadImage();

    })
  });

  $scope.reloadImage = function() {
    $scope.imgUrl = server + 'ocp/ca/' + $scope.token + '/' + $scope.channel + '/xy/' + $scope.resolution + '/' + $scope.xmin + ',' + $scope.xmax + '/' + $scope.ymin + ',' + $scope.ymax + '/' + $scope.zidx + '/';
  }

  $scope.applyWindow = function() {
    $scope.imgUrl = server + 'ocp/ca/' + $scope.token + '/' + $scope.channel + '/xy/' + $scope.resolution + '/' + $scope.xmin + ',' + $scope.xmax + '/' + $scope.ymin + ',' + $scope.ymax + '/' + $scope.zidx + '/window/' + $scope.min + ',' + $scope.max + '/';
  }

  $scope.$on('channel', function(event, data) {
    $scope.channel = data;
  });

  // these functions receive propagated values from the percent slider
  $scope.$on('max', function(event, data) {
    $scope.max = data;
    $scope.updateWindowSlider();
  });
  $scope.$on('min', function(event, data) {
    $scope.min = data;
    $scope.updateWindowSlider();
  });

  $scope.updateWindowSlider = function() {
    updateWindowSliderMax($scope.max);
    updateWindowSliderMin($scope.min);
  }

  // this function is for updating the scope variables when the slider is moved
  $scope.updateWindow = function(min, max) {
    $scope.max = max;
    $scope.min = min;
    $scope.$digest();
  }
}]);
