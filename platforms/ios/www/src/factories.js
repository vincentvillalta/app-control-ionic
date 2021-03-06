angular.module('DicormoApp')

    .factory("AuthService", ["$http", "$q", "CONFIG", function($http, $q, CONFIG)
    {
        return {
            login: function(user)
            {
                var deferred;
                deferred = $q.defer();
                $http({
                    method: 'POST',
                    skipAuthorization: true,//no queremos enviar el token en esta petición
                    url: CONFIG.APIURL+'/login/auth',
                    data: "email=" + user.email + "&password=" + user.password,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                    .then(function(res)
                    {
                        deferred.resolve(res);
                    })
                    .then(function(error)
                    {
                        deferred.reject(error);
                    })
                return deferred.promise;
            }
        }
    }])
    .factory("studentFactory", ["$http", "$q", "CONFIG", function($http, $q, CONFIG)
    {
        return{
            get: function()
            {
                var deferred;
                deferred = $q.defer();
                $http({
                    method: 'GET',
                    skipAuthorization: false,//es necesario enviar el token
                    url: CONFIG.APIURL+'/student/2'
                })
                    .then(function(res)
                    {
                        deferred.resolve(res);
                    })
                    .then(function(error)
                    {
                        deferred.reject(error);
                    })
                return deferred.promise;
            }
        }
    }])
    .factory("UpdateService", ["$http", "$q", "CONFIG", function($http, $q, CONFIG)
    {
        return {
            update: function(user)
            {

                var deferred;
                deferred = $q.defer();
                $http({
                    method: 'PUT',
                    skipAuthorization: true,//no queremos enviar el token en esta petición
                    url: CONFIG.APIURL+'/student/'+user.id+'/edit',
                    data: "name=" + user.name + "&last_name=" + user.last_name + "&email=" + user.email+ "&address=" + user.address+ "&phone=" + user.phone+ "&cellphone=" + user.cellphone,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                    .then(function(res)
                    {
                        deferred.resolve(res);
                    })
                    .then(function(error)
                    {
                        deferred.reject(error);
                    })
                return deferred.promise;
            }
        }
    }])

    .factory("PostPicture", ["$http", "$q", "CONFIG",'$cordovaFileTransfer', function($http, $q, CONFIG, $cordovaFileTransfer)
    {
        return {
            update: function(id, kind, photo)
            {
                console.log("URL ----> "+CONFIG.APIURL+'/'+kind+'/'+id+'/updatephoto');
                var url = CONFIG.APIURL+'/'+kind+'/'+id+'/updatephoto';

                var deferred;
                deferred = $q.defer();

                var ft = new FileTransfer(), 
                options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = 'filename.jpg'; // We will use the name auto-generated by Node at the server side.
                options.mimeType = "image/jpeg";
                options.chunkedMode = false;
                options.params = { // Whatever you populate options.params with, will be available in req.body at the server-side.
                    "description": "Uploaded from my phone"
                };
                
                $http({
                    method: 'POST',
                    skipAuthorization: true,//no queremos enviar el token en esta petición
                    url: CONFIG.APIURL+'/'+kind+'/'+id+'/updatephoto',
                    data: "photo=" + photo,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                    .then(function(res)
                    {
                        console.log(res)
                        deferred.resolve(res);
                    })
                    .then(function(error)
                    {
                         console.log(error)
                        deferred.reject(error);
                    })
                return deferred.promise;
            }
        }
    }])
    .factory("UpdateTeacherService", ["$http", "$q", "CONFIG", function($http, $q, CONFIG)
    {
        return {
            update: function(user)
            {

                var deferred;
                deferred = $q.defer();
                $http({
                    method: 'PUT',
                    skipAuthorization: true,//no queremos enviar el token en esta petición
                    url: CONFIG.APIURL+'/teacher/'+user.id+'/edit',
                    data: "name=" + user.name + "&last_name=" + user.last_name + "&email=" + user.email+ "&address=" + user.address+ "&phone=" + user.phone+ "&cellphone=" + user.cellphone,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                    .then(function(res)
                    {
                        deferred.resolve(res);
                    })
                    .then(function(error)
                    {
                        deferred.reject(error);
                    })
                return deferred.promise;
            }
        }
    }])
    .factory("DoSendAssistance", ["$http", "$q", "CONFIG", function($http, $q, CONFIG)
    {
        return {
            update: function(dataToSend, clase_id, teacher_id)
            {
                var deferred;
                deferred = $q.defer();
                console.log('URL ---> '+CONFIG.APIURL+'/teacher/'+teacher_id+'/clases/'+clase_id+'/asistencias')
                console.log('dataToSend ---> '+JSON.stringify(dataToSend))
                $http({
                    method: 'POST',
                    skipAuthorization: true,//no queremos enviar el token en esta petición
                    url: CONFIG.APIURL+'/teacher/'+teacher_id+'/clases/'+clase_id+'/asistencias',
                    data: "data=" + JSON.stringify(dataToSend),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                    .then(function(res)
                    {
                        deferred.resolve(res);
                    })
                    .then(function(error)
                    {
                        deferred.reject(error);
                    })
                return deferred.promise;
            }
        }
    }])

    .factory("DoSendEvaluation", ["$http", "$q", "CONFIG", function($http, $q, CONFIG)
    {
        return {
            update: function(dataToSend, clase_id, teacher_id)
            {
                var deferred;
                deferred = $q.defer();
                console.log('URL ---> '+CONFIG.APIURL+'/teacher/'+teacher_id+'/clases/'+clase_id+'/evaluation')
                console.log('dataToSend ---> '+JSON.stringify(dataToSend))

                $http({
                    method: 'POST',
                    skipAuthorization: true,//no queremos enviar el token en esta petición
                    url: CONFIG.APIURL+'/teacher/'+teacher_id+'/clases/'+clase_id+'/evaluation',
                    data: "data=" + JSON.stringify(dataToSend),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                    .then(function(res)
                    {
                        deferred.resolve(res);
                    })
                    .then(function(error)
                    {
                        deferred.reject(error);
                    })
                return deferred.promise;
            }
        }
    }])


  .factory('Blog', ['$resource', function ($resource) {
    return $resource('http://dicormo.com/wp-json/posts/:id?filter[posts_per_page]=3', {id: '@id'});
  }])
  .factory('Twitter', ['$http', function ($http) {
    var url = 'http://104.236.42.145/app/twitter';
    return {
      get: function (callback) {
        $http.get(url).success(function (data) {
          callback(data);
        });
      }
    };
  }])
  .factory('Facebook', ['$http', function ($http) {
    var url = 'http://104.236.42.145/app/facebook';
    return {
      get: function (callback) {
        $http.get(url).success(function (data) {
          callback(data);
        });
      }
    };
  }]);