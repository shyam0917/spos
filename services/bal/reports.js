var sqlConnect = require('../tools/utility/mssql.connection');
var utility = require('../tools/utility/utility');
var accessCodeAdmin = 'SADM';
var jwt = require('jsonwebtoken');

function getReportsByUserRole(pool, req, res) {
    return new Promise(function (resolve, reject) {
        var sysUser_ID = req.body.userID;

        var parameters = {
            query: 'SELECT store_ID, role FROM tbl_sysuser where sysUser_ID =' + sysUser_ID
        }
        sqlConnect.connect('query', parameters, function (error, param) {
            if (error)
                reject(error);

            if (param) {
                resolve(param);
            }
        }, pool);

    });
}

function userAccess(pool, req, res) {
    return new Promise(function (resolve, reject) {
        var info = {};
        var token = JSON.parse(req.headers.token);
        if (token != undefined && token != 'null' && token != null) {
            var decodeToken = jwt.decode(token);
            info.p_username = decodeToken.p_username;
            info.p_password = decodeToken.p_password;
            if (info.p_username) {
                var parameters = {
                    query: 'SELECT store_ID, role FROM tbl_sysuser where userName = ' + JSON.stringify(info.p_username)
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

        } else {
            reject(error);
        }

    });
}

module.exports = {


    transactionReport: function (pool, req, res) {
        getReportsByUserRole(pool, req, res)
            .then(function (data) {
                var info = {};
                info = req.body;
                var query;

                function selectQuery(info) {
                    if (data[0].role == accessCodeAdmin) {
                        query = 'select transaction_ID, store_ID, sysUser_ID, custUser_ID, discount, GST, SGST, C' +
                            'GST, totalAmount, paymentMode, transactionType, createdOn, modifiedOn, deletedOn' +
                            ', isDeleted as isDeleted, deletedBy, isReturned as isReturned, returnDate, isVoi' +
                            'd as isVoid, voidDate, itemCount from tbl_transaction where isDeleted = 0 and ';
                    } else {
                        query = 'select transaction_ID, store_ID, sysUser_ID, custUser_ID, discount, GST, SGST, C' +
                            'GST, totalAmount, paymentMode, transactionType, createdOn, modifiedOn, deletedOn' +
                            ', isDeleted as isDeleted, deletedBy, isReturned as isReturned, returnDate, isVoi' +
                            'd as isVoid, voidDate, itemCount from tbl_transaction WHERE isDeleted = 0 and ' +
                            'store_ID = ' + req.body.p_store_ID + ' and ';
                    }

                    switch (info.p_queryType) {
                        case "Monthly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 month) and NOW()';
                            break;
                        case "Yearly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 year) and NOW()';
                            break;
                        case "Weekly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 week) and NOW()';
                            break;
                        case "Hourly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 hour) and NOW()';
                            break;
                        default:
                            query = query + 'createdOn between date_sub(NOW(),interval 1 month) and NOW()';
                    }
                    return query;
                }

                var parameters = {
                    query: selectQuery(info)
                };
                sqlConnect.connect('query', parameters, function (error, param) {
                    if (error) {
                        return utility.sendApiResponse(res, 3, {
                            result: error,
                            code: 3
                        });
                    } // when error in sp
                    else if (param && param[0]) {
                        return utility.sendApiResponse(res, 0, {
                            result: param,
                            code: 0
                        });
                    } else {
                        return utility.sendApiResponse(res, 1, {
                            result: "null",
                            code: 1
                        });
                    }
                }, pool);

            })
            .catch(function (error) {
                utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            });

    },
    getInvoiceDetail: function (pool, req, res) {
        var info = {};
        info = req.body;
        var parameters = {
            query: 'select product_ID, product_name, quantity, unitPrice ' +
                'from tbl_invoice WHERE store_ID = ' + req.body.p_store_ID + ' AND ' + 'transaction_ID = ' + req.body.p_transaction_ID + ' AND isDeleted = 0'
        }
        sqlConnect.connect('query', parameters, function (error, param) {

            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            }// when error in sp
            else if (param && param[0]) {
                return utility.sendApiResponse(res, 0, {
                    result: param,
                    code: 0
                });
            } else {
                return utility.sendApiResponse(res, 1, {
                    result: "null",
                    code: 1
                });
            }
        }, pool);
    },

    expiredGoods: function (pool, req, res) {
        let limit;
        let offset;
        // if (req.body.page == undefined || req.body.page == NaN || req.body.limit == undefined || req.body.limit == NaN) {
        //     limit = 10;
        //     offset = 0;
        // }
        // else {
        //     offset = (req.body.page - 1) * (req.body.limit);
        //     limit = req.body.limit;
        // }

        getReportsByUserRole(pool, req, res)
            .then(function (data) {
                var info = {};
                info = req.body;
                if (data[0].role == accessCodeAdmin) {

                    if (req.body.page == undefined || req.body.page == NaN || req.body.limit == undefined || req.body.limit == NaN) {
                        var parameters = {
                            query: 'select  (select sum(case WHEN isDeleted = false and ExpiryDate < NOW() Then 1 else 0 end) as Records from tbl_product) as totalRecord, product_ID, store_ID, sysUser_ID, barcodeReader_ID, UOM_ID, productName, ' +
                                'brandName, description, constrains, unitPrice, category, gst_ID, supplier_ID, di' +
                                'scount, createdOn, modifiedOn, deletedOn, isDeleted as isDeleted , deletedBy, HS' +
                                'N_ID, happyHours as happyHours, expiryDate, deleteReason, costPrice, totalstock ' +
                                'from tbl_product where isDeleted = 0 and ExpiryDate < NOW()'// queryTest(info),
                        }
                    } else {
                        offset = (req.body.page - 1) * (req.body.limit);
                        limit = req.body.limit;
                        var parameters = {
                            query: 'select (select sum(case WHEN isDeleted = false and ExpiryDate < NOW() Then 1 else 0 end) as Records from tbl_product) as totalRecord, product_ID, store_ID, sysUser_ID, barcodeReader_ID, UOM_ID, productName, ' +
                                'brandName, description, constrains, unitPrice, category, gst_ID, supplier_ID, di' +
                                'scount, createdOn, modifiedOn, deletedOn, isDeleted as isDeleted , deletedBy, HS' +
                                'N_ID, happyHours as happyHours, expiryDate, deleteReason, costPrice, totalstock ' +
                                'from tbl_product where isDeleted = 0 and ExpiryDate < NOW() LIMIT ' + limit + ' OFFSET ' + offset // queryTest(info),
                        }
                    }
                } else {
                    console.log("3")
                    if (req.body.page == undefined || req.body.page == NaN || req.body.limit == undefined || req.body.limit == NaN) {
                        var parameters = {
                            query: 'select (select sum(case WHEN isDeleted = false and Store_ID =' + info.p_store_ID + ' and ExpiryDate < NOW() Then 1 else 0 end) as Records from tbl_product) as totalRecord, product_ID, store_ID, sysUser_ID, barcodeReader_ID, UOM_ID, productName, ' +
                                'brandName, description, constrains, unitPrice, category, gst_ID, supplier_ID, di' +
                                'scount, createdOn, modifiedOn, deletedOn, isDeleted as isDeleted , deletedBy, HS' +
                                'N_ID, happyHours as happyHours, expiryDate, deleteReason, costPrice, totalstock ' +
                                'from tbl_product where isDeleted = 0 and Store_ID =' + info.p_store_ID + ' and ExpiryDate < NOW()' // queryTest(info),
                        }
                    }
                    else {
                        console.log("5")
                        offset = (req.body.page - 1) * (req.body.limit);
                        limit = req.body.limit;
                        var parameters = {
                            query: 'select (select sum(case WHEN isDeleted = false and Store_ID =' + info.p_store_ID + ' and ExpiryDate < NOW() Then 1 else 0 end) as Records from tbl_product) as totalRecord, product_ID, store_ID, sysUser_ID, barcodeReader_ID, UOM_ID, productName, ' +
                                'brandName, description, constrains, unitPrice, category, gst_ID, supplier_ID, di' +
                                'scount, createdOn, modifiedOn, deletedOn, isDeleted as isDeleted , deletedBy, HS' +
                                'N_ID, happyHours as happyHours, expiryDate, deleteReason, costPrice, totalstock ' +
                                'from tbl_product where isDeleted = 0 and Store_ID =' + info.p_store_ID + ' and ExpiryDate < NOW() LIMIT ' + limit + ' OFFSET ' + offset // queryTest(info),
                        }
                    }
                }
                sqlConnect
                    .connect('query', parameters, function (error, param) {
                        if (error) {
                            return utility.sendApiResponse(res, 3, {
                                result: error,
                                code: 3
                            });
                        } // when error in sp
                        if (param && param[0]) {
                            return utility.sendApiResponse(res, 0, {
                                result: param,
                                code: 0
                            });
                        } else {
                            return utility.sendApiResponse(res, 1, {
                                result: "null",
                                code: 1
                            });
                        }
                    }, pool);

            })
            .catch(function (error) {
                utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            });

    },


    // download for excel file
    exportToExcel: function (pool, req, res) {
        console.log(" Start");
        var parameters = {
            query: req.body.info
        };
        console.log(" body exportToExcel in report.js", parameters, parameters.query);


        sqlConnect.connect('query', parameters, function (error, param) {
            console.log("eror in exptoExl report,js", error);
            if (error) {
                return utility.sendApiResponse(res, 3, { result: error, code: 3 });
            } // when error in sp
            if (param && param[0]) {
                utility.sendApiResponse(res, 0, { result: param, code: 0 });
            } else {
                utility.sendApiResponse(res, 1, { result: "null", code: 1 });
            }
        }, pool);
    },

    cashSummary: function (pool, req, res) {

        getReportsByUserRole(pool, req, res)
            .then(function (data) {

                var info = {};
                info = req.body;

                function selectQuery(info) {

                    if (data[0].role == accessCodeAdmin) {
                        var query = 'select transaction_ID, store_ID, sysUser_ID, custUser_ID, discount, GST, SGST, C' +
                            'GST, totalAmount, paymentMode, transactionType, createdOn, modifiedOn, deletedOn' +
                            ', isDeleted as isDeleted, deletedBy, isReturned as isReturned, returnDate, isVoi' +
                            'd as isVoid, voidDate, itemCount from tbl_transaction where isDeleted = 0 and pa' +
                            'ymentMode = "cash" and transactionType = "sell" and isReturned = 0 and isVoid = ' +
                            '0 and ';
                    } else {
                        var query = 'select transaction_ID, store_ID, sysUser_ID, custUser_ID, discount, GST, SGST, C' +
                            'GST, totalAmount, paymentMode, transactionType, createdOn, modifiedOn, deletedOn' +
                            ', isDeleted as isDeleted, deletedBy, isReturned as isReturned, returnDate, isVoi' +
                            'd as isVoid, voidDate, itemCount from tbl_transaction where isDeleted = 0 and St' +
                            'ore_ID =' + info.p_store_ID + ' and paymentMode = "cash" and transactionType = "sell" and isReturned = 0 and is' +
                            'Void = 0 and ';
                    }

                    switch (info.p_queryType) {
                        case "Yearly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 year) and NOW()';
                            break;
                        case "Monthly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 month) and NOW()';
                            break;
                        case "Weekly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 week) and NOW()';
                            break;
                        case "Daily":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 day) and NOW()';
                            break;
                        case "Hourly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 hour) and NOW()';
                            break;
                        default:
                            query = query + 'createdOn between date_sub(NOW(),interval 1 month) and NOW()';
                    }
                    return query;
                }

                var parameters = {
                    query: selectQuery(info)
                }

                sqlConnect.connect('query', parameters, function (error, param) {
                    if (error) {
                        return utility.sendApiResponse(res, 3, {
                            result: error,
                            code: 3
                        });
                    } // when error in sp
                    if (param && param[0]) {
                        return utility.sendApiResponse(res, 0, {
                            result: param,
                            code: 0
                        });
                    } else {
                        return utility.sendApiResponse(res, 1, {
                            result: "null",
                            code: 1
                        });
                    }
                }, pool);

            })
            .catch(function (error) {
                utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            });

    },

    salesReport: function (pool, req, res) {

        getReportsByUserRole(pool, req, res)
            .then(function (data) {

                var info = {};
                info = req.body;

                function selectQuery(info) {

                    if (data[0].role == accessCodeAdmin) {
                        var query = 'select transaction_ID, store_ID, sysUser_ID, custUser_ID, discount, GST, SGST, C' +
                            'GST, totalAmount, paymentMode, transactionType, createdOn, modifiedOn, deletedOn' +
                            ', isDeleted as isDeleted, deletedBy, isReturned as isReturned, returnDate, isVoi' +
                            'd as isVoid, voidDate, itemCount from tbl_transaction where isDeleted = 0 and tr' +
                            'ansactionType = "sales" and ';
                    } else {
                        var query = 'select transaction_ID, store_ID, sysUser_ID, custUser_ID, discount, GST, SGST, C' +
                            'GST, totalAmount, paymentMode, transactionType, createdOn, modifiedOn, deletedOn' +
                            ', isDeleted as isDeleted, deletedBy, isReturned as isReturned, returnDate, isVoi' +
                            'd as isVoid, voidDate, itemCount from tbl_transaction where isDeleted = 0 and st' +
                            'ore_ID =' + info.p_store_ID + ' and transactionType = "sales" and ';
                    }

                    switch (info.p_queryType) {
                        case "Yearly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 year) and NOW()';
                            break;
                        case "Monthly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 month) and NOW()';
                            break;
                        case "Weekly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 week) and NOW()';
                            break;
                        case "Daily":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 day) and NOW()';
                            break;
                        case "Hourly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 hour) and NOW()';
                            break;
                        default:
                            query = query + 'createdOn between date_sub(NOW(),interval 1 month) and NOW()';
                    }
                    return query;
                }

                var parameters = {
                    query: selectQuery(info)
                }
                sqlConnect.connect('query', parameters, function (error, param) {
                    if (error) {
                        return utility.sendApiResponse(res, 3, {
                            result: error,
                            code: 3
                        });
                    } // when error in sp
                    if (param && param[0]) {
                        return utility.sendApiResponse(res, 0, {
                            result: param,
                            code: 0
                        });
                    } else {
                        return utility.sendApiResponse(res, 1, {
                            result: "null",
                            code: 1
                        });
                    }
                }, pool);

            })
            .catch(function (error) {
                utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            });

    },

    customerReport: function (pool, req, res) {

        getReportsByUserRole(pool, req, res)
            .then(function (data) {

                var info = {};
                info = req.body;

                function selectQuery(info) {

                    if (data[0].role == accessCodeAdmin) {
                        var query = 'select tu.firstName, tu.lastName, tu.gender, tu.store_ID, COUNT(transaction_ID) ' +
                            'as `TotalTrans`, SUM(tt.totalAmount) as `TotalSale` from tbl_transaction tt JOIN' +
                            ' tbl_custUser tu on tt.custUser_ID = tu.custUser_ID where tt.isDeleted = 0 and ';
                    } else {
                        var query = 'select tu.firstName, tu.lastName, tu.gender, tu.store_ID, COUNT(transaction_ID) ' +
                            'as `TotalTrans`, SUM(tt.totalAmount) as `TotalSale` from tbl_transaction tt JOIN' +
                            ' tbl_custUser tu on tt.custUser_ID = tu.custUser_ID where tt.isDeleted = 0 and t' +
                            't.Store_ID = ' + info.p_store_ID + ' and ';
                    }

                    switch (info.p_queryType) {
                        case "Yearly":
                            query = query + 'tt.createdOn between date_sub(NOW(),interval 1 Year) and NOW() group by tu.custU' +
                                'ser_ID';
                            break;
                        case "Monthly":
                            query = query + 'tt.createdOn between date_sub(NOW(),interval 1 Month) and NOW() group by tu.cust' +
                                'User_ID';
                            break;
                        case "Weekly":
                            query = query + 'tt.createdOn between date_sub(NOW(),interval 1 Week) and NOW() group by tu.custU' +
                                'ser_ID';
                            break;
                        case "Daily":
                            query = query + 'tt.createdOn between date_sub(NOW(),interval 1 day) and NOW() group by tu.custUs' +
                                'er_ID';
                            break;
                        default:
                            query = query + 'tt.createdOn between date_sub(NOW(),interval 1 Month) and NOW() group by tu.cust' +
                                'User_ID';
                    }
                    return query;
                }

                var parameters = {
                    query: selectQuery(info)
                }

                sqlConnect.connect('query', parameters, function (error, param) {
                    if (error) {
                        return utility.sendApiResponse(res, 3, {
                            result: error,
                            code: 3
                        });
                    }
                    if (param && param[0]) {
                        return utility.sendApiResponse(res, 0, {
                            result: param,
                            code: 0
                        });
                    } else {
                        return utility.sendApiResponse(res, 1, {
                            result: "null",
                            code: 1
                        });
                    }
                }, pool);

            })
            .catch(function (error) {
                utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            });

    },

    userBillReport: function (pool, req, res) {

        getReportsByUserRole(pool, req, res)
            .then(function (data) {

                var info = {};
                info = req.body;
                if (data[0].role == accessCodeAdmin) {
                    var parameters = {
                        query: 'select tt.transaction_ID, tu.firstName, tu.lastName, tu.gender, ti.invoice_ID, t' +
                            'i.store_ID, ti.product_ID, ti.quantity, ti.discount, ti.createdOn, ti.modifiedOn' +
                            ', ti.deletedOn, ti.isDeleted as isDeleted, ti.isReturned as isReturned, ti.retur' +
                            'nedOn, ti.deletedBy, ti.unitPrice, tp.sysUser_ID, tp.barcodeReader_ID, tp.UOM_ID' +
                            ', tp.productName, tp.brandName, tp.description, tp.constrains, tp.category, tp.g' +
                            'st_ID, tp.supplier_ID, tp.HSN_ID, tp.happyHours as happyHours, tp.expiryDate, tp' +
                            '.deleteReason, tp.costPrice, tp.totalstock from tbl_transaction tt JOIN tbl_cust' +
                            'User tu on tt.custUser_ID = tu.custUser_ID LEFT JOIN tbl_invoice ti  on tt.trans' +
                            'action_id = ti.transaction_id and tt.Store_ID  = ti.Store_ID JOIN tbl_product tp' +
                            ' on ti.product_id = tp.product_id where tt.isDeleted = 0 and tt.transaction_ID =' + info.p_transaction_ID + ' and tt.createdOn between date_sub(NOW(),interval 1 month) and NOW()'
                    }
                } else {
                    var parameters = {
                        query: 'select tt.transaction_ID, tu.firstName, tu.lastName, tu.gender, ti.invoice_ID, t' +
                            'i.store_ID, ti.product_ID, ti.quantity, ti.discount, ti.createdOn, ti.modifiedOn' +
                            ', ti.deletedOn, ti.isDeleted as isDeleted, ti.isReturned as isReturned, ti.retur' +
                            'nedOn, ti.deletedBy, ti.unitPrice, tp.sysUser_ID, tp.barcodeReader_ID, tp.UOM_ID' +
                            ', tp.productName, tp.brandName, tp.description, tp.constrains, tp.category, tp.g' +
                            'st_ID, tp.supplier_ID, tp.HSN_ID, tp.happyHours as happyHours, tp.expiryDate, tp' +
                            '.deleteReason, tp.costPrice, tp.totalstock from tbl_transaction tt JOIN tbl_cust' +
                            'User tu on tt.custUser_ID = tu.custUser_ID LEFT JOIN tbl_invoice ti  on tt.trans' +
                            'action_id = ti.transaction_id and tt.Store_ID  = ti.Store_ID JOIN tbl_product tp' +
                            ' on ti.product_id = tp.product_id where tt.isDeleted = 0 and tt.transaction_ID =' + info.p_transaction_ID + ' and tt.Store_ID =' + info.p_store_ID + ' and tt.createdOn between date_sub(NOW(),interval 1 month) and NOW()'
                    }
                }

                sqlConnect
                    .connect('query', parameters, function (error, param) {
                        if (error) {
                            return utility.sendApiResponse(res, 3, {
                                result: error,
                                code: 3
                            });
                        } // when error in sp
                        if (param && param[0]) {
                            return utility.sendApiResponse(res, 0, {
                                result: param,
                                code: 0
                            });
                        } else {
                            return utility.sendApiResponse(res, 1, {
                                result: "null",
                                code: 1
                            });
                        }
                    }, pool);

            })
            .catch(function (error) {
                utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            });

    },

    billTaxReport: function (pool, req, res) {

        getReportsByUserRole(pool, req, res)
            .then(function (data) {

                var info = {};
                info = req.body;

                function selectQuery(info) {

                    var query = 'select tt.GST, SGST, CGST, tu.firstName, tu.lastName, tu.gender from tbl_transac' +
                        'tion tt JOIN tbl_custUser tu on tt.custUser_ID = tu.custUser_ID  where tt.isDele' +
                        'ted = 0 and ';

                    // if (data[0].role == accessCodeAdmin) {     if (info.p_queryType == "single")
                    // {         query = query + 'tt.transaction_ID =' + info.p_transaction_ID +
                    // 'and tt.createdOn between date_sub(NOW(),interval 1 month) and NOW()';     }
                    // else {         query = query + 'tt.createdOn between date_sub(NOW(),interval
                    // 1 month) and NOW()'; // for all     } } else {
                    if (info.p_queryType == "single") {
                        query = query + 'tt.transaction_ID =' + info.p_transaction_ID + ' and tt.Store_ID =' + info.p_store_ID + ' and tt.createdOn between date_sub(NOW(),interval 1 month) and NOW()';
                    } else {
                        query = query + 'tt.Store_ID = ' + info.p_store_ID + ' and tt.createdOn between date_sub(NOW(),interval 1 month) and NOW()'; // for all
                    }
                    // }
                    return query;
                }

                var parameters = {
                    query: selectQuery(info)
                }

                sqlConnect.connect('query', parameters, function (error, param) {
                    if (error) {
                        return utility.sendApiResponse(res, 3, {
                            result: error,
                            code: 3
                        });
                    } // when error in sp
                    if (param && param[0]) {
                        return utility.sendApiResponse(res, 0, {
                            result: param,
                            code: 0
                        });
                    } else {
                        return utility.sendApiResponse(res, 1, {
                            result: "null",
                            code: 1
                        });
                    }
                }, pool);

            })
            .catch(function (error) {
                utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            });

    },

    voidBillReport: function (pool, req, res) {

        getReportsByUserRole(pool, req, res)
            .then(function (data) {

                var info = {}
                info = req.body;
                function selectQuery(info) {

                    if (data[0].role == accessCodeAdmin) {
                        var query = 'select transaction_ID, store_ID, sysUser_ID, custUser_ID, discount, GST, SGST, C' +
                            'GST, totalAmount, paymentMode, transactionType, createdOn, modifiedOn, deletedOn' +
                            ', isDeleted as isDeleted, deletedBy, isReturned as isReturned, returnDate, isVoi' +
                            'd as isVoid, voidDate, itemCount from tbl_transaction where isDeleted = 0 and tr' +
                            'ansactionType = "sell" and isVoid = 1 and ';
                    } else {
                        var query = 'select transaction_ID, store_ID, sysUser_ID, custUser_ID, discount, GST, SGST, C' +
                            'GST, totalAmount, paymentMode, transactionType, createdOn, modifiedOn, deletedOn' +
                            ', isDeleted as isDeleted, deletedBy, isReturned as isReturned, returnDate, isVoi' +
                            'd as isVoid, voidDate, itemCount from tbl_transaction where isDeleted = 0 and St' +
                            'ore_ID =' + info.p_store_ID + ' and transactionType = "sell" and isVoid = 1 and ';
                    }

                    switch (info.p_queryType) {
                        case "Monthly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 month) and NOW()';
                            break;
                        case "Yearly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 year) and NOW()';
                            break;
                        case "Weekly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 week) and NOW()';
                            break;
                        case "Daily":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 day) and NOW()';
                            break;
                        case "Hourly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 hour) and NOW()';
                            break;
                        default:
                            query = query + 'createdOn between date_sub(NOW(),interval 1 month) and NOW()';
                    }
                    return query;
                }

                var parameters = {
                    query: selectQuery(info)
                }

                sqlConnect.connect('query', parameters, function (error, param) {
                    if (error) {
                        return utility.sendApiResponse(res, 3, {
                            result: error,
                            code: 3
                        });
                    } // when error in sp
                    if (param && param[0]) {
                        return utility.sendApiResponse(res, 0, {
                            result: param,
                            code: 0
                        });
                    } else {
                        return utility.sendApiResponse(res, 1, {
                            result: "null",
                            code: 1
                        });
                    }
                }, pool);

            })
            .catch(function (error) {
                utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            });

    },

    returnedItemReport: function (pool, req, res) {

        getReportsByUserRole(pool, req, res)
            .then(function (data) {

                var info = {}
                info = req.body;
                function selectQuery(info) {
                    if (data[0].role == accessCodeAdmin) {
                        var query = 'select transaction_ID, store_ID, sysUser_ID, custUser_ID, discount, GST, SGST, C' +
                            'GST, totalAmount, paymentMode, transactionType, createdOn, modifiedOn, deletedOn' +
                            ', isDeleted as isDeleted, deletedBy, isReturned as isReturned, returnDate, isVoi' +
                            'd as isVoid, voidDate, itemCount from tbl_transaction where isDeleted = 0 and tr' +
                            'ansactionType = "sell" and isReturned = 1 and isVoid = 0 and ';
                    } else {
                        var query = 'select transaction_ID, store_ID, sysUser_ID, custUser_ID, discount, GST, SGST, C' +
                            'GST, totalAmount, paymentMode, transactionType, createdOn, modifiedOn, deletedOn' +
                            ', isDeleted as isDeleted, deletedBy, isReturned as isReturned, returnDate, isVoi' +
                            'd as isVoid, voidDate, itemCount from tbl_transaction where isDeleted = 0 and St' +
                            'ore_ID =' + info.p_store_ID + ' and transactionType = "sell" and isReturned = 1 and isVoid = 0 and ';
                    }

                    switch (info.p_queryType) {
                        case "Monthly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 month) and NOW()';
                            break;
                        case "Yearly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 year) and NOW()';
                            break;
                        case "Weekly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 week) and NOW()';
                            break;
                        case "Daily":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 day) and NOW()';
                            break;
                        case "Hourly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 hour) and NOW()';
                            break;
                        default:
                            query = query + 'createdOn between date_sub(NOW(),interval 1 month) and NOW()';
                    }
                    return query;
                }

                var parameters = {
                    query: selectQuery(info)
                }

                sqlConnect.connect('query', parameters, function (error, param) {
                    if (error) {
                        return utility.sendApiResponse(res, 3, {
                            result: error,
                            code: 3
                        });
                    } // when error in sp
                    if (param && param[0]) {
                        return utility.sendApiResponse(res, 0, {
                            result: param,
                            code: 0
                        });
                    } else {
                        return utility.sendApiResponse(res, 1, {
                            result: "null",
                            code: 1
                        });
                    }
                }, pool);

            })
            .catch(function (error) {
                utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            });

    },

    stockReport: function (pool, req, res) {
        userAccess(pool, req, res)
            .then(function (data) {
                if (req.body.lim == 0) {
                    if (data[0].role == accessCodeAdmin) {
                        var parameters = {
                            query: 'select product_ID, store_ID, sysUser_ID, barcodeReader_ID, UOM_ID, productName, ' +
                                'brandName, description, constrains, unitPrice, category, gst_ID, supplier_ID, di' +
                                'scount, createdOn, modifiedOn, deletedOn, isDeleted as isDeleted , deletedBy, HS' +
                                'N_ID, happyHours as happyHours, expiryDate, deleteReason, costPrice, totalstock ' +
                                'from tbl_product where isDeleted = 0'
                        }
                    } else {
                        var parameters = {
                            query: 'select product_ID, store_ID, sysUser_ID, barcodeReader_ID, UOM_ID, productName, ' +
                                'brandName, description, constrains, unitPrice, category, gst_ID, supplier_ID, di' +
                                'scount, createdOn, modifiedOn, deletedOn, isDeleted as isDeleted , deletedBy, HS' +
                                'N_ID, happyHours as happyHours, expiryDate, deleteReason, costPrice, totalstock ' +
                                'from tbl_product where isDeleted = 0 and store_ID= ' + JSON.stringify(data[0].store_ID)
                        }
                    }
                } else {
                    if (data[0].role == accessCodeAdmin) {
                        var parameters = {
                            query: 'select product_ID, store_ID, sysUser_ID, barcodeReader_ID, UOM_ID, productName, ' +
                                'brandName, description, constrains, unitPrice, category, gst_ID, supplier_ID, di' +
                                'scount, createdOn, modifiedOn, deletedOn, isDeleted as isDeleted , deletedBy, HS' +
                                'N_ID, happyHours as happyHours, expiryDate, deleteReason, costPrice, totalstock ' +
                                'from tbl_product where isDeleted = 0 limit ' + req.body.lim + ' OFFSET ' + req.body.ski
                        }
                    } else {
                        var parameters = {
                            query: 'select product_ID, store_ID, sysUser_ID, barcodeReader_ID, UOM_ID, productName, ' +
                                'brandName, description, constrains, unitPrice, category, gst_ID, supplier_ID, di' +
                                'scount, createdOn, modifiedOn, deletedOn, isDeleted as isDeleted , deletedBy, HS' +
                                'N_ID, happyHours as happyHours, expiryDate, deleteReason, costPrice, totalstock ' +
                                'from tbl_product where isDeleted = 0 and store_ID= ' + JSON.stringify(data[0].store_ID) + ' LIMIT ' + req.body.lim + ' OFFSET ' + req.body.ski
                        }
                    }

                }

                sqlConnect
                    .connect('query', parameters, function (error, param) {

                        if (error) {
                            return utility.sendApiResponse(res, 3, {
                                result: error,
                                code: 3
                            });
                        } // when error in sp
                        else if (param && param[0]) {
                            return utility.sendApiResponse(res, 0, {
                                result: param,
                                code: 0
                            });
                        } else {
                            return utility.sendApiResponse(res, 1, {
                                result: "null",
                                code: 1
                            });
                        }
                    }, pool);

            })
            .catch(function (error) {
                utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            });

    },

    outOfStockReport: function (pool, req, res) {

        let offset = (req.body.page - 1) * (req.body.limit);
        let limit = req.body.limit

        userAccess(pool, req, res)
            .then(function (data) {

                if (data[0].role == accessCodeAdmin) {
                    var parameters = {
                        query: 'select (select sum(case WHEN isDeleted = false and totalstock <= 0 Then 1 else 0 end) as Records from tbl_product) as totalRecord , product_ID, store_ID, sysUser_ID, barcodeReader_ID, UOM_ID, productName, ' +
                            'brandName, description, constrains, unitPrice, category, gst_ID, supplier_ID, di' +
                            'scount, createdOn, modifiedOn, deletedOn, isDeleted as isDeleted , deletedBy, HS' +
                            'N_ID, happyHours as happyHours, expiryDate, deleteReason, costPrice, totalstock ' +
                            'from tbl_product where isDeleted = 0 and totalstock <= 0 LIMIT ' + limit + ' OFFSET ' + offset

                    }

                } else {
                    console.log("12", JSON.stringify(data[0].store_ID))
                    var parameters = {

                        query: 'select (select sum(case WHEN store_ID = ' + data[0].store_ID + ' and isDeleted = false and totalstock <= 0 Then 1 else 0 end) as Records from tbl_product) as totalRecord , product_ID, store_ID, sysUser_ID, barcodeReader_ID, UOM_ID, productName, ' +
                            'brandName, description, constrains, unitPrice, category, gst_ID, supplier_ID, di' +
                            'scount, createdOn, modifiedOn, deletedOn, isDeleted as isDeleted , deletedBy, HS' +
                            'N_ID, happyHours as happyHours, expiryDate, deleteReason, costPrice, totalstock ' +
                            'from tbl_product where isDeleted = 0 and totalstock <= 0 and store_ID=' + JSON.stringify(data[0].store_ID) + ' LIMIT ' + limit + ' OFFSET ' + offset
                        // ` limit ${req.body.lim}` + ` OFFSET ${req.body.ski}`
                    }
                }
                console.log("--------------->", parameters.query)
                sqlConnect
                    .connect('query', parameters, function (error, param) {
                        if (error) {
                            return utility.sendApiResponse(res, 3, {
                                result: error,
                                code: 3
                            });
                        }// when error in sp
                        if (param && param[0]) {
                            return utility.sendApiResponse(res, 0, {
                                result: param,
                                code: 0
                            });
                        } else {
                            return utility.sendApiResponse(res, 1, {
                                result: "null",
                                code: 1
                            });
                        }
                    }, pool);

            })
            .catch(function (error) {
                utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            });

    },

    aboutOutOfStockReport: function (pool, req, res) {
        userAccess(pool, req, res)
            .then(function (data) {

                if (data[0].role == accessCodeAdmin) {
                    var parameters = {
                        query: 'select product_ID, store_ID, sysUser_ID, barcodeReader_ID, UOM_ID, productName, ' +
                            'brandName, description, constrains, unitPrice, category, gst_ID, supplier_ID, di' +
                            'scount, createdOn, modifiedOn, deletedOn, isDeleted as isDeleted , deletedBy, HS' +
                            'N_ID, happyHours as happyHours, expiryDate, deleteReason, costPrice, totalstock ' +
                            'from tbl_product where isDeleted = 0 and totalstock >0 and totalstock <=4' +
                            ` limit ${req.body.lim}` + ` OFFSET ${req.body.ski}`
                    }
                } else {
                    var parameters = {
                        query: 'select product_ID, store_ID, sysUser_ID, barcodeReader_ID, UOM_ID, productName, ' +
                            'brandName, description, constrains, unitPrice, category, gst_ID, supplier_ID, di' +
                            'scount, createdOn, modifiedOn, deletedOn, isDeleted as isDeleted , deletedBy, HS' +
                            'N_ID, happyHours as happyHours, expiryDate, deleteReason, costPrice, totalstock ' +
                            'from tbl_product where isDeleted = 0 and totalstock >0 and totalstock <=4 and s' +
                            'tore_ID=' + data[0].store_ID + ` limit ${req.body.lim}` + ` OFFSET ${req.body.ski}`
                    }
                }

                sqlConnect
                    .connect('query', parameters, function (error, param) {
                        if (error) {
                            return utility.sendApiResponse(res, 3, {
                                result: error,
                                code: 3
                            });
                        } // when error in sp
                        if (param && param[0]) {
                            return utility.sendApiResponse(res, 0, {
                                result: param,
                                code: 0
                            });
                        } else {
                            return utility.sendApiResponse(res, 1, {
                                result: "null",
                                code: 1
                            });
                        }
                    }, pool);

            })
            .catch(function (error) {
                utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            });

    },

    profitReport: function (pool, req, res) {

        getReportsByUserRole(pool, req, res)
            .then(function (data) {

                var info = {}
                info = req.body;
                function selectQuery(info) {

                    if (data[0].role == accessCodeAdmin) {
                        var query = 'select tt.transaction_ID, tt.custUser_ID, (tt.totalAmount - tt.GST)- SUM(tp.cost' +
                            'Price) as Profit, SUM(tp.costPrice) as cost , tt.GST as GST, tt.totalAmount as S' +
                            'aleTotal from tbl_transaction tt join tbl_invoice ti on tt.transaction_id = ti.t' +
                            'ransaction_id  join tbl_product tp on tp.product_id = ti.product_id and tp.costP' +
                            'rice is not null where tt.isDeleted = 0 and tt.transactionType = "sell" and ti.i' +
                            'sReturned = 0 and tt.isVoid = 0 and ';
                    } else {
                        var query = 'select tt.transaction_ID, tt.custUser_ID, (tt.totalAmount - tt.GST)- SUM(tp.cost' +
                            'Price) as Profit, SUM(tp.costPrice) as cost , tt.GST as GST, tt.totalAmount as S' +
                            'aleTotal from tbl_transaction tt join tbl_invoice ti on tt.transaction_id = ti.t' +
                            'ransaction_id  join tbl_product tp on tp.product_id = ti.product_id and tp.costP' +
                            'rice is not null where tt.isDeleted = 0  and tt.Store_ID =' + info.p_store_ID + ' and tt.transactionType = "sell" and ti.isReturned = 0 and tt.isVoid = 0 and ';
                    }

                    switch (info.p_queryType) {
                        case "Monthly":
                            query = query + 'tt.createdOn between date_sub(NOW(),interval 1 month) and NOW()';
                            break;
                        case "Yearly":
                            query = query + 'tt.createdOn between date_sub(NOW(),interval 1 year) and NOW()';
                            break;
                        case "Weekly":
                            query = query + 'tt.createdOn between date_sub(NOW(),interval 1 week) and NOW()';
                            break;
                        case "Daily":
                            query = query + 'tt.createdOn between date_sub(NOW(),interval 1 day) and NOW()';
                            break;
                        case "Hourly":
                            query = query + 'tt.createdOn between date_sub(NOW(),interval 1 hour) and NOW()';
                            break;
                        default:
                            query = query + 'tt.createdOn between date_sub(NOW(),interval 1 month) and NOW()';
                    }
                    query = query + ' group by tt.transaction_ID';
                    return query;
                }

                var parameters = {
                    query: selectQuery(info)
                }

                sqlConnect.connect('query', parameters, function (error, param) {
                    if (error) {
                        return utility.sendApiResponse(res, 3, {
                            result: error,
                            code: 3
                        });
                    } // when error in sp
                    if (param && param[0]) {
                        return utility.sendApiResponse(res, 0, {
                            result: param,
                            code: 0
                        });
                    } else {
                        return utility.sendApiResponse(res, 1, {
                            result: "null",
                            code: 1
                        });
                    }
                }, pool);

            })
            .catch(function (error) {
                utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            });
    },

    returnedCashReport: function (pool, req, res) {

        getReportsByUserRole(pool, req, res)
            .then(function (data) {

                var info = {}
                info = req.body;
                function selectQuery(info) {
                    if (data[0].role == accessCodeAdmin) {
                        var query = 'select ttb.itemCount - tt.itemCount as `total_returned_items`, ttb.totalAmount -' +
                            ' tt.totalAmount as `total_returned_amount`, ttb.transactionBackup_ID, ttb.store_' +
                            'ID, ttb.transaction_ID, ttb.sysUser_ID, ttb.custUser_ID, ttb.discount, ttb.GST, ' +
                            'ttb.SGST, ttb.CGST, ttb.totalAmount, ttb.paymentMode, ttb.transactionType, ttb.c' +
                            'reatedOn, ttb.modifiedOn, ttb.deletedOn, ttb.isDeleted, ttb.deletedBy, ttb.isRet' +
                            'urned as isReturned, ttb.returnDate, ttb.isVoid as isVoid, ttb.voidDate, ttb.bac' +
                            'kupCreatedOn, ttb.itemCount  from tbl_transaction tt  JOIN tbl_transactionbackup' +
                            ' ttb on tt.transaction_id = ttb.transaction_id where tt.isDeleted = 0 and tt.tra' +
                            'nsactionType = "sell" and tt.isReturned = 1 and tt.isVoid = 0 and ';
                    } else {
                        var query = 'select ttb.itemCount - tt.itemCount as `total_returned_items`, ttb.totalAmount -' +
                            ' tt.totalAmount as `total_returned_amount`, ttb.transactionBackup_ID, ttb.store_' +
                            'ID, ttb.transaction_ID, ttb.sysUser_ID, ttb.custUser_ID, ttb.discount, ttb.GST, ' +
                            'ttb.SGST, ttb.CGST, ttb.totalAmount, ttb.paymentMode, ttb.transactionType, ttb.c' +
                            'reatedOn, ttb.modifiedOn, ttb.deletedOn, ttb.isDeleted, ttb.deletedBy, ttb.isRet' +
                            'urned as isReturned, ttb.returnDate, ttb.isVoid as isVoid, ttb.voidDate, ttb.bac' +
                            'kupCreatedOn, ttb.itemCount  from tbl_transaction tt  JOIN tbl_transactionbackup' +
                            ' ttb on tt.transaction_id = ttb.transaction_id where tt.isDeleted = 0  and tt.St' +
                            'ore_ID = ' + info.p_store_ID + ' and ttb.Store_ID = ' + info.p_store_ID + ' and tt.transactionType = "sell" and tt.isReturned = 1 and tt.isVoid = 0 and ';
                    }

                    switch (info.p_queryType) {
                        case "Monthly":
                            query = query + 'tt.returnDate between date_sub(NOW(),interval 1 month) and NOW()';
                            break;
                        case "Yearly":
                            query = query + 'tt.returnDate between date_sub(NOW(),interval 1 year) and NOW()';
                            break;
                        case "Weekly":
                            query = query + 'tt.returnDate between date_sub(NOW(),interval 1 week) and NOW()';
                            break;
                        case "Daily":
                            query = query + 'tt.returnDate between date_sub(NOW(),interval 1 day) and NOW()';
                            break;
                        case "Hourly":
                            query = query + 'tt.returnDate between date_sub(NOW(),interval 1 hour) and NOW()';
                            break;
                        default:
                            query = query + 'tt.returnDate between date_sub(NOW(),interval 1 month) and NOW()';
                    }
                    return query;
                }

                var parameters = {
                    query: selectQuery(info)
                }

                sqlConnect.connect('query', parameters, function (error, param) {
                    if (error) {
                        return utility.sendApiResponse(res, 3, {
                            result: error,
                            code: 3
                        });
                    } // when error in sp
                    if (param && param[0]) {
                        return utility.sendApiResponse(res, 0, {
                            result: param,
                            code: 0
                        });
                    } else {
                        return utility.sendApiResponse(res, 1, {
                            result: "null",
                            code: 1
                        });
                    }
                }, pool);

            })
            .catch(function (error) {
                utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            });

    },

    storeWiseReport: function (pool, req, res) {
        let limit;
        let offset;
        if (req.body.page == undefined || req.body.limit == undefined || req.body.page == NaN || req.body.limit || NaN) {
            limit = 10;
            offset = 0;
        }
        else {
            offset = (req.body.page - 1) * (req.body.limit);
            limit = req.body.limit
        }

        getReportsByUserRole(pool, req, res)
            .then(function (data) {

                var info = {}
                info.p_store_ID = [];
                info = req.body;
                var storeIDs = '';
                for (var i = 0; i < info.p_store_ID.length; i++) {
                    if (storeIDs != '') {
                        storeIDs = storeIDs + ',';
                    }
                    storeIDs = storeIDs + info.p_store_ID[i];
                }

                if (data[0].role == accessCodeAdmin) {
                    var parameters = {
                        query: 'select  (select sum(case WHEN isDeleted = false  Then 1 else 0 end) as Records from  tbl_transaction) as totalRecord , tt.Store_ID, ts.storeName, ts.city, ts.managerName, COUNT(tt.transaction_' +
                            'ID) `Transactions`, SUM(tt.GST) `TotalGST`, SUM(tt.totalAmount) `TotalAmount` fr' +
                            'om tbl_transaction tt JOIN tbl_store ts on tt.Store_ID = ts.Store_ID where tt.is' +
                            'Deleted = 0 group by tt.Store_ID  LIMIT ' + limit + ' OFFSET ' + offset
                    }
                } else {
                    var parameters = {
                        query: 'select  (select sum(case WHEN isDeleted = false  Then 1 else 0 end) as Records from  tbl_transaction ) as totalRecord , tt.Store_ID, ts.storeName, ts.city, ts.managerName, COUNT(tt.transaction_' +
                            'ID) `Transactions`, SUM(tt.GST) `TotalGST`, SUM(tt.totalAmount) `TotalAmount` fr' +
                            'om tbl_transaction tt JOIN tbl_store ts on tt.Store_ID = ts.Store_ID where tt.is' +
                            'Deleted = 0 group by tt.Store_ID HAVING Store_ID in (' + storeIDs + ')  LIMIT ' + limit + ' OFFSET ' + offset
                    }
                }
                sqlConnect
                    .connect('query', parameters, function (error, param) {
                        if (error) {
                            return utility.sendApiResponse(res, 3, {
                                result: error,
                                code: 3
                            });
                        } // when error in sp
                        if (param && param[0]) {
                            return utility.sendApiResponse(res, 0, {
                                result: param,
                                code: 0
                            });
                        } else {
                            return utility.sendApiResponse(res, 1, {
                                result: "null",
                                code: 1
                            });
                        }
                    }, pool);

            })
            .catch(function (error) {
                utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            });

    },

    allStoreReport: function (pool, req, res) {
        let limit;
        let offset;
        if (req.body.page == undefined || req.body.limit == undefined || req.body.page == NaN || req.body.limit || NaN) {
            limit = 10;
            offset = 0;
        }
        else {
            offset = (req.body.page - 1) * (req.body.limit);
            limit = req.body.limit
        }
        var parameters = {
            query: 'select  (select sum(case WHEN isDeleted = false  Then 1 else 0 end) as Records from  tbl_transaction ) as totalRecord , tt.Store_ID, ts.storeName, ts.city, ts.managerName, COUNT(tt.transaction_' +
                'ID) `Transactions`, SUM(tt.GST) `TotalGST`, SUM(tt.totalAmount) `TotalAmount` fr' +
                'om tbl_transaction tt JOIN tbl_store ts on tt.Store_ID = ts.Store_ID where tt.is' +
                'Deleted = 0 group by tt.Store_ID  LIMIT ' + limit + ' OFFSET ' + offset
        }
        sqlConnect.connect('query', parameters, function (error, param) {
            if (error) {
                return utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            }
            // when error in sp
            if (param && param[0]) {
                return utility.sendApiResponse(res, 0, {
                    result: param,
                    code: 0
                });
            } else {
                return utility.sendApiResponse(res, 1, {
                    result: "null",
                    code: 1
                });
            }
        }, pool);
    },

    expenseReport: function (pool, req, res) {
        let limit;
        let offset;
        if (req.body.page == undefined || req.body.limit == undefined || req.body.page == NaN || req.body.limit || NaN) {
            limit = 10;
            offset = 0;
        }
        else {
            offset = (req.body.page - 1) * (req.body.limit);
            limit = req.body.limit
        }

        userAccess(pool, req, res)
            .then(function (data) {
                if (data[0].role == accessCodeAdmin) {
                    var parameters = {
                        query: 'select  (select sum(case WHEN isDeleted = false  Then 1 else 0 end) as Records from   tbl_expenses ) as totalRecord , expense_ID, store_ID, sysUser_ID, expenseType, expense_Description, amoun' +
                            't, isDeleted as isDeleted, deletedBy, createdOn, modifiedOn, deletedOn, isReturn' +
                            'ed as isReturned, returnedOn, modifiedBy from tbl_expenses where isDeleted = 0 a' +
                            'nd store_ID <> 0 and isReturned = 0  LIMIT ' + limit + ' OFFSET ' + offset
                    }
                } else {
                    var parameters = {
                        query: 'select  (select sum(case WHEN isDeleted = false  Then 1 else 0 end) as Records from   tbl_expenses ) as totalRecord , expense_ID, store_ID, sysUser_ID, expenseType, expense_Description, amoun' +
                            't, isDeleted as isDeleted, deletedBy, createdOn, modifiedOn, deletedOn, isReturn' +
                            'ed as isReturned, returnedOn, modifiedBy from tbl_expenses where isDeleted = 0 a' +
                            'nd store_ID =' + data[0].store_ID + ' and isReturned = 0  LIMIT ' + limit + ' OFFSET ' + offset
                    }
                }
                sqlConnect
                    .connect('query', parameters, function (error, param) {
                        if (error) {
                            return utility.sendApiResponse(res, 3, {
                                result: error,
                                code: 3
                            });
                        } // when error in sp
                        if (param && param[0]) {
                            return utility.sendApiResponse(res, 0, {
                                result: param,
                                code: 0
                            });
                        } else {
                            return utility.sendApiResponse(res, 1, {
                                result: "null",
                                code: 1
                            });
                        }
                    }, pool);

            })
            .catch(function (error) {
                utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            });
    },

    managerWiseReport: function (pool, req, res) {
        let limit;
        let offset;
        var info = {}
        info = req.body;
        if (req.body.page == undefined || req.body.limit == undefined || req.body.page == NaN || req.body.limit == NaN) {
            limit = 10;
            offset = 0;
        }
        else {
            offset = (req.body.page - 1) * (req.body.limit);
            limit = req.body.limit
        }

        userAccess(pool, req, res).then(function (data) {
            if (data[0].role == accessCodeAdmin) {

                var parameters = {
                    query: 'select (select sum(case WHEN isDeleted = false  Then 1 else 0 end) as Records from  tbl_sysuser ) as totalRecord , sysUser_ID, store_ID, role, firstName, middleName , lastName, email , userName , password , mobile , emergencyContact , role_ID , name , access_ID  from tbl_sysuser tsu join tbl_roles tr on tsu.role = tr.code where tsu.' +
                        'isDeleted = 0 LIMIT ' + limit + ' OFFSET ' + offset
                    //# parameter for Position, here its for Store Manager so code 'STRMAG'.'
                }
            } else {
                var parameters = {
                    query: 'select  (select sum(case WHEN role ="' + info.p_role + '" and store_ID = ' + info.p_store_ID + ' and isDeleted = false Then 1 else 0 end) as Records from  tbl_sysuser) as totalRecord , sysUser_ID, store_ID, role, firstName, middleName , lastName, email , userName , password , mobile , emergencyContact , role_ID , name , access_ID from tbl_sysuser tsu join tbl_roles tr on tsu.role = tr.code where tsu.' +
                        'isDeleted = 0 and tsu.store_ID = ' + info.p_store_ID + ' and tsu.role = "' + info.p_role + '" LIMIT ' + limit + ' OFFSET ' + offset
                    //# parameter for Position, here its for Store Manager so code 'STRMAG'.'
                }
            }
            sqlConnect
                .connect('query', parameters, function (error, param) {
                    if (error) {
                        return utility.sendApiResponse(res, 3, {
                            result: error,
                            code: 3
                        });
                    } // when error in sp
                    if (param && param[0]) {
                        return utility.sendApiResponse(res, 0, {
                            result: param,
                            code: 0
                        });
                    } else {
                        return utility.sendApiResponse(res, 1, {
                            result: "null",
                            code: 1
                        });
                    }

                }, pool);
        })
            .catch(function (error) {
                utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            });
    },

    sellUsingCardReport: function (pool, req, res) {

        getReportsByUserRole(pool, req, res)
            .then(function (data) {

                var info = {};
                info = req.body;

                function selectQuery(info) {

                    if (data[0].role == accessCodeAdmin) {
                        var query = 'select transaction_ID, store_ID, sysUser_ID, custUser_ID, discount, GST, SGST, C' +
                            'GST, totalAmount, paymentMode, transactionType, createdOn, modifiedOn, deletedOn' +
                            ', isDeleted as isDeleted, deletedBy, isReturned as isReturned, returnDate, isVoi' +
                            'd as isVoid, voidDate, itemCount from tbl_transaction where isDeleted = 0 and pa' +
                            'ymentMode = "card" and transactionType = "sell" and isReturned = 0 and isVoid = ' +
                            '0 and ';
                    } else {
                        var query = 'select transaction_ID, store_ID, sysUser_ID, custUser_ID, discount, GST, SGST, C' +
                            'GST, totalAmount, paymentMode, transactionType, createdOn, modifiedOn, deletedOn' +
                            ', isDeleted as isDeleted, deletedBy, isReturned as isReturned, returnDate, isVoi' +
                            'd as isVoid, voidDate, itemCount from tbl_transaction where isDeleted = 0 and St' +
                            'ore_ID = ' + info.p_store_ID + ' and paymentMode = "card" and transactionType = "sell" and isReturned = 0 and is' +
                            'Void = 0 and ';
                    }

                    switch (info.p_queryType) {
                        case "Yearly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 year) and NOW()';
                            break;
                        case "Monthly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 month) and NOW()';
                            break;
                        case "Weekly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 week) and NOW()';
                            break;
                        case "Daily":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 day) and NOW()';
                            break;
                        case "Hourly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 hour) and NOW()';
                            break;
                        default:
                            query = query + 'createdOn between date_sub(NOW(),interval 1 month) and NOW()';
                    }
                    return query;
                }

                var parameters = {
                    query: selectQuery(info)
                }


                sqlConnect.connect('query', parameters, function (error, param) {
                    if (error) {
                        return utility.sendApiResponse(res, 3, {
                            result: error,
                            code: 3
                        });
                    } // when error in sp

                    if (param && param[0]) {
                        return utility.sendApiResponse(res, 0, {
                            result: param,
                            code: 0
                        });
                    } else {
                        return utility.sendApiResponse(res, 1, {
                            result: "null",
                            code: 1
                        });
                    }
                }, pool);

            })
            .catch(function (error) {
                utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            });

    },

    gstReport: function (pool, req, res) {
        getReportsByUserRole(pool, req, res)
            .then(function (data) {
                if (data[0].role == 'SADM') {
                    var info = {}
                    info = req.body;

                    var parameters = { //added-17 aug regan
                        query: 'usp_GSTReport_Admin',
                        inputParameters: [{
                            type: 'int',
                            value: info.p_store_ID
                        },
                        {
                            type: 'int',
                            value: info.p_monthCount
                        },
                        ],
                        hasoutputParameters: false
                    }

                } else {
                    var info = {}
                    info = req.body;

                    var parameters = { //added-17 aug regan
                        query: 'usp_GSTReport',
                        inputParameters: [{
                            type: 'int',
                            value: info.p_store_ID
                        },
                        {
                            type: 'int',
                            value: info.p_monthCount
                        },
                        {
                            type: 'int',
                            value: info.userID
                        },
                        ],
                        hasoutputParameters: false
                    }
                }
                sqlConnect.connect('procedure', parameters, function (error, param) {
                    if (error) {
                        return utility.sendApiResponse(res, 3, {
                            result: error,
                            code: 3
                        });
                    } // when error in sp

                    if (param && param[0]) {
                        return utility.sendApiResponse(res, 0, {
                            result: param,
                            code: 0
                        });
                    } else {
                        return utility.sendApiResponse(res, 1, {
                            result: "null",
                            code: 1
                        });
                    }
                }, pool);

            }).catch(function (error) {
                utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            });
    },

    specialDiscount: function (pool, req, res) {

        getReportsByUserRole(pool, req, res)
            .then(function (data) {

                var info = {};
                info = req.body;

                function selectQuery(info) {

                    if (data[0].role == accessCodeAdmin) {
                        var query = 'select transaction_ID, store_ID, custUser_ID, discount, GST, SGST, CGST, totalAm' +
                            'ount, itemCount, specialDiscount, sysUser_ID as `discountBy`, paymentMode, creat' +
                            'edOn, isReturned as isReturned, returnDate from tbl_transaction where isDeleted ' +
                            '= 0 and transactionType = "sell" and isVoid = 0 and ';
                    } else {
                        var query = 'select transaction_ID, store_ID, custUser_ID, discount, GST, SGST, CGST, totalAm' +
                            'ount, itemCount, specialDiscount, sysUser_ID as `discountBy`, paymentMode, creat' +
                            'edOn, isReturned as isReturned, returnDate from tbl_transaction where isDeleted ' +
                            '= 0 and Store_ID = ' + info.p_store_ID + ' and transactionType = "sell" and isVoid = 0 and ';
                    }

                    switch (info.p_queryType) {
                        case "Monthly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 month) and NOW()';
                            break;
                        case "Yearly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 year) and NOW()';
                            break;
                        case "Weekly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 week) and NOW()';
                            break;
                        case "Hourly":
                            query = query + 'createdOn between date_sub(NOW(),interval 1 hour) and NOW()';
                            break;
                        default:
                            query = query + 'createdOn between date_sub(NOW(),interval 1 month) and NOW()';
                    }
                    return query;
                }

                var parameters = {
                    query: selectQuery(info)
                }

                sqlConnect.connect('query', parameters, function (error, param) {
                    if (error) {
                        return utility.sendApiResponse(res, 3, {
                            result: error,
                            code: 3
                        });
                    } // when error in sp
                    if (param && param[0]) {
                        return utility.sendApiResponse(res, 0, {
                            result: param,
                            code: 0
                        });
                    } else {
                        return utility.sendApiResponse(res, 1, {
                            result: "null",
                            code: 1
                        });
                    }
                }, pool);

            })
            .catch(function (error) {
                utility.sendApiResponse(res, 3, {
                    result: error,
                    code: 3
                });
            });

    }

}