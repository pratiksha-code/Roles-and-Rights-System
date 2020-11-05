const app = angular.module("myApp", ['ngMaterial', 'ngMessages', 'ui.bootstrap', 'ui.bootstrap.modal', 'smart-table']);
app.controller('myAppCntrl', function ($scope, $uibModal, $http) {

    //Method For Init Controller
    $scope.initController = function () {
        $scope.getAllTeachers();
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

    // Method To Get All teacher
    $scope.getAllTeachers = function() {
        $http.get('/manageTeachers/getAllTeachers').then(function(response) {
            if (response.status === 200) {
                console.log(response.data)
                $scope.teachers = response.data;
            } else
                alertify.error("Failed To Load Candidates");
        });
    };

    //Method Called When User Data Is Changed
    $scope.userInputChanged = function (isUserDataChanged , isStudentDataChanged) {
        $scope.isUserDataChanged = isUserDataChanged;
        $scope.isStudentDataChanged = isStudentDataChanged;
    };

    //Method To Delete student
    // $scope.deletestudent = function (id) {
    //     $http.get('/ganeshJayanti/deletestudent?id='+id).then(function (response) {
    //         if(response.status === 200){
    //             alertify.success('Your Record Deleted');
    //             $scope.initController();
    //         }
    //         else {
    //             alertify.error('Canceled')
    //         }
    //     });
    // };

    //Method To approve Dis-approve teacher
    $scope.approveTeacher = function (userID, status) {
        let data = {
            UserID: userID,
            status: status
        };
        alertify.confirm("Do you really want approve/disapprove student?", function () {
            $http.post("/manageTeachers/approveTeacher", data).then(function (response) {
                if (response.status === 500)
                    alertify.error("Something Went Wrong While Approving Teacher");
                else {
                    $scope.initController();
                    alertify.success("Teacher Status Approved Successfully");
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
    $scope.teacher = {};
    const init = function () {
        $scope.teacher = record;
    };
    init();


    //Method To Add Candidate
    $scope.addNewTeacher = function () {
        $http.post('/manageTeachers/addTeachers', $scope.teacher).then(function (response) {
            console.log(response);
            if (response.status === 201) {
                alertify.success('student Added Successfully..');
                //$scope.initController();
                $scope.close();
            }
            else {
                alertify.error('Something Wrong While Adding New student..')
            }
        });
    };

    // Method To Edit teacher
    $scope.editTeacher = function () {
        $http.post('/manageTeachers/editTeacher', $scope.teacher).then(function (response) {
            if (response.status === 201) {
                alertify.success('Teacher Record Has Been Updated');
                $scope.initController();
                $scope.close();
            }
            else if (response.status === 200) {
                $scope.errorMessages = response.data.message;
                alertify.alert('Please Check Validation Errors')
            } else {
                alertify.alert("Something Went Wrong While Creating Teacher");
                $scope.close();
            }
        });
    };

    //Method To Delete teacher
    $scope.deleteTeacher = function (id) {
        alertify.confirm("Do You Really Want To Delete This Teacher?", function () {
            $http.get('/manageTeachers/deleteTeacher?id=' + id).then(function (response) {
                if (response.status === 201) {
                    alertify.success('Teacher Record Deleted Successfully');
                    $scope.initController();
                }
                else {
                    alertify.alert("Something Went Wrong While Deleting Teacher Record")
                }
            });
        });
    };


    //Method To Close
    $scope.close = function () {
        $scope.modalInstance.close();
    }
});