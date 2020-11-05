const app = angular.module("giveTestApp", ['ngMaterial', 'ngMessages', 'ui.bootstrap', 'ui.bootstrap.modal', 'smart-table']);
app.controller('giveTestAppCtrlr', function ($scope, $window, $http) {
    //Method To Initialize Controller
    $scope.initController = function (testID, testName) {
        $scope.data = {};
        $scope.data.TestID = testID;
        $scope.data.TestName = testName;
        $scope.getTestQuestions(testID);
    };

    //Method To Get Test Questions
    $scope.getTestQuestions = function (testId) {
        $http.get("/getTestQuestions?TestID=" + testId).then(function (response) {
            if (response.status === 500)
                alertify.alert("Something Went Wrong While Getting Test Data");
            else {
                $scope.testData = response.data;
                $scope.testData.Option = [];

            }
        })
    };

    //Method To Submit Test
    $scope.submitTest = function () {
        $scope.testResult = {
            Score: $scope.testData.Option.reduce((a, b) => parseInt(a) + parseInt(b), 0),
            TestID: $scope.testData.TestID
        };
        $http.post('/submitTest', $scope.testResult).then(function (response) {
            if (response.status === 500) {
                alertify.alert("Somthing Went Wrong While Submitting Test");
            } else {
                if ($scope.testResult.Score < 20)
                    alertify.alert("Score: " + $scope.testResult.Score + ": Poor Confidence");
                else if ($scope.testResult.Score < 30)
                    alertify.alert(`Score: ${$scope.testResult.Score}: Average Confidence`);
                else if ($scope.testResult.Score < 40)
                    alertify.alert(`Score: ${$scope.testResult.Score}: Good Confidence`);
                else ($scope.testResult.Score < 50)
                    alertify.alert(`Score: ${$scope.testResult.Score}: Best Confidence`);

               // $window.location = '/attemptTest'
            }
        })
    };
});