angular.module('DicormoApp')
  .controller('LoginCtrl', ['$scope', '$ionicLoading', 'AuthService','CONFIG', 'jwtHelper', 'store', '$location', function ($scope, $ionicLoading, AuthService, CONFIG, jwtHelper, store, $location) {
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
                  $location.path("/home/student");
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
        $scope.user = tokenPayload;
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
