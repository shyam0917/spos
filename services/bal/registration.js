var express = require('express');
var app = express();
var url = require('url');
var sqlConnect = require('../tools/utility/mssql.connection');
var utility = require('../tools/utility/utility');
var jwt = require('jsonwebtoken');
var appSecret = "APPSECRET";
var atob = require('atob');
var accessCodePOSUser = 'STRUSR';
var accessCodeAdmin = 'SADM';
var nodemailer = require('nodemailer');
var moment = require('moment');
var btoa = require('btoa');
app.set('view engine', 'ejs');
// app.set('views', __dirname + '../../views/home.ejs);
// var bcrypt = require('bcryptjs');

function userAccess(pool, req, res) {
    var nodemailer = require('nodemailer');

    return new Promise(function (resolve, reject) {
        var info = {};
        info = JSON.parse(atob(req.headers.user));
        if (info.p_username) {
            var parameters = {
                query: 'SELECT * FROM tbl_sysuser where userName = ' + JSON.stringify(info.p_username),
            }
            sqlConnect.connect('query', parameters, function (error, param) {
                if (error)
                    reject(error);

                if (param) {
                    resolve(param);
                }
            }, pool);
        } else {
            reject(error);
        }
    });
}

function userAccessUserID(pool, req, res) {

    return new Promise(function (resolve, reject) {
        var info = {};
        info = req.body;

        if (info.p_userId) {
            var parameters = {
                query: 'SELECT store_ID, role FROM tbl_sysuser where sysUser_ID = ' + JSON.stringify(info.p_userId),
            }
            sqlConnect.connect('query', parameters, function (error, param) {
                if (error) {
                    reject(error);
                }

                if (param) {
                    resolve(param);
                }
            }, pool);
        } else {
            reject(error);
        }
    });
}


function filterProducts(pool, req, res, store_ID) {

    var parameters = {
        query: 'filterProducts',
        inputParameters: [{
            type: 'int',
            value: store_ID
        }],
        hasoutputParameters: false
    }
    sqlConnect.connect('procedure', function (error, param) {
        if (error) {
            utility.sendApiResponse(res, 3, {
                result: error,
                code: 3
            }); // when error in sp
        }
        var nodemailer = require('nodemailer');

        if (param) {
            if (param[0][0]) {
                if (param[0][0].ResultCode == 0) {
                    utility.sendApiResponse(res, 0, {
                        result: param[0][0].Result,
                        code: 0
                    });
                } else {
                    utility.sendApiResponse(res, 1, {
                        result: param[0][0].Result,
                        code: 1
                    });
                }
            }
        }
    }, pool);
}

module.exports = {

    sysLogin: function (pool, req, res) {
        userAccess(pool, req, res).then(function (data) {
            if (data[0].role == accessCodePOSUser) {
                return utility.sendApiResponse(res, 2, {
                    result: "invalid login",
                    code: 2
                });
            } else {
                var info = {};
                info = JSON.parse(atob(req.headers.user));
                var parameters = {
                    query: 'usp_sysLogin',
                    inputParameters: [{
                            type: 'string',
                            value: info.p_username
                        },
                        {
                            type: 'string',
                            value: info.p_password
                        }
                    ],
                    hasoutputParameters: false
                }

                sqlConnect.connect('procedure', parameters, function (error, param) {
                    if (error) {
                        return utility.sendApiResponse(res, 3, {
                            result: "somthing went wrong in DB",
                            code: 3
                        });
                    }
                    if (param) {
                        if (param[0][0]) {
                            if (param[0][0].sysUser_ID > 0) {
                                var token = jwt.sign(info, appSecret, {
                                    expiresIn: 60 * 60 // expires in 60 minutes
                                });
                                return utility.sendApiResponse(res, 0, {
                                    result: "login successful",
                                    code: 0,
                                    token: token,
                                    user: param[0][0]
                                });
                            } else {
                                return utility.sendApiResponse(res, 1, {
                                    result: "invalid login",
                                    code: 1
                                });
                            }
                        } else {
                            return utility.sendApiResponse(res, 1, {
                                result: "invalid credentials",
                                code: 1
                            });
                        }
                    } else {
                        return utility.sendApiResponse(res, 1, {
                            result: "invalid credentials",
                            code: 1
                        });
                    }
                }, pool);

            }
        }).catch(function (error) {
            utility.sendApiResponse(res, 3, {
                result: error,
                code: 3
            });
        });

    },

    sysUserRegistration: function (pool, req, res) { //function
        var info = {};
        info = req.body;
        var parameters = {
            query: 'usp_sysUserRegistration',
            inputParameters: [{
                    type: 'int',
                    value: info.p_store_ID
                },
                {
                    type: 'string',
                    value: info.p_role
                },
                {
                    type: 'string',
                    value: info.p_firstName
                },
                {
                    type: 'string',
                    value: info.p_middleName
                },
                {
                    type: 'string',
                    value: info.p_lastName
                },
                {
                    type: 'string',
                    value: info.p_email
                },
                {
                    type: 'string',
                    value: info.p_userName
                },
                {
                    type: 'string',
                    value: info.p_password
                },
                {
                    type: 'string',
                    value: info.p_mobile
                },
                {
                    type: 'string',
                    value: info.p_emergencyContact ? info.p_emergencyContact : 0
                },
                {
                    type: 'int',
                    value: info.p_sysUser_ID
                }
            ],
            hasoutputParameters: false

        }
        sqlConnect.connect('procedure', parameters, function (error, param) {
            if (error) {
                return utility.sendApiResponse(res, 3, null);
            }
            if (param) {
                if (param.affectedRows == 1)
                    utility.sendApiResponse(res, 0, {
                        result: "registered",
                        code: 0
                    });
                else {
                    utility.sendApiResponse(res, 1, {
                        result: "not registered",
                        code: 1
                    });
                }
            }
        }, pool);

    },

    vaildateSysUser: function (pool, req, res) { //function
        var info = {};
        info = req.body;
        var btoa = require('btoa');

        var parameters = {
            query: 'usp_checkSysExistStatus',
            inputParameters: [{
                    type: 'int',
                    value: info.p_store_ID
                },
                {
                    type: 'string',
                    value: info.p_email
                },
            ],
            hasoutputParameters: false

        }

        sqlConnect.connect('procedure', parameters, function (error, param) {
            if (error) {
                return utility.sendApiResponse(res, 3, null);
            }
            if (param) {
                if (param[0][0]) {
                    if (param[0][0].store_ID && param[0][0].email) {
                        utility.sendApiResponse(res, 0, {
                            result: "exist",
                            code: 0
                        });
                    }
                } else {
                    utility.sendApiResponse(res, 1, {
                        result: "not exist",
                        code: 1
                    });
                }

            }
        }, pool);

    },

    sysResetPass: function (pool, req, res) {
        var time1 = moment().format('YYYY-MM-DD HH:mm:ss');
        var time = JSON.stringify(time1);
        var parameters = {
            query: `SELECT * FROM tbl_sysuser where userName = "${req.body.userName}"`
        }
        sqlConnect.connect('query', parameters, function (error, param, fields) {
            if (param[0]) {
                if (param[0].password == req.body.passData.currentPass) {
                    var parameters = {
                        query: `Update tbl_sysuser set password="${req.body.passData.newPass}", TimeUpdtPass=${time}where userName = "${req.body.userName}";`
                    };
                    sqlConnect.connect('query', parameters, function (error, param, fields) {
                        if (param) {
                            if ((param.affectedRows) > 0) {
                                res.status(200).json({
                                    "msg": "Password Updated"
                                });
                            }
                        } else {
                            res.status(500).json({
                                "msg": "Somthing went wrong"
                            });
                        }
                    }, pool);
                } else {
                    res.status(400).json({
                        "msg": "wrong current password"
                    });
                }
            } else {
                res.status(401).json({
                    "msg": "You are not registered"
                });
            }
        }, pool);

    },

    sysforgotPassward: function (pool, req, res) {
        var time1 = moment().format('YYYY-MM-DD HH:mm:ss');
        var time = JSON.stringify(time1);
        var parameters = {
            query: `SELECT * FROM tbl_sysuser where email = "${req.body.email}"`
        }
        sqlConnect.connect('query', parameters, function (error, param, fields) {

            if (param && param.length == 0) {
                res.send({
                    msg: "this email id not registered"
                });
                return false;

            }
            var sysUserid = param[0].sysUser_ID;
            let encrypt = btoa(param[0].sysUser_ID);

            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            }
            if (param && param.length > 0) {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'amantyagi10595js@gmail.com',
                        pass: '9761320827@Ajeet'
                    }
                });
                var mailOptions = {
                    from: 'amantyagi10595js@gmail.com',
                    to: req.body.email,
                    subject: 'Change password link from your Inventory',
                    text: 'you can change your password by clicking the link:192.168.1.96:3000/updatePassward',
                    // html: `<p>Click <a href="http://localhost:4200/#/updatePass?sysid=${encrypt}">here</a> to reset your password</p>`
                    html: `<p>Click <a href="http://192.168.1.96:3000/ejs?sysid=${encrypt}">here</a> to reset your password</p>`

                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        res.status(502).send({
                            message: "somthing error to send email ",
                        });
                    } else {
                        var parameters = {
                            query: `Update tbl_sysuser set LincStatus='1',TimeChngPass =${time} where sysUser_ID = ${sysUserid};`
                        }
                        sqlConnect.connect('query', parameters, function (error, param, fields) {
                            if (param.affectedRows) {
                                res.status(200).send({
                                    msg: "mail has been sent"
                                });
                            } else {
                                res.status(500).send({
                                    msg: "somthing went wrong"
                                });
                            }
                            // if (error)
                            //     utility.sendApiResponse(res, 3, { result: error, code: 3 });
                            // if (param && param.length > 0) {
                            //     utility.sendApiResponse(res, 0, { result: param, fields: fields, code: 0 });
                            // } else {
                            //     utility.sendApiResponse(res, 1, { result: param, fields: fields, code: 1 });
                            // }
                        }, pool);

                        // res.status(200).send({ message: "link send ", });
                    }
                })



                // utility.sendApiResponse(res, 0, { result: param, fields: fields, code: 0 });
            } else {
                utility.sendApiResponse(res, 1, {
                    result: param,
                    fields: fields,
                    code: 1
                });
            }
        }, pool);

    },

    sysEjs: function (pool, req, res) {

        var parameters = {
            query: `SELECT LincStatus, TimeChngPass FROM tbl_sysuser where sysUser_ID = ${atob(req.query.sysid)};`
        }
        sqlConnect.connect('query', parameters, function (error, param, fields) {

            if (error) {
                res.redirect(url.format({
                    pathname: "/ejs",
                    query: {
                        "msg": "Error",
                        "sysid": req.body.sysid
                    }
                }));

            } else if (!(param[0].LincStatus)) {
                // res.status(200).send({ msg: "Linc status is not active, may be mail havent send to the user" });
                res.redirect(url.format({
                    pathname: "/ejs",
                    query: {
                        "msg": "Status is unactive for password change",
                        "sysid": req.body.sysid
                    }
                }));
            } else {}
        }, pool);


    },

    sysUpdatePassward: function (pool, req, res) {


        if (!(req.body.newPassword.length && req.body.urlsyid.length)) {
            res.status(400).send({
                msg: "Inputs are not valid"
            });
        } else {
            var password = JSON.stringify(req.body.newPassword);
            var time1 = moment().format('YYYY-MM-DD HH:mm:ss');
            var time = JSON.stringify(time1);
            var timeMoment = moment(time, 'YYYY-MM-DD HH:mm:ss');
            var parameters = {
                query: `SELECT LincStatus, TimeChngPass FROM tbl_sysuser where sysUser_ID = ${req.body.urlsyid};`
            }
            sqlConnect.connect('query', parameters, function (error, param, fields) {
                if (error)
                    return utility.sendApiResponse(res, 3, {
                        result: error,
                        code: 3
                    });
                if (!param[0]) {
                    return res.status(400).send({
                        msg: "Wrong Email Id"
                    });
                }
                if (param && param[0] && param[0]['LincStatus']) {
                    var timePrevious = moment(param[0].TimeChngPass, 'YYYY-MM-DD HH:mm:ss');
                    var duration = moment.duration(timeMoment.diff(timePrevious));
                    var timeDiff = duration.asMinutes();
                    if (timeDiff <= 100) {
                        var parameters = {
                            query: `Update tbl_sysuser set password=${password}, TimeUpdtPass=${time},LincStatus='0' where sysUser_ID = ${req.body.urlsyid};`
                        }
                        sqlConnect.connect('query', parameters, function (error, param, fields) {

                            if (error)
                                utility.sendApiResponse(res, 3, {
                                    result: error,
                                    code: 3
                                });
                            if (param.affectedRows) {
                                res.status(200).send({
                                    msg: "password change successfully"
                                });
                            } else {
                                res.status(200).send({
                                    msg: "Some problem during password change"
                                });
                            }
                        }, pool);

                    } else {
                        res.status(200).send({
                            msg: "Session time expired, please resend linc on your mail"
                        });
                        // res.rend(dskf;dslk, {
                        //     msg: 'dskflkdsaflkdsa'
                        // })
                    }
                } else {
                    res.status(400).send({
                        msg: "Linc status is not active, may be mail havent send to the user"
                    });
                }

            }, pool);
        }

        // var parameters = {
        //     query: `Update tbl_sysuser set password=${password}, TimeUpdtPass=${time} where sysUser_ID = ${req.body.urlsyid};`
        // }
        // sqlConnect.connect('query', parameters, function (error, param, fields) {

        //     if (error)
        //         utility.sendApiResponse(res, 3, { result: error, code: 3 });
        //     if (param.affectedRows) {
        //         res.status(200).send({ msg: "password change successfully" });
        //     }
        //     else {
        //         res.status(500).send({ msg: "Some problem during password change" });
        //     }
        //     // if (error)
        //     //     utility.sendApiResponse(res, 3, { result: error, code: 3 });
        //     // if (param && param.length > 0) {
        //     //     utility.sendApiResponse(res, 0, { result: param, fields: fields, code: 0 });
        //     // } else {
        //     //     utility.sendApiResponse(res, 1, { result: param, fields: fields, code: 1 });
        //     // }
        // }, pool);
    },

    sysUpdatePasswardEjs: function (pool, req, res) {
        var password = req.body.newPassword;
        var SavePassword = JSON.stringify(req.body.newPassword);
        var confirmPass = req.body.confirmPassword;
        var time1 = moment().format('YYYY-MM-DD HH:mm:ss');
        var time = JSON.stringify(time1);
        var timeMoment = moment(time, 'YYYY-MM-DD HH:mm:ss');

        if (!confirmPass || !password) {
            setTimeout(function () {
                renderPage(req, res, '/ejs', 'All fields are required');

            }, 5000)
            // return res.redirect('/ejs?sysid=${req.body.sysid} & param2=${value2}');
        } else if (req.body.sysid == "") {
            renderPage(req, res, '/ejs', 'Reopen the link');
            // res.render('home', {
            //     msg: "Reopen the linc",
            //     sysid: ""
            // });
        } else if (confirmPass != password) {
            renderPage(req, res, '/ejs', 'Password does not match');
            // res.render('home', {
            //     msg: "password not matched",
            //     sysid: ""
            // });
        } else {
            var parameters = {
                query: `SELECT LincStatus, TimeChngPass FROM tbl_sysuser where sysUser_ID = ${atob(req.body.sysid)};`
            }
            sqlConnect.connect('query', parameters, function (error, param, fields) {

                if (error) {
                    renderPage(req, res, '/ejs', 'Error');

                } else if (!(param[0].LincStatus)) {
                    // res.status(200).send({ msg: "Linc status is not active, may be mail havent send to the user" });
                    renderPage(req, res, '/ejs', 'Status is inactive for password change');
                    // return res.render('home', {
                    //     msg: "Status is unactive for password change",
                    //     sysid: ""
                    // });
                } else {
                    var timePrevious = moment(param[0].TimeChngPass, 'YYYY-MM-DD HH:mm:ss');
                    var duration = moment.duration(timeMoment.diff(timePrevious));
                    var timeDiff = duration.asMinutes();

                    if (timeDiff > 15) {
                        // res.status(200).send({ msg: "Session time expired, please resend linc on your mail" });
                        renderPage(req, res, '/ejs', 'Session expired')
                        // res.render('home', {
                        //     msg: "Session time expired",
                        //     sysid: ""
                        // });
                    } else {
                        var parameters = {
                            query: `Update tbl_sysuser set password=${SavePassword}, TimeUpdtPass=${time},LincStatus='0' where sysUser_ID = ${atob(req.body.sysid)};`
                        }
                        sqlConnect.connect('query', parameters, function (error, param, fields) {

                            if (error) {
                                // utility.sendApiResponse(res, 3, { result: error, code: 3 });
                                renderPage(req, res, '/ejs', 'Something went wrong');
                                // res.render('home', {
                                //     msg: "something Wrong",
                                //     sysid: ""
                                // });
                            } else if (param.affectedRows) {
                                // res.render('home', {
                                //     msg: "password change successfully",
                                //     sysid: req.body.sysid
                                // });
                                res.render('home.ejs', {
                                    sysid: req.body.sysid,
                                    url: 'http://192.168.1.96:3000/updatePasswardEjs',
                                    msg: 'Password changed successfully'
                                })
                                // renderPage(req, res, '/ejs', 'Password changed successfully');
                                // res.redirect('http://192.168.1.96:4200/#/login');
                                // return;
                            } else {
                                renderPage(req, res, '/ejs', 'Something went wrong');
                                // res.render('home', {
                                //     msg: "something Wrong",
                                //     sysid: ""
                                // });
                            }
                        }, pool);
                    }
                }
            }, pool);
        }
    },

    userRegistration: function (pool, req, res) { //function
        var info = {};
        info = req.body;

        var parameters = {
            query: 'usp_userRegistration',
            inputParameters: [{
                    type: 'string',
                    value: info.p_firstName
                },
                {
                    type: 'string',
                    value: info.p_middleName
                },
                {
                    type: 'string',
                    value: info.p_lastName
                },
                {
                    type: 'string',
                    value: info.p_email
                },
                {
                    type: 'string',
                    value: info.p_mobile
                },
                {
                    type: 'string',
                    value: info.p_phone
                },
                {
                    type: 'string',
                    value: info.p_DOB
                },
                {
                    type: 'string',
                    value: info.p_gender
                },
                {
                    type: 'int',
                    value: info.p_store_ID
                },
                {
                    type: 'int',
                    value: info.p_registered_store
                },
                {
                    type: 'int',
                    value: info.p_emailPromoEnabled
                },
                {
                    type: 'int',
                    value: info.p_user_ID
                }
            ],
            hasoutputParameters: false

        }

        sqlConnect.connect('procedure', parameters, function (error, param) {
            if (error) {
                return utility.sendApiResponse(res, 3, null);
            }
            if (param) {
                if (param.affectedRows == 1) {
                    if (registration.p_user_ID == 0) {
                        utility.sendApiResponse(res, 0, {
                            result: "successfully registered",
                            code: 0
                        });
                    } else {
                        utility.sendApiResponse(res, 0, {
                            result: "successfully updated",
                            code: 0
                        });
                    }
                } else {
                    utility.sendApiResponse(res, 1, {
                        result: "not registered",
                        code: 1
                    });
                }
            }
        }, pool);

    },

    getUser: function (pool, req, res) {
        var parameters = {
            query: 'call usp_getUser()', // calling storedProcedure for get request
        };
        sqlConnect.connect('query', parameters, function (error, param) {
            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            } // when error in sp
            if (param && param[0]) {
                // utility.sendApiResponse(res, 0, { result: param[0], code: 0 });
                utility.sendApiResponse(res, 0, {
                    result: param[0],
                    code: 0
                });
            } else {
                utility.sendApiResponse(res, 1, {
                    result: "null",
                    code: 1
                });
            }
        }, pool);
    },

    deleteUser: function (pool, req, res) {
        var info = {};
        info = req.body;

        var parameters = {
            query: 'usp_deleteUser',
            inputParameters: [{
                    type: 'int',
                    value: info.p_user_ID
                },
                {
                    type: 'int',
                    value: info.p_sysUser_ID
                }
            ],
            hasoutputParameters: false
        }
        sqlConnect.connect('procedure', parameters, function (error, param) {
            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            } // when error in sp
            if (param) {
                if (param.affectedRows == 1)
                    utility.sendApiResponse(res, 0, {
                        result: "successfully deleted",
                        code: 0
                    });
                else {
                    utility.sendApiResponse(res, 1, {
                        result: "not deleted",
                        code: 1
                    });
                }
            }
        }, pool);
    },

    transaction: function (pool, req, res) {
        var info = {};
        info = req.body;

        var parameters = {
            query: 'usp_Transaction',
            inputParameters: [{
                    type: 'int',
                    value: info.p_store_ID
                },
                {
                    type: 'int',
                    value: info.p_sysUser_ID
                },
                {
                    type: 'int',
                    value: info.p_user_ID
                },
                // { type: 'int', value: info.p_invoice_ID },
                {
                    type: 'int',
                    value: info.p_discount
                },
                {
                    type: 'int',
                    value: info.p_GST
                },
                {
                    type: 'int',
                    value: info.p_SGST
                },
                {
                    type: 'int',
                    value: info.p_CGST
                },
                {
                    type: 'string',
                    value: info.p_totalAmount
                },
                {
                    type: 'string',
                    value: info.p_paymentMode
                },
                {
                    type: 'string',
                    value: info.p_transactionType
                },
                {
                    type: 'int',
                    value: info.p_transaction_ID
                },
            ],
            hasoutputParameters: false
        }

        sqlConnect.connect('procedure', parameters, function (error, param) {

            if (error) {
                utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                }); // when error in sp
            }
            if (param) {
                if (param.affectedRows == 1) {
                    utility.sendApiResponse(res, 0, {
                        result: "successfully inserted",
                        code: 0
                    });
                } else {
                    utility.sendApiResponse(res, 1, {
                        result: "not inserted",
                        code: 1
                    });
                }
            }
        }, pool);
    },

    getTransaction: function (pool, req, res) {
        var parameters = {
            query: 'call usp_getTransaction()', // calling storedProcedure for get request
        }
        sqlConnect.connect('query', parameters, function (error, param) {
            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            } // when error in sp
            if (param && param[0]) {
                utility.sendApiResponse(res, 0, {
                    result: param[0],
                    code: 0
                });
            } else {
                utility.sendApiResponse(res, 1, {
                    result: "null",
                    code: 1
                });
            }
        }, pool);
    },

    checkSysEmailexist: function (pool, req, res) {
        var info = {};
        info = req.body;
        var parameters = {
            query: 'usp_checkSysEmailexist',
            inputParameters: [{
                    type: 'string',
                    value: info.p_email
                },
                {
                    type: 'int',
                    value: info.p_storeId
                }
            ],
            hasoutputParameters: false
        }
        sqlConnect.connect('procedure', parameters, function (error, param) {
            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            } // when error in sp
            if (param) {
                if (param[0][0]) {
                    if (param[0][0].isExist == 0) {
                        utility.sendApiResponse(res, 1, {
                            result: "email not exist",
                            code: 1
                        });
                    } else {
                        utility.sendApiResponse(res, 0, {
                            result: "email exist",
                            code: 0
                        });
                    }
                }

            }
        }, pool);
    },

    checkSysUserexist: function (pool, req, res) {
        var info = {};
        info = req.body;
        var parameters = {
            query: 'usp_checkSysUserexist',
            inputParameters: [{
                    type: 'string',
                    value: info.p_userName
                },
                {
                    type: 'int',
                    value: info.p_storeId
                }
            ],
            hasoutputParameters: false
        }

        sqlConnect.connect('procedure', parameters, function (error, param) {
            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            }
            if (param) {
                if (param[0][0]) {
                    if (param[0][0].isExist == 0) {
                        utility.sendApiResponse(res, 1, {
                            result: "userName not exist",
                            code: 1
                        });
                    } else {
                        utility.sendApiResponse(res, 0, {
                            result: "userName exist",
                            code: 0
                        });
                    }
                }
            }
        }, pool);
    },

    deleteTransaction: function (pool, req, res) {
        var info = {};
        info = req.body;

        var parameters = {
            query: 'usp_DeleteTransaction',
            inputParameters: [{
                    type: 'int',
                    value: info.p_transaction
                },
                {
                    type: 'int',
                    value: info.sys_UserID
                },
            ],
            hasoutputParameters: false
        }
        sqlConnect.connect('procedure', parameters, function (error, param) {
            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            } // when error in sp
            if (param) {
                if (param.affectedRows == 1)
                    utility.sendApiResponse(res, 0, {
                        result: "transaction deleted",
                        code: 0
                    });
                else {
                    utility.sendApiResponse(res, 1, {
                        result: "transaction not deleted",
                        code: 1
                    });
                }
            }
        }, pool);
    },

    addUpdateStore: function (pool, req, res) {
        var info = {};
        info = req.body;
        console.log("info", info);
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();

        var parameters = {
            query: 'usp_addUpdateStore',
            inputParameters: [{
                    type: 'int',
                    value: info.p_store_ID
                },
                {
                    type: 'string',
                    value: info.p_storeName
                },
                {
                    type: 'int',
                    value: info.p_category_ID
                },
                {
                    type: 'string',
                    value: info.p_storeAddress
                },
                {
                    type: 'string',
                    value: info.p_city
                },
                {
                    type: 'string',
                    value: info.p_state
                },
                {
                    type: 'string',
                    value: info.p_pin
                },
                {
                    type: 'string',
                    value: year + '-' + month + '-' + day + ' ' + info.p_openTime + ':00'
                },
                {
                    type: 'string',
                    value: year + '-' + month + '-' + day + ' ' + info.p_closeTime + ':00'
                },
                {
                    type: 'string',
                    value: info.p_managerName
                },
                {
                    type: 'int',
                    value: info.p_employeesCount
                },
                {
                    type: 'string',
                    value: info.p_contactNumber
                },
                {
                    type: 'int',
                    value: info.p_sys_UserID
                }
            ],
            hasoutputParameters: false
        }

        console.log("param", parameters);
        sqlConnect.connect('procedure', parameters, function (error, param) {
            console.log("param2", error, param);
            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            } // when error in sp
            if (param) {
                // if (param.affectedRows == 1)
                //     utility.sendApiResponse(res, 0, { result: "store updated", code: 0, storeId: param[0][0].store_ID });
                // else {
                //     utility.sendApiResponse(res, 0, { result: "store created", code: 0, storeId: param[0][0].store_ID });
                // }
            }
        }, pool);
    },

    checkStoreExist: function (pool, req, res) {
        var info = {};
        info = req.body;

        var parameters = {
            query: 'usp_checkStoreexist',
            inputParameters: [{
                type: 'string',
                value: info.p_storeName
            }],
            hasoutputParameters: false
        }
        sqlConnect.connect('procedure', parameters, function (error, param) {
            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            } // when error in sp
            if (param) {
                if (param[0][0]) {
                    if (param[0][0].isExist == 0) {
                        utility.sendApiResponse(res, 1, {
                            result: "storeName not exist",
                            code: 1
                        });
                    } else {
                        utility.sendApiResponse(res, 0, {
                            result: "storeName exist",
                            code: 0
                        });
                    }
                }
            }
        }, pool);
    },

    addUpdateProduct: function (pool, req, res) {
        // console.log("check input data", req.body);
        var data = req.body;
        if (req.body.p_productId) {
            var currentDateTime = new Date,
                dformat = [currentDateTime.getFullYear(), currentDateTime.getMonth() + 1,
                    currentDateTime.getDate()
                ].join('-') + ' ' + [currentDateTime.getHours(),
                    currentDateTime.getMinutes(),
                    currentDateTime.getSeconds()
                ].join(':');


            var params = {
                store_ID: `"${parseInt(data.p_storeID)}"`,
                image_path: `"${req.body.p_image_path}"`,
                sysUser_ID: `"${parseInt(data.p_sysUser_ID)}"`,
                barcodeReader_ID: `"${data.p_barcodeReaderId ? parseInt(data.p_barcodeReaderId) : 0}"`,
                UOM_ID: `"${data.p_UomId ? parseInt(data.p_UomId) : 0}"`,
                productName: `"${data.p_productName}"`,
                brandName: `"${data.p_brandName}"`,
                description: `"${data.p_description}"`,
                constrains: `"${data.p_constrains}"`,
                unitPrice: `"${data.p_unitPrice}"`,
                costPrice: `"${data.p_costPrice}"`,
                category: `"${data.p_category}"`,
                gst_ID: `"${parseInt(data.p_gstId)}"`,
                supplier_id: `"${data.p_supplierId ? parseInt(data.p_supplierId) : 0}"`,
                discount: `"${data.p_discount ? parseInt(data.p_discount) : 0}"`,
                HSN_ID: `"${data.p_HSN_ID}"`,
                happyHours: `"${data.p_Happy_Hours}"`,
                totalstock: `"${parseInt(data.p_totalstock)}"`,
                expirydate: `"${(data.p_expirydate) ? data.p_expirydate : "2050-01-01"}"`,
                modifiedOn: `"${dformat}"`,
                modifiedBy: `"${parseInt(data.p_sysUser_ID)}"`,
                subcategory_ID: `"${parseInt(data.p_subcategory_ID)}"`,
                isDeleted: 0
            }
            var updateQuery = Object.keys(params).map(item => {
                return `${item}=${params[item]}`
            });
            var parameters = {
                query: `UPDATE tbl_product SET ${updateQuery.join(',')} WHERE product_ID="${req.body.p_productId}";`
            }
            sqlConnect.connect('query', parameters, function (error, param, fields) {
                console.log("error and data on add", error, param);
                if (error) {
                    utility.sendApiResponse(res, 3, {
                        result: error,
                        code: 3
                    });
                } else if (param.affectedRows) {
                    utility.sendApiResponse(res, 0, {
                        result: param.affectedRows,
                        code: 0
                    });
                } else {
                    utility.sendApiResponse(res, 1, {
                        result: param[0],
                        code: 1
                    });
                }
            }, pool);
        } else {
            var info = {};
            info = req.body;
            var parameters = {
                query: 'usp_addUpdateProduct',
                inputParameters: [{
                        type: 'string',
                        value: info.p_productId
                    },
                    {
                        type: 'int',
                        value: info.p_storeID
                    },
                    {
                        type: 'string',
                        value: info.p_image_path
                    },
                    {
                        type: 'int',
                        value: info.p_sysUser_ID
                    },
                    {
                        type: 'int',
                        value: info.p_barcodeReaderId ? parseInt(info.p_barcodeReaderId) : 0
                    },
                    {
                        type: 'int',
                        value: info.p_UomId ? parseInt(info.p_UomId) : 0
                    },

                    {
                        type: 'string',
                        value: info.p_productName
                    },
                    {
                        type: 'string',
                        value: info.p_brandName
                    },
                    {
                        type: 'string',
                        value: info.p_description
                    },
                    {
                        type: 'string',
                        value: info.p_constrains
                    },

                    {
                        type: 'int',
                        value: info.p_unitPrice
                    },
                    {
                        type: 'string',
                        value: info.p_category
                    },
                    {
                        type: 'int',
                        value: info.p_gstId
                    },
                    {
                        type: 'int',
                        value: info.p_supplierId ? info.p_supplierId : 0
                    },

                    {
                        type: 'int',
                        value: info.p_discount ? info.p_discount : 0
                    },
                    {
                        type: 'string',
                        value: info.p_HSN_ID
                    },
                    {
                        type: 'int',
                        value: info.p_Happy_Hours
                    },
                    {
                        type: 'int',
                        value: info.p_totalstock
                    },
                    {
                        type: 'string',
                        value: info.p_expirydate ? info.p_expirydate : "2050-01-01"
                    },
                    {
                        type: 'string',
                        value: info.p_generated_product_id
                    },
                    {
                        type: 'int',
                        value: info.p_costPrice
                    },
                    {
                        type: 'int',
                        value: parseInt(info.p_subcategory_ID)
                    }

                ],
                hasoutputParameters: false
            }

            console.log("check input quey", parameters);
            sqlConnect.connect('procedure', parameters, function (error, param) {
                console.log("error and data", error, param);
                if (error)
                    return utility.sendApiResponse(res, 3, {
                        result: error,
                        code: 3
                    }); // when error in sp
                if (param) {
                    if (param[0] && param[0][0]) {
                        if (param[0][0].ResultCode == 0) {
                            utility.sendApiResponse(res, 0, {
                                result: param[0][0].Result,
                                code: 0
                            });
                        } else {
                            utility.sendApiResponse(res, 1, {
                                result: param[0][0].Result,
                                code: 1
                            });
                        }
                    }
                }
            }, pool);
        }

    },

    deleteProduct: function (pool, req, res) {
        var info = {};
        info = req.body;

        var parameters = {
            query: 'usp_deleteProduct',
            inputParameters: [{
                    type: 'string',
                    value: info.p_productId
                },
                {
                    type: 'int',
                    value: info.p_userId
                },
                {
                    type: 'int',
                    value: info.p_store_Id
                }
            ],
            hasoutputParameters: false
        }
        sqlConnect.connect('procedure', parameters, function (error, param) {
            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            } // when error in sp
            if (param) {
                if (param[0][0]) {
                    if (param[0][0].ResultCode == 0) {
                        utility.sendApiResponse(res, 0, {
                            result: param[0][0].Result,
                            code: 0
                        });
                    } else {
                        utility.sendApiResponse(res, 1, {
                            result: "This product doesn't belong to this store",
                            code: 1
                        });
                    }
                } else { //added aug-28
                    utility.sendApiResponse(res, 1, {
                        result: 'An error has occurred, operation rollbacked and the stored procedure was terminated',
                        code: 1
                    });
                }
            }
        }, pool);
    },

    getProductCount: function (pool, req, res) {
        var info = {};
        info = req.body;
        userAccessUserID(pool, req, res).then(function (data) {
            // SELECT * FROM tbl_product where Limit 10;
            if (data[0].role == "SADM") {
                if (info.p_productName == "" || info.p_productName == null || info.p_productName == undefined) {
                    var parameters = {
                        query: `SELECT COUNT(*) FROM tbl_product where isDeleted = 0;`
                    }
                } else {
                    var parameters = {
                        query: `SELECT COUNT(*) FROM tbl_product where isDeleted = 0 AND productName LIKE '%${info.p_productName}%'or brandName LIKE '%${info.p_productName}%'or description LIKE '%${info.p_productName}%'or constrains LIKE '%${info.p_productName}%'or category LIKE '%${info.p_productName}%';`
                    }
                }
            } else {
                if (info.p_productName == "" || info.p_productName == null || info.p_productName == undefined) {
                    var parameters = {
                        query: `SELECT COUNT(*) FROM tbl_product where isDeleted = 0 && store_ID = ${data[0].store_ID};`
                    }
                } else {
                    var parameters = {
                        query: `SELECT COUNT(*) FROM tbl_product where store_ID = ${data[0].store_ID} AND isDeleted = 0 AND productName LIKE '%${info.p_productName}%'or brandName LIKE '%${info.p_productName}%'or description LIKE '%${info.p_productName}%'or constrains LIKE '%${info.p_productName}%'or category LIKE '%${info.p_productName}%';`
                    }
                }
            }

            sqlConnect.connect('query', parameters, function (error, param, fields) {
                if (error)
                    utility.sendApiResponse(res, 3, {
                        result: error,
                        code: 3
                    }); // when error in sp
                if (param) {
                    if (param && param[0] && param[0][0] && param[0][0].ResultCode == 1) {
                        utility.sendApiResponse(res, 1, {
                            result: param[0],
                            code: 1
                        });
                    } else {
                        utility.sendApiResponse(res, 0, {
                            result: param[0],
                            code: 0
                        });
                    }
                }
            }, pool);

        }).catch(function (error) {
            utility.sendApiResponse(res, 3, {
                result: error,
                code: 3
            });
        });

    },
    getCountAboutOutofStock: function (pool, req, res) {
        var info = req.body;
        var parameters = {
            query: `SELECT COUNT(*) from tbl_product where isDeleted = 0 and totalstock >0 and totalstock <=4`
        }
        sqlConnect.connect('query', parameters, function (error, param, fields) {
            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            } // when error in sp
            if (param) {
                if (param && param[0]) {
                    utility.sendApiResponse(res, 0, {
                        result: param[0]['COUNT(*)'],
                        code: 1
                    });
                } else {
                    utility.sendApiResponse(res, 1, {
                        result: param[0],
                        code: 0
                    });
                }
            }
        }, pool);

    },
    getCountOutofStock: function (pool, req, res) {
        var info = req.body;
        var parameters = {
            query: `SELECT COUNT(*) from tbl_product where isDeleted = 0 and totalstock <=0`
        }
        sqlConnect.connect('query', parameters, function (error, param, fields) {
            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            } // when error in sp
            if (param) {
                if (param && param[0]) {
                    utility.sendApiResponse(res, 0, {
                        result: param[0]['COUNT(*)'],
                        code: 1
                    });
                } else {
                    utility.sendApiResponse(res, 1, {
                        result: param[0],
                        code: 0
                    });
                }
            }
        }, pool);

    },

    getProduct2: function (pool, req, res) {
        var info = {};
        info = req.body;
        userAccessUserID(pool, req, res).then(function (data) {
            // SELECT * FROM tbl_product where Limit 10;
            if (info.p_productName == "" || info.p_productName == null || info.p_productName == undefined) {
                var parameters = {
                    query: `SELECT * FROM tbl_product where isDeleted = 0 and store_ID = ${data[0].store_ID} Limit ${info.p_limit} OFFSET ${info.p_offset};`,
                }
            } else {
                var parameters = {
                    query: `SELECT * FROM tbl_product where store_ID = ${data[0].store_ID} AND productName LIKE '%${info.p_productName}%'or brandName LIKE '%${info.p_productName}%'or description LIKE '%${info.p_productName}%'or constrains LIKE '%${info.p_productName}%'or category LIKE '%${info.p_productName}%' and isDeleted = 0 Limit ${info.p_limit} OFFSET ${info.p_offset};`,
                }
            }
            sqlConnect.connect('query', parameters, function (error, param, fields) {
                if (error)
                    utility.sendApiResponse(res, 3, {
                        result: error,
                        code: 3
                    }); // when error in sp
                if (param) {
                    if (param && param[0] && param[0][0] && param[0][0].ResultCode == 1) {
                        utility.sendApiResponse(res, 1, {
                            result: param[0],
                            code: 1
                        });
                    } else {
                        utility.sendApiResponse(res, 0, {
                            result: param,
                            code: 0
                        });
                    }
                }
            }, pool);

        }).catch(function (error) {
            utility.sendApiResponse(res, 3, {
                result: error,
                code: 3
            });
        });

    },
    searchProdByName: function (pool, req, res) {
        var info = {};
        userAccessUserID(pool, req, res).then(function (data) {
            // SELECT * FROM tbl_product where Limit 10;
            var parameters = {
                query: `SELECT * FROM tbl_product where isDeleted = 0 and store_ID = ${data[0].store_ID}  Limit ${info.p_limit} OFFSET ${info.p_offset};`,
            }

            sqlConnect.connect('query', parameters, function (error, param, fields) {
                if (error)
                    utility.sendApiResponse(res, 3, {
                        result: error,
                        code: 3
                    }); // when error in sp
                if (param) {
                    if (param && param[0] && param[0][0] && param[0][0].ResultCode == 1) {
                        utility.sendApiResponse(res, 1, {
                            result: param[0],
                            code: 1
                        });
                    } else {
                        utility.sendApiResponse(res, 0, {
                            result: param,
                            code: 0
                        });
                    }
                }
            }, pool);

        }).catch(function (error) {
            utility.sendApiResponse(res, 3, {
                result: error,
                code: 3
            });
        });

    },
    getProduct: function (pool, req, res) {
        //    var data =  SELECT * FROM tbl_product Limit 10;
        var info = {};
        info = req.body;

        userAccessUserID(pool, req, res).then(function (data) {

            if (data[0].role == accessCodeAdmin) {
                var parameters = {
                    query: 'usp_getProduct_admin',
                    inputParameters: [{
                        type: 'int',
                        value: data[0].store_ID
                    }],
                    hasoutputParameters: false
                }
            } else {
                var parameters = {
                    query: 'usp_getProduct',
                    inputParameters: [{
                        type: 'int',
                        value: data[0].store_ID
                    }, ],
                    hasoutputParameters: false
                }
            }
            sqlConnect.connect('procedure', parameters, function (error, param) {
                if (error)
                    utility.sendApiResponse(res, 3, {
                        result: error,
                        code: 3
                    }); // when error in sp
                if (param) {
                    if (param[0][0].ResultCode == 1) {
                        utility.sendApiResponse(res, 1, {
                            result: param[0],
                            code: 1
                        });
                    } else {
                        utility.sendApiResponse(res, 0, {
                            result: param,
                            code: 0
                        });
                    }
                }
            }, pool);

        }).catch(function (error) {
            utility.sendApiResponse(res, 3, {
                result: error,
                code: 3
            });
        });

    },

    transactionPurchase: function (pool, req, res) {
        var info = {};
        info = req.body;

        var parameters = {
            query: 'usp_transaction_purchase',
            inputParameters: [{
                    type: 'int',
                    value: info.p_store_ID
                },
                {
                    type: 'int',
                    value: info.p_sysUser_ID
                },
                {
                    type: 'int',
                    value: info.p_user_ID
                }, // customerID
                {
                    type: 'int',
                    value: info.p_discount
                },
                {
                    type: 'string',
                    value: info.p_gst
                },
                {
                    type: 'string',
                    value: info.p_sgst
                },
                {
                    type: 'string',
                    value: info.p_cgst
                },
                {
                    type: 'int',
                    value: info.p_totalAmount
                },
                {
                    type: 'string',
                    value: info.p_paymentMode
                },
                {
                    type: 'string',
                    value: info.p_transactionType
                }
            ],
            hasoutputParameters: false
        }
        sqlConnect.connect('procedure', parameters, function (error, param) {
            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            } // when error in sp
            res.redirect(url.format({
                pathname: "/ejs",
                query: {
                    "msg": "something Wrong",
                    "sysid": req.body.sysid
                }
            }));
            if (param) {
                if (param[0][0]) {
                    if (param[0][0].ResultCode == 0) {
                        utility.sendApiResponse(res, 0, {
                            result: param[0][0].Result,
                            code: 0
                        });
                    } else {
                        utility.sendApiResponse(res, 1, {
                            result: param[0][0].Result,
                            code: 1
                        });
                    }
                }
            }
        }, pool);
    },

    transactionInvoiceItems: function (pool, req, res) {
        var info = {};
        info = req.body;

        var parameters = {
            query: 'usp_transaction_invoice_items',
            inputParameters: [{
                    type: 'int',
                    value: info.p_transaction_ID
                },
                {
                    type: 'int',
                    value: info.p_store_ID
                },
                {
                    type: 'int',
                    value: info.p_product_ID
                },
                {
                    type: 'int',
                    value: info.p_quantity
                },
                {
                    type: 'int',
                    value: info.p_discount
                }
            ],
            hasoutputParameters: false
        }
        sqlConnect.connect('procedure', parameters, function (error, param) {
            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            } // when error in sp
            if (param) {
                if (param[0][0]) {
                    if (param[0][0].ResultCode == 0) {
                        utility.sendApiResponse(res, 0, {
                            result: param[0][0].Result,
                            code: 0
                        });
                    } else {
                        utility.sendApiResponse(res, 1, {
                            result: param[0][0].Result,
                            code: 1
                        });
                    }
                }
            }
        }, pool);
    },

    getStore: function (pool, req, res) {
        var sysUser_ID = req.body.userID;
        let limit;
        let offset;
        if (req.body.obj.page == undefined || req.body.obj.page == NaN || req.body.obj.limit == undefined || req.body.obj.limit == NaN) {
            limit = 10;
            offset = 0;
        } else {
            offset = (req.body.obj.page - 1) * (req.body.obj.limit);
            limit = (req.body.obj.limit);
        }


        var parameters = {
            query: 'SELECT store_ID, role FROM tbl_sysuser where sysUser_ID =' + sysUser_ID,
        }

        sqlConnect.connect('query', parameters, function (error, param) {
            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            } // when error in sp

            if (param && param.length > 0) {

                var getStoreByRole = function (data, pool, req, res) {
                    if (data[0].role == 'SADM') {
                        var parameters = {
                            query: 'Select (select sum(case WHEN isDeleted = false  Then 1 else 0 end) as Records from tbl_store) as totalRecord , c.categoryName,s.store_ID,s.storeName,s.storeAddress,s.category_ID,s.city,s.state,s.pin,s.openTime,s.closeTime,s.managerName,s.AdminID,s.employeesCount,s.contactNumber FROM tbl_store as s JOIN tbl_category as c Where s.category_ID=c.category_ID and s.isDeleted=0  LIMIT ' + limit + ' OFFSET ' + offset,
                        }
                    } else {
                        var parameters = {
                            query: 'Select (select sum(case WHEN isDeleted = false  Then 1 else 0 end) as Records from tbl_store) as totalRecord , c.categoryName,s.store_ID,s.storeName,s.storeAddress,s.category_ID,s.city,s.state,s.pin,s.openTime,s.closeTime,s.managerName,s.AdminID,s.employeesCount,s.contactNumber FROM tbl_store as s JOIN tbl_category as c Where s.category_ID=c.category_ID and s.isDeleted=0  and s.store_ID =' + data[0].store_ID + ' LIMIT ' + limit + ' OFFSET ' + offset,
                        }
                    }
                    sqlConnect.connect('query', parameters, function (error, param) {
                        if (error)
                            utility.sendApiResponse(res, 3, {
                                result: error,
                                code: 3
                            }); // when error in sp

                        if (param && param.length > 0) {
                            utility.sendApiResponse(res, 0, {
                                result: param,
                                code: 0
                            });
                        } else {
                            utility.sendApiResponse(res, 1, {
                                result: "null",
                                code: 1
                            });
                        }
                    }, pool);
                };
                getStoreByRole(param, pool, req, res);

            } else {
                utility.sendApiResponse(res, 1, {
                    result: "null",
                    code: 1
                });
            }

        }, pool);
    },

    getAllStoreId: function (pool, req, res) {

        var parameters = {
            query: 'select store_ID FROM tbl_store ;'
        }

        sqlConnect.connect('query', parameters, function (error, param) {

            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            } // when error in sp
            if (param && param[0]) {
                utility.sendApiResponse(res, 0, {
                    result: param,
                    code: 0
                });
            } else {
                utility.sendApiResponse(res, 1, {
                    result: "null",
                    code: 1
                });
            }
        }, pool);
    },



    deleteStore: function (pool, req, res) {
        var parameters = {
            query: 'Update tbl_store set isDeleted=1 where store_ID=' + req.body.store_ID,
        }


        sqlConnect.connect('query', parameters, function (error, param) {

            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            } // when error in sp
            if (param.affectedRows > 0) {
                utility.sendApiResponse(res, 0, {
                    result: param,
                    code: 0
                });
            } else {
                utility.sendApiResponse(res, 1, {
                    result: "null",
                    code: 1
                });
            }
        }, pool);
    },

    createStore: function (pool, req, res) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let day = date.getDate();
        if (month < 10) {
            month = '' + 0 + month;
        }
        if (day < 10) {
            day = '' + 0 + day;
        }
        if (req.body) {
            var open_Time = (req.body.p_openTime != undefined) ? `${JSON.stringify(year + '-' + month + '-' + day + ' ' + req.body.p_openTime + ':00')}` : null;
            var close_Time = (req.body.p_closeTime != undefined) ? `${JSON.stringify(year + '-' + month + '-' + day + ' ' + req.body.p_closeTime + ':00')}` : null;
            var pin = req.body.p_pin ? req.body.p_pin : null;
            var emp_count = req.body.p_employeesCount ? req.body.p_employeesCount : null;
        }

        var parameters = {
            query: `Insert into tbl_store (storeName,category_ID, storeAddress,city,state,pin,openTime,closeTime,managerName,employeesCount,contactNumber,isDeleted, createdOn) values(${JSON.stringify(req.body.p_storeName)},
             ${req.body.p_category_ID}, ${JSON.stringify(req.body.p_storeAddress)},
              ${JSON.stringify(req.body.p_city)},${JSON.stringify(req.body.p_state)},
              ${pin},${open_Time},${close_Time},
                ${JSON.stringify(req.body.p_managerName)}, ${emp_count}, ${req.body.p_contactNumber},0,
                ${JSON.stringify(year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds)});`
        }
        sqlConnect.connect('query', parameters, function (error, param, fields) {
            console.log("ee", error, param);
            if (error) {
                utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            }

            if (param) {
                if (param.affectedRows > 0) {
                    console.log("param", param);
                    // edited by regan 02-august
                    utility.sendApiResponse(res, 0, {
                        result: param,
                        fields: fields,
                        code: 0
                    });
                } else {
                    utility.sendApiResponse(res, 1, {
                        result: param,
                        fields: fields,
                        code: 1
                    });
                }
            }



        }, pool);
    },
    // Create Category
    createCategory: function (pool, req, res) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let day = date.getDate();
        if (month < 10) {
            month = '' + 0 + month;
        }
        if (day < 10) {
            day = '' + 0 + date;
        }
        var parameters = {
            query: `Insert into tbl_category ( categoryName, Description ) values( ${JSON.stringify(req.body.p_categoryName)}, ${JSON.stringify(req.body.p_categoryDescription)});`
        }


        sqlConnect.connect('query', parameters, function (error, param, fields) {
            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            } else {
                utility.sendApiResponse(res, 0, {
                    result: param,
                    fields: fields,
                    code: 0
                });
            }

        }, pool);
    },
    // Create Subcategory
    createSubcategory: function (pool, req, res) {
        if (req.body.p_subcategoryName == "" || req.body.p_subcategoryName == null || req.body.p_subcategoryName == undefined) {
            utility.sendApiResponse(res, 3, {
                result: "Subcategory's name can't be blank",
                code: 3
            });
            // res.status(422).send({ error: "Subcategory's name can't be blank" })
        } else {
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();
            let day = date.getDate();
            if (month < 10) {
                month = '' + 0 + month;
            }
            if (day < 10) {
                day = '' + 0 + date;
            }
            var parameters = {
                query: `Insert into tbl_subcategory ( subcategoryName, category_ID, Description ) values( ${JSON.stringify(req.body.p_subcategoryName)}, ${JSON.stringify(req.body.p_category_ID)}, ${JSON.stringify(req.body.p_Description)});`
            }


            sqlConnect.connect('query', parameters, function (error, param, fields) {
                if (error)
                    utility.sendApiResponse(res, 3, {
                        result: error,
                        code: 3
                    });
                else {
                    utility.sendApiResponse(res, 0, {
                        result: param,
                        fields: fields,
                        code: 0
                    });
                }

            }, pool);
        }
    },

    updateStore: function (pool, req, res) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        month = '' + 0 + month;
        let day = date.getDate();
        let openTime = req.body.p_openTime == null ? null : year + '-' + month + '-' + day + ' ' + req.body.p_openTime + ':00';
        let closeTime = req.body.p_closeTime == null ? null : year + '-' + month + '-' + day + ' ' + req.body.p_closeTime + ':00';
        var parameters = {
            query: `Update tbl_store set storeName=${JSON.stringify(req.body.p_storeName)},storeAddress=${JSON.stringify(req.body.p_storeAddress)},category_ID=${req.body.p_category_ID},city=${JSON.stringify(req.body.p_city)},state=${JSON.stringify(req.body.p_state)},pin=${req.body.p_pin},openTime=${JSON.stringify(openTime)},closeTime=${JSON.stringify(closeTime)},managerName=${JSON.stringify(req.body.p_managerName)},employeesCount=${req.body.p_employeesCount},contactNumber= ${req.body.p_contactNumber},isDeleted=0 where store_ID = ${req.body.p_store_ID}`
        }

        sqlConnect.connect('query', parameters, function (error, param, fields) {
            if (error)
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            if (param && param.affectedRows > 0) {
                return utility.sendApiResponse(res, 0, {
                    result: param,
                    fields: fields,
                    code: 0
                });
            } else {
                return utility.sendApiResponse(res, 1, {
                    result: param,
                    fields: fields,
                    code: 1
                });
            }
        }, pool);
    },

    getManagers: function (pool, req, res) {
        let limit;
        let offset;
        if (req.body.info.page == undefined || req.body.info.page == NaN || req.body.info.limit == undefined || req.body.info.limit == NaN) {
            limit = 10;
            offset = 0;
        } else {
            offset = (req.body.info.page - 1) * (req.body.info.limit);
            limit = (req.body.info.limit);
        }
        var parameters = {
            query: 'SELECT (select sum(case WHEN store_ID = ' + req.body.info.id + ' and isDeleted = false Then 1 else 0 end) as Records from tbl_sysuser) as totalRecord , store_ID, role,firstName, email , userName , middleName,lastName, emergencyContact,sysUser_ID, password , mobile FROM tbl_sysuser where isDeleted=0 and store_ID =' + req.body.info.id + ' LIMIT ' + limit + ' OFFSET ' + offset,
        }
        sqlConnect.connect('query', parameters, function (error, param) {
            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            } // when error in sp

            if (param && param.length > 0) {
                utility.sendApiResponse(res, 0, {
                    result: param,
                    code: 0
                });
            } else {
                utility.sendApiResponse(res, 1, {
                    result: "null",
                    code: 1
                });
            }
        }, pool);
    },

    deleteManagers: function (pool, req, res) {
        var parameters = {
            query: 'Update tbl_sysuser set isDeleted=1 where sysUser_ID=' + req.body.sysUser_ID,
        }

        sqlConnect.connect('query', parameters, function (error, param) {
            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            }
            if (param && param.affectedRows > 0) {
                utility.sendApiResponse(res, 0, {
                    result: param,
                    code: 0
                });
            } else {
                utility.sendApiResponse(res, 1, {
                    result: "null",
                    code: 1
                });
            }
        }, pool);
    },

    getUoms: function (pool, req, res) {
        var parameters = {
            query: 'SELECT UOM_ID,description FROM tbl_unitofmeasurement',
        }
        sqlConnect.connect('query', parameters, function (error, param) {
            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            } // when error in sp

            if (param && param.length > 0) {
                utility.sendApiResponse(res, 0, {
                    result: param,
                    code: 0
                });
            } else {
                utility.sendApiResponse(res, 1, {
                    result: "null",
                    code: 1
                });
            }
        }, pool);
    },

    addUoms: function (pool, req, res) {
        var parameters = {
            query: `Insert into tbl_unitofmeasurement ( description) values( ${JSON.stringify(req.body.uom)});`
        }
        sqlConnect.connect('query', parameters, function (error, param) {
            if (error)
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                }); // when error in sp

            if (param && param.affectedRows > 0) {
                utility.sendApiResponse(res, 0, {
                    result: param,
                    code: 0
                });
            } else {
                utility.sendApiResponse(res, 1, {
                    result: "null",
                    code: 1
                });
            }
        }, pool);
    },

    getList: function (pool, req, res) {
        var parameters = {
            query: 'SELECT Item,HSN_No,gst_ID,gst_Cat_ID FROM tbl_gst',
        }

        sqlConnect.connect('query', parameters, function (error, param) {
            if (error)
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                }); // when error in sp

            if (param && param.length > 0) {
                utility.sendApiResponse(res, 0, {
                    result: param,
                    code: 0
                });
            } else {
                utility.sendApiResponse(res, 1, {
                    result: "null",
                    code: 1
                });
            }
        }, pool);
    },

    getRole: function (pool, req, res) {
        var parameters = {
            query: 'SELECT distinct(code) as roles , name FROM tbl_roles;',
        }

        sqlConnect.connect('query', parameters, function (error, param) {
            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            }

            if (param && param.length > 0) {
                utility.sendApiResponse(res, 0, {
                    result: param,
                    code: 0
                });
            } else {
                utility.sendApiResponse(res, 1, {
                    result: "null",
                    code: 1
                });
            }
        }, pool);
    },
    categoryStore: function (pool, req, res) {

        var parameters = {
            query: 'SELECT category_ID, categoryName FROM tbl_category',
        }
        sqlConnect.connect('query', parameters, function (error, param) {
            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            } // when error in sp

            if (param && param.length > 0) {
                utility.sendApiResponse(res, 0, {
                    result: param,
                    code: 0
                });
            } else {
                utility.sendApiResponse(res, 1, {
                    result: "null",
                    code: 1
                });
            }
        }, pool);

    },

    // Subcategory Starts
    subcategoryStore: function (pool, req, res) {
        var parameters = {
            query: `SELECT subcategory_ID, subcategoryName, category_ID FROM tbl_subcategory where category_ID= ${req.body.category_ID};`
        }
        sqlConnect.connect('query', parameters, function (error, param) {
            if (error)
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                }); // when error in sp

            if (param && param.length > 0) {
                utility.sendApiResponse(res, 0, {
                    result: param,
                    code: 0
                });
            } else {
                utility.sendApiResponse(res, 1, {
                    result: "null",
                    code: 1
                });
            }
        }, pool);
    },
    // Subcategory Ends

    errorLog: function (pool, req, res) {
        let values = '';
        let errorCount = 0;


        for (let i = 0; i < req.body.logArray.length; i++) {

            if (req.body.logArray[i].log_ID == undefined || isNaN(req.body.logArray[i].log_ID) == false) {
                errorCount++;
                break;
            }
            if (req.body.logArray[i].methodName == undefined || isNaN(req.body.logArray[i].methodName) == false) {
                errorCount++;
                break;
            }
            if (req.body.logArray[i].className == undefined || isNaN(req.body.logArray[i].className) == false) {
                errorCount++;
                break;
            }
            if (req.body.logArray[i].errorMessage == undefined || isNaN(req.body.logArray[i].errorMessage) == false) {
                errorCount++;
                break;
            }
            if (req.body.logArray[i].createdOn == undefined || isNaN(req.body.logArray[i].createdOn) == false) {
                errorCount++;
                break;
            }
            if (req.body.logArray[i].store_ID == undefined || isNaN(req.body.logArray[i].store_ID) == true) {
                errorCount++;
                break;
            }

            values += `(${JSON
                .stringify(req
                    .body
                    .logArray[i]
                    .log_ID)},${JSON
                        .stringify(req.body.logArray[i].methodName)},${JSON
                            .stringify(req.body.logArray[i].className)},${JSON
                                .stringify(req.body.logArray[i].errorMessage)},${JSON
                                    .stringify(req.body.logArray[i].createdOn)},${req
                                        .body
                                        .logArray[i]
                                        .store_ID}),`
        }


        if (errorCount > 0 || values == '') {
            utility.sendApiResponse(res, 3, {
                result: "Error: Invalid Data Sent",
                code: 3
            });
        } else {
            var parameters = {
                query: `INSERT INTO tbl_logs (log_ID,methodName,className,errorMessage,createdOn,store_ID) VALUES ${values.slice(0, -1)}`
            }


            sqlConnect.connect('query', parameters, function (error, param) {
                if (error) {
                    utility.sendApiResponse(res, 3, {
                        result: error,
                        code: 3
                    });
                } else {

                    if (param) {
                        if (param.affectedRows > 0) {
                            utility.sendApiResponse(res, 0, {
                                result: param,
                                code: 0
                            });
                        } else {
                            utility.sendApiResponse(res, 1, {
                                result: "null",
                                code: 1
                            });
                        }
                    } else {
                        utility.sendApiResponse(res, 1, {
                            result: "null",
                            code: 1
                        });
                    }
                }

            }, pool);
        }
    }
}

function renderPage(req, res, page, msg) {
    return res.redirect(url.format({
        pathname: page,
        query: {
            msg,
            "sysid": req.body.sysid
        }
    }));
}