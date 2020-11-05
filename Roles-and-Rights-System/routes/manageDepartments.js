var router = require("express").Router();
var departmentSchema = require('../schema/department.Schema');

var isLoggedIn = require("../lib/isLoggedIn");

//Method To Render Manage Departments Page
router.get("/manageDepartments", isLoggedIn, function (req, res) {
    res.render("ManageDepartments/index");
});

//Method To Get Department List
router.get("/manageDepartments/getDepartments", function (req, res) {
    departmentSchema.find({CreatedByUserID: req.session.UserID}, function (err, depts) {
        if(err)
            res.sendStatus(500);
        else
            res.send(depts);
    })
});

//Method To Add New Department
router.post("/manageDepartments/addDepartment", function (req, res) {
    var newDepartment = new departmentSchema(req.body);
    newDepartment.CreatedByUserID = req.session.UserID;
    newDepartment.save(function (err) {
        if(err)
            res.sendStatus(500);
        else
            res.sendStatus(201);
    })
});

//Method To Update Department 
router.post('/manageDepartments/updateDepartment', function (req, res) {
    departmentSchema.findOneAndUpdate({DepartmentID: req.body.DepartmentID}, {$set: req.body}, function (err) {
        if(err)
            res.sendStatus(500);
        else
            res.sendStatus(201);
    })
});

//Method To Delete Department
router.get("/manageDepartments/deleteDepartment", function (req, res) {
    var deptId = parseInt(req.query.DepartmentID);
    departmentSchema.findOneAndRemove({DepartmentID: deptId}, function (err) {
        if(err)
            res.sendStatus(500);
        else
            res.sendStatus(201);
    });
});

//Method To Get Department List For Drop down
router.get('/getDepartmentListForDropDown', function (req, res) {
   departmentSchema.find(function (err, depts) {
       if(err)
           res.sendStatus(500);
       else
           res.send(depts);
   });
});

module.exports = router;