const app = angular.module("userRegistrationApp", ['ngMessages']);

app.controller("userRegistrationAppCtrlr", ["$scope", "$window", "$http", function ($scope, $window, $http) {

    //Method To Get Departments List For Drop Down
    $scope.getDropDownList = function () {
        $http.get('/getDepartmentListForDropDown').then(function (response) {
            if (response.status === 500)
                alertify.error("Something Went Wrong While Getting Departments List");
            else {
                $scope.departments = response.data;
            }
        })
    };

    //Method To Initialize Controller
    $scope.initController = function () {
        $scope.errorMessages = [];
        $scope.getDropDownList();
    };

    $scope.initController();


    //Method Called When User Type Is Selected
    $scope.userTypeSelected = function () {
        // $scope.data = {};
    };

    //Method To Register User
    $scope.registerUser = function () {
        $scope.errorMessages = [];
        $http.post('/register', $scope.data).then(function (response) {
            if (response.status === 500) {
                alertify.alert("Something Went Wrong While Registrating User")
            } else if (response.status === 201) {
                alertify.alert("User Registered Successfully", function () {
                    $window.location = '/login';
                })
            } else if (response.status === 200) {
                $scope.errorMessages = response.data.message;
                alertify.alert("Please Check Validation Errors");
            }
        })
    };
}]);