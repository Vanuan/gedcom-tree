var gedcomTreeApp = angular.module('gedcomTreeApp', []);
 
gedcomTreeApp.controller('GedcomTreeCtrl', function ($scope, $http) {
  var filename = 'test/head.ged',
      parseGedcom = function(data) {
    GedcomTree.parse(data, function(parsed) {
      $scope.gedcom.filename = filename;
      $scope.gedcom.version = parsed.HEAD.GEDC.VERS.value;
      $scope.gedcom.source = parsed.HEAD.SOUR.NAME.value;
    });
  };

  $http.get(filename, {responseType: "arraybuffer"}).success(function(data) {
    parseGedcom(data);
  });

  $scope.gedcom = {
  };

  $scope.setFiles = function(element) {
    var reader = new FileReader();
    $scope.$apply(function(scope) {
      if (element.files.length > 0) {
        $scope.file = element.files[0];
        console.log('files:', $scope.file);
        reader.onload = function() {
          parseGedcom(reader.result);
        };
        reader.readAsArrayBuffer($scope.file);
      }
    });
  };

});
