var gedcomTreeApp = angular.module('gedcomTreeApp', []);
 
gedcomTreeApp.controller('GedcomTreeCtrl', function ($scope, $http) {
  var filename = 'test/head.ged';
  function parseGedcom(filename, data, scope) {
    GedcomTree.parse(data, function(parsed) {
      scope.gedcom.filename = filename;
      scope.gedcom.version = parsed.HEAD.GEDC.VERS.value;
      scope.gedcom.source = parsed.HEAD.SOUR.NAME.value;
    });
  }

  $http.get(filename, {responseType: "arraybuffer"}).success(function(data) {
    parseGedcom(filename, data, $scope);
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
          $scope.$apply(function(scope) {
            parseGedcom($scope.file.name, reader.result, scope);
          });
        };
        reader.readAsArrayBuffer($scope.file);
      }
    });
  };

});
