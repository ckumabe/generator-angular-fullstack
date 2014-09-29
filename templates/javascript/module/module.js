'use strict'

angular.module('<%= classedName %>Mod',[])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/<%= cameledName %>', {
        templateUrl: '/scripts/modules/<%= name %>/templates/<%= slugName %>.tmpl.html',
        controller: '<%= classedName %>Ctrl'
      });
  })
  .controller('<%= classedName %>Ctrl', ['$scope', function($scope){
    
  }]);