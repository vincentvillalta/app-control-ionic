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
                  console.log(res.data);
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
        $scope.$apply()


        

    }])
    .controller('HomeCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', 'studentFactory', function($scope, CONFIG, jwtHelper, store, studentFactory)
    {    
        var user = store.get("user");
        $scope.user = store.get("user");
        $scope.$apply()
        console.log(user);
    }])

    .controller('ScheduleCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', 'studentFactory', function($scope, CONFIG, jwtHelper, store, studentFactory)
    {
        
        var user = store.get("user");
        var $http = angular.injector(['ng']).get('$http');
        var url = 'http://104.236.42.145/app/student/' +user.id+'/schedule/'+user.horario.id
        console.log(url)
        var semaphore = false;
        
        $http.get(url).
          success(function(data, status, headers, config) {
            console.log(data);
            $scope.schedule = data;
            $scope.user = store.get("user");
            $scope.$apply()
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
        console.log(url)
        $http.get(url).
          success(function(data, status, headers, config) {
            console.log(data);
            var checkURL = 'http://104.236.42.145/app/dateScore';
              $http.get(checkURL).success(function(response, statusCheck, headersCheck, configCheck) {
                var startDate = response.enable_date_start_score;
                var endDate = response.enable_date_end_score;
                var today = Date.now();
                if (startDate <= today && today <= endDate) { $scope.active = 'yes' }else{ $scope.active = 'no' }
              }).error(function(response, statusCheck, headersCheck, configCheck) {console.log(headers)});
            $scope.clases = data;
            $scope.user = store.get("user");
            $scope.$apply()
          }).
          error(function(data, status, headers, config) {
          console.log(headers);
        });
    }])

    .controller('BeforeScoreCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', '$stateParams', function($scope, CONFIG, jwtHelper, store, $stateParams)
    {
        
        var user = store.get("user");
        var $http = angular.injector(['ng']).get('$http');
        var clases  = $stateParams.id;
        var url = 'http://104.236.42.145/app/student/'+user.id+'/evaluaciones'
        console.log(url)
        $scope.toggleGroup = function(group) {
          console.log("call")
          if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
          } else {
            $scope.shownGroup = group;
          }
        };
        $scope.isGroupShown = function(group) {
          return $scope.shownGroup === group;
        };
        $http.get(url).
          success(function(data, status, headers, config) {
            console.log(data);
            $scope.preEvaluations = data;
            $scope.user = store.get("user");
            $scope.$apply()
          }).
          error(function(data, status, headers, config) {
          console.log(headers);
        });
    }])

    .controller('StudentScoreCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', '$stateParams', function($scope, CONFIG, jwtHelper, store, $stateParams)
    {
        
        var user = store.get("user");
        var $http = angular.injector(['ng']).get('$http');
        var mes  = $stateParams.mes;
        var num = $stateParams.num;
        var url = 'http://104.236.42.145/app/student/'+user.id+'/calificaciones/'+mes+'/no/'+num
        console.log(url)
        $http.get(url).
          success(function(data, status, headers, config) {
            console.log(data);
            $scope.calificacionesStudent = data;
            $scope.user = store.get("user");
            $scope.$apply()
          }).
          error(function(data, status, headers, config) {
          console.log(headers);
        });
    }])

    .controller('EditStudentCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', '$stateParams','$ionicLoading', 'UpdateService', function($scope, CONFIG, jwtHelper, store, $stateParams, $ionicLoading, UpdateService)
    {
        
        $scope.user = store.get("user");
        $scope.$apply()

        $scope.updateStudent = function(form) {
          if(form.$valid) {
            $scope.doUpdate($scope.user);
          }
        };
        
        $scope.doUpdate = function(user) {
          $ionicLoading.show({template: 'Cargando...'});
          UpdateService.update($scope.user)
          .then(function (res){
            if (res.data && res.statusText == 'OK') {
                $ionicLoading.hide();
                store.set('user', user);
            };
          })
        }
    }])
    .controller('EditTeacherCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', '$stateParams','$ionicLoading', 'UpdateService', function($scope, CONFIG, jwtHelper, store, $stateParams, $ionicLoading, UpdateService)
    {
        
        $scope.user = store.get("user");
        $scope.$apply()

        $scope.updateTeacher = function(form) {
          if(form.$valid) {
            $scope.doUpdate($scope.user);
          }
        };
        
        $scope.doUpdate = function(user) {
          $ionicLoading.show({template: 'Cargando...'});
          UpdateTeacherService.update($scope.user)
          .then(function (res){
            if (res.data && res.statusText == 'OK') {
                $ionicLoading.hide();
                store.set('user', user);
            };
          })
        }
    }])

    .controller('AssistencesCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', '$stateParams', function($scope, CONFIG, jwtHelper, store, $stateParams)
    {
        
        var user = store.get("user");
        var $http = angular.injector(['ng']).get('$http');
        var clases  = $stateParams.id;
        var url = 'http://104.236.42.145/app/teacher/'+user.id+'/clases/'+clases+'/asistencias'
        console.log(url)
        $http.get(url).
          success(function(data, status, headers, config) {
            console.log(data);
            $scope.assistances = data;
            $scope.user = store.get("user");
            $scope.$apply()
          }).
          error(function(data, status, headers, config) {
          console.log(headers);
        });
    }])

    .controller('EvalCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', '$stateParams', function($scope, CONFIG, jwtHelper, store, $stateParams)
    {
        
        var user = store.get("user");
        var $http = angular.injector(['ng']).get('$http');
        var clases  = $stateParams.id;

        var url = 'http://104.236.42.145/app/teacher/'+user.id+'/clases/'+clases+'/evaluaciones'
        console.log(url)
        $http.get(url).
          success(function(data, status, headers, config) {
            console.log(data);
            $scope.evaluation = data;
            $scope.user = store.get("user");
            $scope.$apply()
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
  }])
  .controller('ListCtrl', function($scope) {
  $scope.groups = [];
  for (var i=0; i<3; i++) {
    $scope.groups[i] = {
      name: i,
      items: []
    };
    for (var j=0; j<3; j++) {
      $scope.groups[i].items.push(i + '-' + j);
    }
  }
  
  
  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    console.log("call")
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  
});


