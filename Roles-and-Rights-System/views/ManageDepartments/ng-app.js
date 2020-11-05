var app = angular.module("manageDepartmentsApp", ['ngMaterial', 'ngMessages', 'ui.bootstrap', 'ui.bootstrap.modal', 'smart-table']);
app.controller('manageDepartmentsAppCtrlr', function ($scope, $uibModal, $http) {

    //Method For Init Controller
    $scope.initController = function () {
        $scope.getAllDepartments();
    };

    //Method To Get All Departments List
    $scope.getAllDepartments = function () {
        $http.get("/manageDepartments/getDepartments").then(function (response) {
            if (response.status === 500)
                alertify.error("Something Went Wrong While Getting Departments List");
            else
                $scope.departments = response.data;
        })
    };


    //Method To Delete Department By ID
    $scope.deleteDepartment = function (deptId) {
        alertify.confirm("Do you really want to delete this department?", function () {
            $http.get("/manageDepartments/deleteDepartment?DepartmentID=" + deptId).then(function (response) {
                if (response.status === 500)
                    alertify.error("Something Went Wrong While Deleting Department");
                else {
                    alertify.success("Department Deleted Successfully")
                    $scope.initController();
                }
            })
        });
    };

    //Method To Open Model
    $scope.openModal = function (mode, data) {
        var modalData = {};
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
    $scope.department = {};
    var init = function () {
        $scope.department = record;
    };
    init();


    //Method To Update Department By ID
    $scope.addNewDepartment = function () {
        $http.post("/manageDepartments/addDepartment", $scope.department).then(function (response) {
            if (response.status === 500)
                alertify.error("Something Went Wrong While Adding New Department");
            else {
                alertify.success("Department Added Successfully");
                $scope.close();
                $scope.initController();
            }
        })
    };

    //Method To Update Department By ID
    $scope.updateDepartment = function () {
        $http.post("/manageDepartments/updateDepartment", $scope.department).then(function (response) {
            if (response.status === 500)
                alertify.error("Something Went Wrong While Updating Department");
            else {
                alertify.success("Department Updated Successfully");
                $scope.close();
                $scope.initController();
            }
        })
    };

    //Method To Close
    $scope.close = function () {
        $scope.modalInstance.close();
    }
});