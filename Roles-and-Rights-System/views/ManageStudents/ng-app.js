var app = angular.module("myApp", ['ngMaterial', 'ngMessages', 'ui.bootstrap', 'ui.bootstrap.modal', 'smart-table']);
app.controller('myAppCntrl', function ($scope, $uibModal, $http) {

    //Method For Init Controller
    $scope.initController = function () {
        $scope.getAllStudents();
        $scope.getDropDownList();
    };

    //Method To Get Departments List For Drop Down
    $scope.getDropDownList = function () {
        $http.get('/getDepartmentListForDropDown').then(function (response) {
            if (response.status === 500)
                alertify.error("Something Went Wrong While Getting Departments List");
            else
                $scope.departments = response.data;
        })
    };

    // Method To Get All student
    $scope.getAllStudents = function () {
        $http.get('/manageStudents/getAllStudents').then(function (response) {
            if (response.status === 200) {
                console.log(response.data)
                $scope.students = response.data;
            } else
                alertify.error("Failed To Load Candidates");
        });
    };

    //Method Called When User Data Is Changed
    $scope.userInputChanged = function (isUserDataChanged, isStudentDataChanged) {
        $scope.isUserDataChanged = isUserDataChanged;
        $scope.isUserDataChanged = isStudentDataChanged;
    };

    //Method To Delete student
    $scope.deleteStudent = function (id) {
        alertify.confirm("Do You Really Want To Delete This Student?", function () {
            $http.get('/manageStudents/deleteStudent?id=' + id).then(function (response) {
                if (response.status === 201) {
                    alertify.success('Student Record Deleted Successfully');
                    $scope.initController();
                }
                else {
                    alertify.alert("Something Went Wrong While Deleting Student Record")
                }
            });
        });
    };

    //Method To approve Dis-approve Student
    $scope.approveStudent = function (userID, status) {
        let data = {
            UserID: userID,
            status: status
        };
        alertify.confirm("Do you really want approve/disapprove student?", function () {
            $http.post("/manageStudents/approveStudent", data).then(function (response) {
                if (response.status === 500)
                    alertify.error("Something Went Wrong While Approving Student");
                else {
                    $scope.initController();
                    alertify.success("Student Status Approved Successfully");
                }
            });
        })
    };

    //Method To Open Model
    $scope.openModal = function (mode, data) {
        let modalData = {};
        if (mode === 'edit') {
            modalData = angular.copy(data);
        }
        modalData.mode = mode;

        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'modal.html',
            controller: 'myApplications',
            scope: $scope,
            backdrop: false,
            size: 'lg',
            windowClass: 'show',
            resolve: {
                record: function () {
                    return modalData;
                }
            }
        })
    }
});


//Controller For Managing Candidate
app.controller('myApplications', function ($scope, $http, record) {
    $scope.student = {};
    var init = function () {
        $scope.student = record;
    };
    init();


    //Method To Add Candidate
    $scope.addNewStudent = function () {
        $http.post('/manageStudents/addStudent', $scope.student).then(function (response) {
            console.log(response);
            if (response.status === 201) {
                alertify.success('Student Added Successfully..');
                $scope.initController();
                $scope.close();
            }
            else if (response.status === 200) {
                $scope.errorMessages = response.data.message;
                alertify.alert('Please Check Validation Errors')
            } else {
                alertify.alert("Something Went Wrong While Creating Student");
                $scope.close();
            }
        });
    };

    // Method To Edit student
    $scope.editStudent = function () {
        $http.post('/manageStudents/editStudent', $scope.student).then(function (response) {
            if (response.status === 201) {
                alertify.success('Student Record Has Been Updated');
                $scope.initController();
                $scope.close();
            }
            else if (response.status === 200) {
                $scope.errorMessages = response.data.message;
                alertify.alert('Please Check Validation Errors')
            } else {
                alertify.alert("Something Went Wrong While Creating Student");
                $scope.close();
            }
        });
    };

    //Method To Close
    $scope.close = function () {
        $scope.modalInstance.close();
    }
});