const app = angular.module("attemptTestApp", ['ngMaterial', 'ngMessages', 'ui.bootstrap', 'ui.bootstrap.modal', 'smart-table']);
app.controller('attemptTestAppCtrlr', function ($scope, $window, $http) {
    //Method To Attempt Test
    $scope.attemptTest = function () {
        $http.post('/attemptTest/giveTest', $scope.test).then(function (response) {
            console.log(response);
            if (response.status === 201) {
                $window.location = "/test?TestID=" + response.data.TestID + "&TestName="+$scope.test.TestName;
            } else if (response.status === 200) {
                alertify.alert("Test With This Name Does Not Exist");
            } else if (response.status === 500) {
                alertify.alert("Something Went Wrong While Getting Test Data");
            }
        });
    }
});