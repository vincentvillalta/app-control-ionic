angular.module('DicormoApp')
  .controller('LoginCtrl', ['$scope', '$ionicLoading', 'AuthService','CONFIG', 'jwtHelper', 'store', '$location', '$stateParams', function ($scope, $ionicLoading, AuthService, CONFIG, jwtHelper, store, $location, $stateParams) {
    var _form = null;
    $scope.credentials = {
      username: '',
      password : ''
    };
    $scope.credentialsDefault = {
      username: '',
      password : ''
    };


    $scope.login = function(form) {
      _form = form;
      if(form.$valid) {
        $scope.doLogin();
      }
    };

    $scope.doLogin = function(user) {
      $ionicLoading.show({template: 'Cargando...'});
      AuthService.login($scope.credentials)
        .then(function ( res ) {
              $ionicLoading.hide();
              if(res.data && res.data.code == 0)
              {
                  store.set('token', res.data.response.token);
                  console.log(res.data.user);
                  if (res.data.user.rol_id == 4) {
                    var $http = angular.injector(['ng']).get('$http');
                    var url = 'http://104.236.42.145/app/student/' +res.data.user.id_member
                    console.log(url);
                    $http.get(url).
                    success(function(data, status, headers, config) {
                      $scope.posts = data;
                      console.log(data);
                      store.set('user', data);
                    }).
                    error(function(data, status, headers, config) {
                      console.log(headers);
                    });
                    $location.path("/home/student");
                  }else if (res.data.user.rol_id == 3){
                    var $http = angular.injector(['ng']).get('$http');
                    var url = 'http://104.236.42.145/app/teacher/' +res.data.user.id
                    console.log(url);
                    $http.get(url).
                    success(function(data, status, headers, config) {
                      $scope.posts = data;
                      console.log(data);
                      store.set('user', data);
                    }).
                    error(function(data, status, headers, config) {
                      console.log(headers);
                    });

                    var classes_url =  'http://104.236.42.145/app/teacher/'+res.data.user.id+'/clases'
                    $http.get(classes_url).
                    success(function(data, status, headers, config) {
                      $scope.posts = data;
                      console.log(data);
                      store.set('clases', data);
                    }).
                    error(function(data, status, headers, config) {
                      console.log(headers);
                    });



                    $location.path("/home/teacher");
                  }else{
                    $location.path("/home/login");
                  }
              }

              if(res.data && res.data.code==1){
                  alert('Error al ingresar, intenta nuevamente');
                  $ionicLoading.hide();
                  _form.$setPristine();
                  $scope.credentials = $scope.credentialsDefault;
              }
        })
    }

  }])

    .controller('StudentCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', 'studentFactory', function($scope, CONFIG, jwtHelper, store, studentFactory)
    {
        //obtenemos el token en localStorage
        var token = store.get("token");
        //decodificamos para obtener los datos del user
        var tokenPayload = jwtHelper.decodeToken(token);
        //los mandamos a la vista como user
        $scope.user = store.get("user");
        $scope.getStudent = function()
        {
            studentFactory.get().then(function(res)
            {
                if(res.data && res.data.code == 0)
                {
                    store.set('token', res.data.response.token);
                    $scope.student = res.data.response.student;
                }
            });
        }
    }])

    .controller('ScheduleCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', 'studentFactory', function($scope, CONFIG, jwtHelper, store, studentFactory)
    {
        
        var user = store.get("user");
        var $http = angular.injector(['ng']).get('$http');
        var url = 'http://104.236.42.145/app/student/' +user.id+'/schedule/'+user.horario.id


        
        $http.get(url).
          success(function(data, status, headers, config) {
            console.log(data);
            $scope.schedule = data;
            $scope.user = store.get("user");
          }).
          error(function(data, status, headers, config) {
          console.log(headers);
        });
    }])

    .controller('ClassesCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', '$stateParams', function($scope, CONFIG, jwtHelper, store, $stateParams)
    {
        
        var user = store.get("user");
        var $http = angular.injector(['ng']).get('$http');
        var clases  = $stateParams.id;
         var url = 'http://104.236.42.145/app/teacher/'+user.id+'/clases/'+clases
        
        $http.get(url).
          success(function(data, status, headers, config) {
            console.log(data);
            $scope.clases = data;
            $scope.user = store.get("user");
          }).
          error(function(data, status, headers, config) {
          console.log(headers);
        });
    }])

    .controller('TeacherCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', 'studentFactory', function($scope, CONFIG, jwtHelper, store, studentFactory)
    {
        //obtenemos el token en localStorage
        var token = store.get("token");
        //decodificamos para obtener los datos del user
        var tokenPayload = jwtHelper.decodeToken(token);
        //los mandamos a la vista como user
        $scope.user = store.get("user");
        $scope.clases = store.get("clases");
        $scope.getStudent = function()
        {
            studentFactory.get().then(function(res)
            {
                if(res.data && res.data.code == 0)
                {
                    store.set('token', res.data.response.token);
                    $scope.student = res.data.response.student;
                }
            });
        }
    }])

  .controller('FeedCtrl', ['$scope', 'Twitter', 'Facebook', 'Blog', function ($scope, Twitter, Facebook, Blog) {
    $scope.tweets = [];
    $scope.statuses = [];

    Twitter.get(function (data) {
      $scope.tweets = data;
    });

    Facebook.get(function (data) {
      $scope.statuses = data;
    });

    $scope.posts = Blog.query();

  }])
  .controller('PostCtrl', ['$scope', '$stateParams', 'Blog', function ($scope, $stateParams, Blog) {
    var postId = $stateParams.id;
    var post = Blog.get({id: postId}, function () {
      $scope.post = post;
    });
  }]);
