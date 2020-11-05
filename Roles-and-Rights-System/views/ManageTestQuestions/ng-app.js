const app = angular.module("manageTestApp", ['ngMaterial', 'ngMessages', 'ui.bootstrap', 'ui.bootstrap.modal', 'smart-table']);
app.controller('manageTestAppCtrlr', function ($scope, $window, $http, $document) {
    //Method To Initialize Controller
    $scope.initController = function (testID, queNos, testName,Options) {
        console.log(testID, queNos);
        $scope.data = {};
        $scope.data.TestID = testID;
        $scope.data.NoOfQuestions = queNos;
        $scope.data.TestName = testName;
        $scope.data.Questions = new Array(queNos);
        $scope.data.Options = new Array(Options);
    };

    //Method To Create Test
    $scope.createTest = function (data) {
        alertify.confirm("Do You really want to create test?", function () {
            $http.post("/manageTestQuestions/createQuestions", $scope.data).then(function (resposne) {
                if (resposne.status === 500) {
                    alertify.error("Something Went Wrong While Creating Test");
                } else if (resposne.status === 201) {
                    alertify.alert("Test Created Successfully");
                    $window.location = "/CreateTest";
                }else if(resposne.status === 200){
                    alertify.alert("Test With Same ID Already Exists")
                }
            })
        })
    };
});