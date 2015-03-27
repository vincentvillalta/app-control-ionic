angular.module('DicormoApp')
    .filter('ago', function () {
        return function (value) {

            return moment(value,['ddd MMM DD HH:mm:ss ZZ YYYY',
                'YYYY-MM-DD hh:mm Z'],'es').fromNow();
        }
    })
    .filter('unsafe', function ($sce) {
        return $sce.trustAsHtml;
    })
    .filter('hash_facebook', function($sce,$filter){
        return function (value, target) {
            if(!value) return value;

            var replaced = $filter('linky')(value,target);
            var targetAttr = "";
            if (angular.isDefined(target)) {
                targetAttr = ' target="' + target + '"';
            }
            var pattern = /(^|\s)#(\w*[a-zA-Z_]+\w*)/gim;

            replaced = value.replace(pattern,
                '$1<a href="https://www.facebook.com/hashtag/$2"'
                + targetAttr + '>#$2</a>');
            return $sce.trustAsHtml(replaced);
        }
    })
    .filter('hash_twitter', function($sce,$filter){
        return function (value, target) {
            if(!value) return value;

            var replaced = $filter('linky')(value,target);
            var targetAttr = "";
            if (angular.isDefined(target)) {
                targetAttr = ' target="' + target + '"';
            }
            var pattern = /(^|\s)#(\w*[a-zA-Z_]+\w*)/gim;

            replaced = value.replace(pattern,
                '$1<a class="link-in-app" href="https://twitter.com/search?q=%23$2"' + targetAttr + ' >#$2</a>');
            return $sce.trustAsHtml(replaced);

           /*replaced = value.replace(pattern,
                '$1 <a onclick="window.open("https://twitter.com/search?q=%23$2", "_system", "location=yes"); return false;">#$2</a>');
            return $sce.trustAsHtml(replaced);*/
        }
    });

