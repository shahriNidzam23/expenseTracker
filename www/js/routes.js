angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  
      .state('config', {
    url: '/config',
        templateUrl: 'templates/config.html',
        controller: 'configCtrl'
  })

      .state('tabsController.home', {
    url: '/page2',
    views: {
      'tab1': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('tabsController.history', {
    url: '/page3',
    views: {
      'tab2': {
        templateUrl: 'templates/history.html',
        controller: 'historyCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.addNewPage', {
    url: '/page4',
    views: {
      'tab1': {
        templateUrl: 'templates/addNewPage.html',
        controller: 'addNewPageCtrl'
      }
    }
  })

  .state('tabsController.planner', {
    url: '/page5',
    views: {
      'tab4': {
        templateUrl: 'templates/planner.html',
        controller: 'plannerCtrl'
      }
    }
  })

    .state('tabsController.plannerEdit', {
    url: '/page7',
    views: {
      'tab4': {
        templateUrl: 'templates/plannerEdit.html',
        controller: 'plannerEditCtrl'
      }
    }
  })

  .state('tabsController.category', {
    url: '/page6',
    views: {
      'tab3': {
        templateUrl: 'templates/category.html',
        controller: 'categoryCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/page1/page2')

  

});