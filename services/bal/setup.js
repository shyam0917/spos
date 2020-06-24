var sqlConnect = require('../tools/utility/mssql.connection');
var multer = require('multer');
var utility = require('../tools/utility/utility');
//******************MulterStorage **********/

// var accessCodeAdmin = 'ADM';


function getGstCat(pool, req, res) {
    return new Promise(function (resolve, reject) {

        var parameters = {
            query: 'SELECT gst_Cat_ID, GST FROM tbl_gstcategory'
        }
        sqlConnect.connect('query1', parameters, function (error, param) {

            if (error)
                reject(error);

            if (param) {
                resolve(param);
            }
        }, pool);

    });
}
function setGstTable(pool, req, res) {
    if (req.body.isAdmin == true) {
        if (!(req.body.form.gst_ID)) {
            return new Promise(function (resolve, reject) {
                var parameters = {
                    query: `INSERT INTO tbl_gst(Item, Item_Desc, gst_Cat_ID, HSN_No, igst, sgst, cgst)
                VALUES (${JSON.stringify(req.body.form.Item)}, ${JSON.stringify(req.body.form.Item_Desc)}, ${+req.body.form.gst_Cat_ID}, ${+req.body.form.HSN_No},${+req.body.form.igst},${+req.body.form.sgst},${+req.body.form.cgst} );`
                }
                sqlConnect.connect('query1', parameters, function (error, param) {
                    if (error) {
                        reject(error);
                        res.status(400).send(error);
                    }

                    if (param) {
                        resolve(param);
                        // console.log("data saved");
                    }
                }, pool);

            });
        } else if (!(req.body.form.delete)) {
            console.log("update")
            var params = {
                Item: `${JSON.stringify(req.body.form.Item)}`,
                HSN_No: `${parseInt(req.body.form.HSN_No)}`,
                Item_Desc: `${JSON.stringify(req.body.form.Item_Desc)}`,
                igst: `${parseInt(req.body.form.igst)}`
            }

            var updateQuery = Object.keys(params).map(item => {
                return `${item}=${params[item]}`
            });
            return new Promise(function (resolve, reject) {
                var parameters = { query: `UPDATE tbl_gst SET ${updateQuery.join(',')} WHERE gst_ID="${req.body.form.gst_ID}";` }
                sqlConnect.connect('query', parameters, function (error, param) {
                    if (error) {
                        reject(error);
                        res.status(400).send(error);
                    }
                    if (param) {
                        resolve(param);
                    }
                }, pool);

            });
        } else {
            console.log("delete data ")
            return new Promise(function (resolve, reject) {
                var parameters = { query: `UPDATE tbl_gst SET isDeleted = 1 WHERE gst_ID="${req.body.form.gst_ID}";` }
                sqlConnect.connect('query', parameters, function (error, param) {
                    if (error) {
                        reject(error);
                        res.status(400).send(error);
                    }

                    if (param) {
                        resolve(param);
                    }
                }, pool);

            });
        }
    }

    else {
        res.status(400).send("Only Admin can add the HSN code");
    }
}
function getGstTable(pool, req, res) {
    let limit;
    let offset;
    offset = (req.body.page - 1) * (req.body.limit);
    limit = req.body.limit
    return new Promise((resolve, reject) => {
        var parameters = {
            query: 'SELECT (select sum(case WHEN isDeleted = false  Then 1 else 0 end) as Records from tbl_gst) as totalRecord , gst_ID, Item, Item_Desc, gst_Cat_ID, HSN_No, igst, cgst, sgst FROM newinventory.tbl_gst where isDeleted = 0 LIMIT ' + limit + ' OFFSET ' + offset
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
function sendMail(pool, req, res) {
    return new Promise((resolve, reject) => {
        let path = req.file.path;
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'amantyagi10595js@gmail.com',
                pass: '*************'
            }
        });

        var mailOptions = {
            from: 'amantyagi10595js@gmail.com',
            to: req.body.email,
            attachments: [
                {   // file on disk as an attachment
                    filename: req.file.filename,
                    path: req.file.path // stream this file
                }],
            subject: 'Your Pdf file',
            text: `Hi ${req.body.name}, your total amount is ${req.body.total_amount}.
 This mail has attachment also, please check.

 Thanks,
 Shipgig`,
            // html: '<p>Click</p> <a href= ' + req.file.path + '> here</a> '
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.status(400).send({ "msg": "Mail not sent" });
            } else {
                res.status(200).send({ "msg": "Mail sent" });
            }
        });
    });
}


module.exports = {
    getGstCategory: async (pool, req, res) => {
        let categories = await getGstCat(pool, req, res);
        res.status(200).json(categories);
    },
    setGstTable: async (pool, req, res) => {
        let data = await setGstTable(pool, req, res);
        res.status(200).json(data);
    },
    getGstTable: async (pool, req, res) => {
        let data = await getGstTable(pool, req, res);
        res.status(200).json(data);
    },
    sendMail: async (pool, req, res) => {
        let data = await sendMail(pool, req, res);
        res.status(200).json(data);
    }


}