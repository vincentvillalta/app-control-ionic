angular.module('DicormoApp')
  .controller('LoginCtrl', ['$scope', '$ionicLoading', 'AuthService','CONFIG', 'jwtHelper', 'store', '$location', '$stateParams', '$cordovaCamera',  function ($scope, $ionicLoading, AuthService, CONFIG, jwtHelper, store, $location, $stateParams, $cordovaCamera) {
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
                  store.set('rol_id', res.data.user.rol_id);
                  console.log(res.data.user.rol_id);
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

    .controller('StudentCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', 'studentFactory', '$ionicLoading',function($scope, CONFIG, jwtHelper, store, studentFactory, $ionicLoading)
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
        $scope.rol = store.get("rol_id");
        $scope.$apply()
        console.log(user);


    }])

    .controller('ChangePictureCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', 'studentFactory', '$cordovaCamera', 'PostPicture','$ionicLoading', '$cordovaFileTransfer', function($scope, CONFIG, jwtHelper, store, studentFactory, $cordovaCamera, PostPicture, $ionicLoading, $cordovaFileTransfer)
    {    
        var user = store.get("user");
        $scope.user = store.get("user");
        $scope.$apply()
        $scope.takePic = function() {
            console.log("camara")
              var options = { 
              quality : 40, 
              destinationType : Camera.DestinationType.FILE_URI, 
              sourceType : Camera.PictureSourceType.CAMERA, 
              allowEdit : true,
              encodingType: Camera.EncodingType.JPEG,
              targetWidth: 100,
              targetHeight: 100,
              popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: false
          };

          $cordovaCamera.getPicture(options).then(function(imageData) {
              $scope.image = imageData;
              $scope.picData = "data:image/jpeg;base64," +imageData;
              $scope.$apply();
          }, function(err) {
              // An error occured. Show a message to the user
          });
        }

        $scope.takeGal = function() {
          console.log('galeria')
            var options = { 
              quality : 40, 
              destinationType : Camera.DestinationType.FILE_URI, 
              sourceType : Camera.PictureSourceType.PHOTOLIBRARY, 
              allowEdit : true,
              encodingType: Camera.EncodingType.JPEG,
              targetWidth: 100,
              targetHeight: 100,
              popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: false
          };

          $cordovaCamera.getPicture(options).then(function(imageData) {
              $scope.image = imageData;
              $scope.picData = "data:image/jpeg;base64," +imageData;
              $scope.$apply();
          }, function(err) {
              // An error occured. Show a message to the user
          });
        }


          $scope.doUpload = function() {
            var myImg = $scope.image;
            var user = store.get("user");
            var kind;
            var rol_id = store.get("rol_id");
            if (rol_id == 3) {
              kind = "teacher"
            }else{
              kind = "student"
            }
            console.log(myImg)
            var url = encodeURI('http://104.236.42.145/app/'+kind+'/'+id+'/updatephoto')
           $ionicLoading.show({template: 'Cargando...'});
            var ft = new $cordovaFileTransfer(), 
            options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = 'filename.jpg'; // We will use the name auto-generated by Node at the server side.
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            options.params = { // Whatever you populate options.params with, will be available in req.body at the server-side.
                "description": "Uploaded from my phone"
            };
            console.log(ft)
            console.log(options)
            ft.upload(myImg, url,
                function (e) {
                    $ionicLoading.hide();
                    alert("Upload completed");
                },
                function (e) {
                    $ionicLoading.hide();
                    alert("Upload failed");
                }, options);



           //  PostPicture.update(user.id, kind, myImg)
           //  .then(function (res){
           //    console.log(res)
           //    if (res.data && res.statusText == 'OK') {
           //        $ionicLoading.hide();
           //        $scope.picData = '';
           //        $scope.$apply();
           //    };
           //  })
        }
        
    }])

    .controller('LogOutCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', 'studentFactory', function($scope, CONFIG, jwtHelper, store, studentFactory)
    {    
        store.remove("user");
        store.remove("rol_id");
        $scope.$apply()
    }])

    .controller('ScheduleCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', 'studentFactory','$ionicLoading', function($scope, CONFIG, jwtHelper, store, studentFactory, $ionicLoading)
    {
        
        var user = store.get("user");
        var $http = angular.injector(['ng']).get('$http');
        var url = 'http://104.236.42.145/app/student/' +user.id+'/schedule/'+user.horario.id
        console.log(url)
        var semaphore = false;
        $ionicLoading.show({template: 'Cargando...'});
        $http.get(url).
          success(function(data, status, headers, config) {
            console.log(data);
            $ionicLoading.hide();
            $scope.schedule = data;
            $scope.user = store.get("user");
            $scope.$apply()
          }).
          error(function(data, status, headers, config) {
          console.log(headers);
        });




    }])

    .controller('ClassesCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', '$stateParams', '$ionicLoading',function($scope, CONFIG, jwtHelper, store, $stateParams, $ionicLoading)
    {
        
        var user = store.get("user");
        var $http = angular.injector(['ng']).get('$http');
        var clases  = $stateParams.id;
        $ionicLoading.show({template: 'Cargando...'});
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
            $ionicLoading.hide();
            $scope.$apply()
          }).
          error(function(data, status, headers, config) {
          console.log(headers);
        });
    }])

    .controller('BeforeScoreCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', '$stateParams', '$ionicLoading', function($scope, CONFIG, jwtHelper, store, $stateParams, $ionicLoading)
    {
        
        var user = store.get("user");
        var $http = angular.injector(['ng']).get('$http');
        var clases  = $stateParams.id;
        $ionicLoading.show({template: 'Cargando...'});
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
            $ionicLoading.hide();
            $scope.preEvaluations = data;
            $scope.user = store.get("user");
            $scope.$apply()
          }).
          error(function(data, status, headers, config) {
          console.log(headers);
        });
    }])

    .controller('StudentScoreCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', '$stateParams','$ionicLoading', function($scope, CONFIG, jwtHelper, store, $stateParams, $ionicLoading)
    {
        
        var user = store.get("user");
        var $http = angular.injector(['ng']).get('$http');
        var mes  = $stateParams.mes;
        var num = $stateParams.num;
        $ionicLoading.show({template: 'Cargando...'});
        var url = 'http://104.236.42.145/app/student/'+user.id+'/calificaciones/'+mes+'/no/'+num
        console.log(url)
        $http.get(url).
          success(function(data, status, headers, config) {
            console.log(data);
            $ionicLoading.hide();
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
    .controller('EditTeacherCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', '$stateParams','$ionicLoading', 'UpdateTeacherService', function($scope, CONFIG, jwtHelper, store, $stateParams, $ionicLoading, UpdateService)
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

    .controller('AssistencesCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', '$stateParams', '$ionicLoading','DoSendAssistance', function($scope, CONFIG, jwtHelper, store, $stateParams, $ionicLoading, DoSendAssistance)
    {
        
        var user = store.get("user");
        var $http = angular.injector(['ng']).get('$http');
        var clases  = $stateParams.id;
        $ionicLoading.show({template: 'Cargando...'});
        var url = 'http://104.236.42.145/app/teacher/'+user.id+'/clases/'+clases+'/asistencias'
        console.log(url)
        $http.get(url).
          success(function(data, status, headers, config) {
            console.log(data);
            $ionicLoading.hide();
            $scope.assistances = data;
            $scope.formData = {"date":data.dia.id};
            $scope.date = data.dia.work_date;
            $scope.user = store.get("user");
            $scope.$apply()
          }).
          error(function(data, status, headers, config) {
          console.log(headers);
        });

        $scope.sendAssistance = function(data, clase_id, teacher_id) {
          console.log('Data: '+data)
          console.log(teacher_id)
          $ionicLoading.show({template: 'Cargando...'});
          DoSendAssistance.update(data, clase_id, teacher_id)
          .then(function (res){
            if (res.data && res.statusText == 'OK') {
                $ionicLoading.hide();
            };
          })
        }

    }])

    .controller('EvalCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', '$stateParams', '$ionicLoading', 'DoSendEvaluation',function($scope, CONFIG, jwtHelper, store, $stateParams, $ionicLoading, DoSendEvaluation)
    {
        
        var user = store.get("user");
        var $http = angular.injector(['ng']).get('$http');
        var clases  = $stateParams.id;
        $ionicLoading.show({template: 'Cargando...'});
        var url = 'http://104.236.42.145/app/teacher/'+user.id+'/clases/'+clases+'/evaluaciones'
        console.log(url)
        $http.get(url).
          success(function(data, status, headers, config) {
            console.log(data);
            $ionicLoading.hide();
            $scope.evaluation = data;
            $scope.user = store.get("user");
            $scope.$apply()
          }).
          error(function(data, status, headers, config) {
          console.log(headers);
        });

        $scope.sendEvaluations = function(data, clase_id, teacher_id) {
          console.log('Data: '+data)
          $ionicLoading.show({template: 'Cargando...'});
          DoSendEvaluation.update(data, clase_id, teacher_id)
          .then(function (res){
            if (res.data && res.statusText == 'OK') {
                $ionicLoading.hide();
            };
          })
        }
    }])

    .controller('TeacherCtrl', ['$scope','CONFIG', 'jwtHelper', 'store', 'studentFactory', '$ionicLoading',function($scope, CONFIG, jwtHelper, store, studentFactory, $ionicLoading)
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


