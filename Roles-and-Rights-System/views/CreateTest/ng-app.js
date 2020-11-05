const app = angular.module("createTestApp", ['ngMaterial', 'ngMessages', 'ui.bootstrap', 'ui.bootstrap.modal', 'smart-table']);
app.controller('createTestAppCtrlr', function ($scope, $window, $http) {
    //Method To Initialize Controller
    $scope.initController = function () {
        $scope.getDepartmentsDropDownList();
    };

    //Method To Get Departments List For Drop Down
    $scope.getDepartmentsDropDownList = function () {
        $http.get('/getDepartmentListForDropDown').then(function (response) {
            if (response.status === 500)
                alertify.error("Something Went Wrong While Getting Departments List");
            else {
                $scope.departments = response.data;
            }
        })
    };

    //Method To Create Test
    $scope.createTest = function () {
        $http.post('/createTest', $scope.test).then(function (response) {
            if (response.status === 500)
                alertify.error("Something Went Wrong While Creating Test");
            else if(response.status === 201) {
                 $window.location = '/manageTestQuestions?TestID=' + response.data.TestID ;
                alertify.alert("Test Created Successfully, Please Add Questions To The Test");

            }else{
                $scope.errorMessages = response.data.message;
            }
        })
    }
});