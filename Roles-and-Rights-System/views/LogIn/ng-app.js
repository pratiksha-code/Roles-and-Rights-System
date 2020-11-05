const app = angular.module("userLoginApp", ['ngMessages']);

app.controller("userLoginAppCtrlr", ["$scope", "$window", "$http", function ($scope, $window, $http) {
    //Method To Log In User
    $scope.logInUser = function () {
        $http.post('/login', $scope.data).then(function (response) {
            if(response.status === 200){
                $scope.errorMessage = response.data.message;
            }else if(response.status === 201){
                $window.location = response.data.url;
            }else if(response.status === 500){
                alertify.alert("Something Went Wrong While Log In");
            }
        })
    }
}]);