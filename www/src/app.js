angular.module('DicormoApp', ['ionic', 'ngResource', 'ngMessages', 'ngRoute', 'angular-jwt', 'angular-storage', 'ngCordova' ])
  .run(function ($ionicPlatform,$ionicPopup) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }

        if (window.Connection) {
          if (navigator.connection.type == Connection.NONE) {
            $ionicPopup.confirm({
              title: "Sin conexión",
              content: "El Internet está desconectado en su dispositivo."
            })
              .then(function (result) {
                if (result) {
                  ionic.Platform.exitApp();
                }
              });
          }
        }
      }
    )
    ;
  })
.constant('CONFIG', {
    APIURL: "http://104.236.42.145/app"
})
  .config(['$urlRouterProvider', '$stateProvider', '$httpProvider', function ($urlRouterProvider, $stateProvider, $httpProvider) {

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'views/home/home.html',
        controller:'HomeCtrl'
      })
      .state('home.slide', {
        url: '/slide',
        templateUrl: 'views/home/slide.html'
      })
      .state('home.feed', {
        url: '/feed',
        templateUrl: 'views/home/feed.html',
        controller: 'FeedCtrl'
      })
      .state('home.post', {
        url: '/post/:id',
        templateUrl: 'views/home/post.html',
        controller: 'PostCtrl'
      })
      .state('home.login', {
        url: '/login',
        templateUrl: 'views/home/login.html',
        controller: 'LoginCtrl'
      })
      .state('home.logout', {
        url: '/logout',
        templateUrl: 'views/home/login.html',
        controller: 'LogOutCtrl'
      })
      .state('home.student', {
          url: '/student',
          templateUrl: 'views/home/student.html',
          controller: 'StudentCtrl'
      })
      .state('home.schedule', {
        url: '/schedule',
        templateUrl: 'views/home/schedule.html',
        controller: 'ScheduleCtrl'
      })
      .state('home.assistance', {
        url: '/assistance/:id',
        templateUrl: 'views/home/assistance.html',
        controller: 'AssistencesCtrl'
      })
      .state('home.evaluation', {
        url: '/evaluation/:id',
        templateUrl: 'views/home/evaluation.html',
        controller: 'EvalCtrl'
      })
      .state('home.class', {
        url: '/class/:id',
        templateUrl: 'views/home/clase.html',
        controller: 'ClassesCtrl'
      })
      .state('home.edit', {
        url: '/edit',
        templateUrl: 'views/home/editStudent.html',
        controller: 'EditStudentCtrl'
      })
      .state('home.editTeacher', {
        url: '/editTeacher',
        templateUrl: 'views/home/editTeacher.html',
        controller: 'EditTeacherCtrl'
      })
      .state('home.score', {
        url: '/score',
        templateUrl: 'views/home/score.html'
      })
      .state('home.teacher', {
        url: '/teacher',
        templateUrl: 'views/home/teacher.html',
        controller: 'TeacherCtrl'
      })
      .state('home.before_score', {
        url: '/before_score',
        templateUrl: 'views/home/before_score.html',
        controller: 'BeforeScoreCtrl'
      })
      .state('home.studentScore', {
        url: '/studentScore/:mes/:num',
        templateUrl: 'views/home/score.html',
        controller: 'StudentScoreCtrl'
      })
      .state('home.changePicture', {
        url: '/changePicture',
        templateUrl: 'views/home/changePicture.html',
        controller: 'ChangePictureCtrl'
      })

    ;


    $urlRouterProvider.otherwise('/home/slide');

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

  }]);
