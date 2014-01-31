var gedcomTreeApp = angular.module('gedcomTreeApp', []);
 
gedcomTreeApp.controller('GedcomTreeCtrl', function ($scope, $http) {
  var filename = 'test/head.ged';
  $http.get(filename, {responseType: "arraybuffer"}).success(function(data) {
    GedcomTree.parse(data, function(parsed) {
      $scope.gedcom.filename = filename;
      $scope.gedcom.version = parsed.HEAD.GEDC.VERS.value;
      $scope.gedcom.source = parsed.HEAD.SOUR.NAME.value;
    });
  });

  $scope.gedcom = {
  };
});
