const router = require("express").Router();
let isLoggedIn = require("../lib/isLoggedIn")

//Users Schema Imported Here
let userSchema = require("../schema/users.Schema");

//Students Schema Imported Here
let studentSchema = require("../schema/student.Schema");

//Method To Render Manage Students Page
router.get("/manageStudents", isLoggedIn, function (req, res) {
    res.render("ManageStudents");
});

//Method To Get Students
router.get('/manageStudents/getAllStudents', isLoggedIn, function (req, res) {
    studentSchema.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: "UserID",
                foreignField: "UserID",
                as: "user"
            }
        },
        {
            $lookup: {
                from: 'departments',
                localField: "DepartmentID",
                foreignField: "DepartmentID",
                as: "department"
            }
        },
        {
            $project: {
                FirstName: 1,
                LastName: 1,
                UserID: 1,
                DepartmentID: 1,
                Password: {$arrayElemAt: ["$user.Password", 0]},
                ContactNumber: {$arrayElemAt: ["$user.ContactNumber", 0]},
                IsVerified: {$arrayElemAt: ["$user.IsVerified", 0]},
                StudentID: 1,
                User: {$arrayElemAt: ["$user", 0]},
                Department: {$arrayElemAt: ["$department", 0]}
            }
        }
    ]).exec(function (err, users) {
        if (err)
            res.sendStatus(500);
        else
            res.send(users);
    })
});

//Method To Approve/Dis-approve Student 
router.post("/manageStudents/approveStudent", isLoggedIn, function (req, res) {
    userSchema.findOneAndUpdate({UserID: req.body.UserID}, {$set: {IsVerified: req.body.status}}, function (err) {
        if (err)
            res.sendStatus(500);
        else
            res.sendStatus(201);
    })
});

//Method To Add New Student
router.post("/manageStudents/addStudent", isLoggedIn, function (req, res) {
    console.log(req.body)
    let newUser = new userSchema(req.body);
    newUser.UserTypeID = 2;
    newUser.save(function (err, user) {
        if (err) {
            console.log(err)
            if (err.name === 'ValidationError') {
                let errorMessages = err.message.replace("users validation failed:", "");
                errorMessages = errorMessages.split(',');
                for (let i = 0; i < errorMessages.length; i++) {
                    errorMessages[i] = errorMessages[i].split(':')[1];
                }
                return res.status(200).send({message: errorMessages});
            } else {
                return res.sendStatus(500);
            }
        } else {
            let newStudent = req.body;
            newStudent.UserID = user.UserID;
            newStudent = new studentSchema(newStudent);
            newStudent.save(function (err) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }

                else
                    return res.sendStatus(201);
            });
        }

    });
});

//Method To Edit Student Details
router.post("/manageStudents/editStudent", isLoggedIn, function (req, res) {
    let userData = {
        UserID: req.body.UserID,
        ContactNumber: req.body.ContactNumber,
        EmailID: req.body.EmailID,
        Password: req.body.Password,
        UserTypeID: 2,
        IsVerified: req.body.IsVerified
    };

    let studentData = {
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        DepartmentID: req.body.DepartmentID,
        UserID: req.body.UserID
    };
    userSchema.findOneAndUpdate({UserID: userData.UserID}, {$set: userData}, {
        runValidators: true,
        context: 'query'
    }, function (err) {
        if (err) {
            if (err.name === 'ValidationError') {
                let errorMessages = err.message.replace("Validation failed:", "");
                errorMessages = errorMessages.split(',');
                for (let i = 0; i < errorMessages.length; i++) {
                    errorMessages[i] = errorMessages[i].split(':')[1];
                }
                return res.status(200).send({message: errorMessages});
            } else {
                return res.sendStatus(500);
            }
        }
        else {
            studentSchema.findOneAndUpdate({UserID: studentData.UserID}, {$set: studentData}, function (err) {
                if (err) {
                    if (err.name === 'ValidationError') {
                        let errorMessages = err.message.replace("Validation failed:", "");
                        errorMessages = errorMessages.split(',');
                        for (let i = 0; i < errorMessages.length; i++) {
                            errorMessages[i] = errorMessages[i].split(':')[1];
                        }
                        return res.status(200).send({message: errorMessages});
                    } else {
                        return res.sendStatus(500);
                    }
                } else
                    return res.sendStatus(201);
            });
        }
    })
});

//Method To Delete Student
router.get('/manageStudents/deleteStudent', isLoggedIn, function (req, res) {
    let userID = parseInt(req.query.id);
    userSchema.findOneAndDelete({UserID: userID}, function (err) {
        if (err)
            return res.sendStatus(500);
        else {
            studentSchema.findOneAndDelete({UserID: userID}, function (err) {
                if (err)
                    return res.sendStatus(500);
                else
                    return res.sendStatus(201);
            })
        }
    })
});
module.exports = router;