let router = require("express").Router();

//Student Schema Imported Here
let studentSchema = require("../schema/student.Schema");

//Users Schema Imported Here
let userSchema = require("../schema/users.Schema");

//Teachers Schema Imported Here
let teacherSchema = require("../schema/teacher.Schema");


//********************************** Registration Page Methods Processed Here***********************************//
//Method To Render Registration Page
router.route('/register').get(function (req, res) {
    res.render("UserRegistration/index");
}).post(function (req, res) {
    let newUser = new userSchema(req.body);
    newUser.UserTypeID = parseInt(newUser.UserTypeID);
    newUser.save(function (err, user) {
        if (err) {
            if (err.name === 'ValidationError') {
                let errorMessages = err.message.replace("users validation failed:", "");
                errorMessages = errorMessages.split(',');
                for (let i = 0; i < errorMessages.length; i++) {
                    errorMessages[i] = errorMessages[i].split(':')[1];
                }
                res.status(200).send({message: errorMessages});
            } else {
                res.sendStatus(500);
            }
        } else {
            if (user.UserTypeID === 2) {
                let newStudent = req.body;
                newStudent.UserID = user.UserID;
                newStudent = new studentSchema(newStudent);
                newStudent.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    }

                    else
                        res.sendStatus(201);
                });
            }
            else if (user.UserTypeID === 3) {
                let newTeacher = req.body;
                newTeacher.UserID = user.UserID;
                newTeacher = new teacherSchema(newTeacher);
                newTeacher.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    }

                    else
                        res.sendStatus(201);
                });
            }
        }
    });
});

//********************************** Log In Page Methods Processed Here***********************************//
//Method To Render Log In Page
router.route('/login').get(function (req, res) {
    res.render("LogIn/index");
}).post(function (req, res) {
    userSchema.findOne({EmailID: req.body.EmailID}, function (err, user) {
        if (err)
            return res.sendStatus(500);
        else if (!user)
            return res.status(200).send({message: "User Does Not Exist"});
        else if (user) {
            if (!user.IsVerified)
                return res.status(200).send({message: "Please Contact Admin, Account is not activated"});
            if (user.Password !== req.body.Password)
                return res.status(200).send({message: "Invalid Password"});
            else {
                //Creating Roles And Rights Based System
                let sideMenuItems = [], sessionAllowedUrls = [];
                //If User Type Is Student
                if (user.UserTypeID === 2) {
                    sideMenuItems = [
                        {class: 'fas fa-fw fa-table', url: '/attemptTest', title: 'Give Test'}
                    ];
                }

                //If User Type Is Teacher
                else if (user.UserTypeID === 3) {
                    sideMenuItems = [
                        {class: 'fas fa-fw fa-table', url: '/createTest', title: 'Create Test'},
                        {class: 'fas fa-fw fa-table', url: '/manageDepartments', title: 'Manage Departments'}
                    ];
                    sessionAllowedUrls.push('/createTest');
                    sessionAllowedUrls.push('/manageTests');
                    sessionAllowedUrls.push('/manageTestQuestions');
                }


                //If User Type Is Admin
                else if (user.UserTypeID === 1) {
                    sideMenuItems = [
                        // {class: 'fas fa-fw fa-table', url: '/createTest', title: 'Create Test'},
                        {class: 'fas fa-fw fa-table', url: '/manageTeachers', title: 'Manage Teachers'},
                        {class: 'fas fa-fw fa-table', url: '/manageStudents', title: 'Manage Students'},
                        {class: 'fas fa-fw fa-table', url: '/manageDepartments', title: 'Manage Departments'}
                    ];
                }

                //Add Session Allowed Urls From Side Menu Items
                for (let menuItem of sideMenuItems) {
                    if (menuItem.length !== undefined) {
                        for (let j = 1; j < menuItem.length; j++) {
                            sessionAllowedUrls.push(menuItem[j].url)
                        }
                    } else
                        sessionAllowedUrls.push(menuItem.url);
                }
                req.session.UserID = user.UserID;
                req.session.UserTypeID = user.UserTypeID;
                req.session.EmailID = user.EmailID;
                req.session.menuItems = sideMenuItems;
                req.session.sessionAllowedUrls = sessionAllowedUrls;
                return res.status(201).send({url: sessionAllowedUrls[0]});

            }
        }
    })
});

//****************************** Method For Logging Out User ***************************************//
router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
});


module.exports = router;