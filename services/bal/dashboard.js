var sqlConnect = require('../tools/utility/mssql.connection');
var utility = require('../tools/utility/utility');
var jwt = require('jsonwebtoken');
var accessCodeAdmin = 'SADM';

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
      // console.log('in userAccessUserID', parameters);
      sqlConnect.connect('query', parameters, function (error, param) {
        if (error) {
          reject(error);
        }

        if (param) {
          resolve(param);
        }
      }, pool);
    }
    else {
      reject(error);
    }
  });
}

module.exports = {
  totalStock: function (pool, req, res) {

    userAccess(pool, req, res).then(function (data) {
      if (data[0].role == accessCodeAdmin) {
        var parameters = {
          query: 'select count(tp.product_ID) as totalProducts, sum(unitPrice) as productsValue from tbl_product tp where isDeleted = 0'
        }
      } else {

      }
      sqlConnect.connect('query', parameters, function (error, param) {
        if (error) {
          return utility.sendApiResponse(res, 3, { result: error, code: 3 }); // when error in sp
        }
        // console.log("param---->", param);
        if (param && param[0]) {
          utility.sendApiResponse(res, 0, { result: param, code: 0 });
        }
        else {
          utility.sendApiResponse(res, 1, { result: "null", code: 1 });
        }
      }, pool);
    }).catch(function (err) {
      utility.sendApiResponse(res, 3, { result: error, code: 3 });
    });
  },

  totalSale: function (pool, req, res) {

    userAccess(pool, req, res).then(function (data) {
      if (data[0].row == affectedRows) {
        var parameters = {
          query: 'select count(tt.transaction_ID) as totalTrans, sum(tt.totalAmount) as totalSale, sum(tt.totalAmount) /count(tt.transaction_ID) as avgSalePerTrans from tbl_transaction tt where tt.isDeleted = 0 and tt.isVoid = 0 and tt.createdOn between date_sub(NOW(),interval 1 week) and NOW()'
        }
      } else {

      }
      sqlConnect.connect('query', parameters, function (error, param) {
        if (error) {
          return utility.sendApiResponse(res, 3, { result: error, code: 3 }); // when error in sp
        }
        // console.log("param---->", param);
        if (param && param[0]) {
          utility.sendApiResponse(res, 0, { result: param, code: 0 });
        }
        else {
          utility.sendApiResponse(res, 1, { result: "null", code: 1 });
        }
      }, pool);
    }).catch(function (err) {
      utility.sendApiResponse(res, 3, { result: error, code: 3 });
    });
  },

  addDeviceStatus: function (pool, req, res) {
    userAccess(pool, req, res).then(function (data) {
      if (data[0].role == accessCodeAdmin) {
        var parameters = {
          query: `Update tbl_store_pos set deviceStatus=${JSON.stringify(req.body.p_device_Status)} where tbl_store_pos_ID =${JSON.stringify(req.body.p_tableStore_pos_ID)} AND Store_ID=${JSON.stringify(req.body.p_Store_ID)} AND pos_ID=${JSON.stringify(req.body.p_pos_ID)} AND isDeleted=0`
        }
      } else {
        var parameters = {
          query: `Update tbl_store_pos set deviceStatus=${JSON.stringify(req.body.p_device_Status)} where tbl_store_pos_ID =${JSON.stringify(req.body.p_tableStore_pos_ID)} AND Store_ID=${JSON.stringify(req.body.p_Store_ID)} AND pos_ID=${JSON.stringify(req.body.p_pos_ID)} AND isDeleted=0`
        }
      }
      sqlConnect.connect('query', parameters, function (error, param, fields) {
        // console.log("param  && param...", param, fields);
        if (error) {
          // console.log('error ======>  ', error);
          return utility.sendApiResponse(res, 3, { result: error, code: 3 });
        }

        if (param) {
          if (param && param.affectedRows > 0) {     // edited by regan 02-august
            utility.sendApiResponse(res, 0, { result: param, fields: fields, code: 0 });
          } else {
            utility.sendApiResponse(res, 1, { result: param, fields: fields, code: 1 });
          }
        }
      }, pool);
    }).catch(function (err) {
      utility.sendApiResponse(res, 3, { result: error, code: 3 });
    });
  },

  addPOS: function (pool, req, res) {
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
    // console.log('req.body', req.body.p_store_ID, req.body.p_pos_ID, req.body.p_deviceStatus);

    userAccess(pool, req, res).then(function (data) {
      if (data[0].role == accessCodeAdmin) {
        var parameters = {
          query: `Insert into tbl_store_pos (Store_ID, pos_ID, createdOn, modifiedOn, deletedOn, isDeleted, deviceStatus, deletedBy, modifiedBy) values(${JSON.stringify(req.body.p_store_ID)}, ${JSON.stringify(req.body.p_pos_ID)}, ${JSON.stringify(year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds)}, ${JSON.stringify(year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds)}, ${JSON.stringify(year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds)}, 0, 0, 0, 0);`
        }
      } else {
        utility.sendApiResponse(res, 3, { result: error, code: 3 });  // only if else part is needed
      }
      sqlConnect.connect('query', parameters, function (error, param, fields) {
        // console.log("param  && param...", param, fields);
        if (error) {
          // console.log('error ======>  ', error);
          return utility.sendApiResponse(res, 3, { result: error, code: 3 });
        }

        if (param) {
          if (param && param.affectedRows > 0) {     // edited by regan 02-august
            utility.sendApiResponse(res, 0, { result: param, fields: fields, code: 0 });
          } else {
            utility.sendApiResponse(res, 1, { result: param, fields: fields, code: 1 });
          }
        }
      }, pool);
    }).catch(function (err) {
      utility.sendApiResponse(res, 3, { result: error, code: 3 });
    });
  },

  getPOS: function (pool, req, res) {
    var sysUser_ID = req.body.userID;
    console.log("check here :", req.body)
    var parameters = {
      query: 'SELECT store_ID, role FROM tbl_sysuser where sysUser_ID =' + sysUser_ID,
    }

    sqlConnect.connect('query', parameters, function (error, param) {
      if (error) {
        return utility.sendApiResponse(res, 3, { result: error, code: 3 });
      }// when error in sp

      if (param && param.length > 0) {
        var getPOSByRole = function (data, pool, req, res) {
          if (data[0].role == 'SADM') {
            var parameters = {
              // query: 'Select tbl_category.categoryName, tbl_store FROM tbl_store JOIN tbl_category Where tbl_store.category_ID=tbl_category.category_ID and tbl_store.isDeleted=0',

              query: 'SELECT tbl_store_pos.Store_ID, tbl_store_pos.pos_ID, tbl_store_pos.tbl_store_pos_ID, tbl_store_pos.deviceStatus, tbl_store_pos.isDeleted, tbl_store.storeName FROM tbl_store_pos, tbl_store where tbl_store.store_ID = tbl_store_pos.Store_ID'
            }
          } else {
            var parameters = {
              query: 'SELECT tbl_store_pos.Store_ID, tbl_store_pos.pos_ID, tbl_store_pos.tbl_store_pos_ID, tbl_store_pos.deviceStatus, tbl_store_pos.isDeleted, tbl_store.storeName FROM tbl_store_pos, tbl_store where tbl_store.store_ID = tbl_store_pos.Store_ID AND tbl_store_pos.Store_ID=' + data[0].store_ID,

              // query: 'SELECT tbl_store.storeName, tbl_store_pos.Store_ID, tbl_store_pos.pos_ID, tbl_store_pos.tbl_store_pos_ID, tbl_store_pos.deviceStatus, tbl_store_pos.isDeleted FROM tbl_store_pos JOIN tbl_store where tbl_store.store_ID = tbl_store_pos.Store_ID AND tbl_store_pos.Store_ID='+ data[0].store_ID,
            }
          }

          sqlConnect.connect('query', parameters, function (error, param) {
            if (error) {
              return utility.sendApiResponse(res, 3, { result: error, code: 3 }); // when error in sp
            }
            if (param && param.length > 0) {
              utility.sendApiResponse(res, 0, { result: param, code: 0 });
            } else {
              utility.sendApiResponse(res, 1, { result: "null", code: 1 });
            }
          }, pool);
        };
        getPOSByRole(param, pool, req, res);

      } else {
        utility.sendApiResponse(res, 1, { result: "null", code: 1 });
      }

    }, pool);
  },

  editPOS: function (pool, req, res) {
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

    userAccess(pool, req, res).then(function (data) {
      if (data[0].role == accessCodeAdmin) {
        var parameters = {
          query: `Update tbl_store_pos set Store_ID=${JSON.stringify(req.body.p_store_ID)},pos_ID=${JSON.stringify(req.body.p_pos_ID)},createdOn=${JSON.stringify(year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds)},modifiedOn=${JSON.stringify(year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds)},deletedOn=${JSON.stringify(year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds)},isDeleted=0, deviceStatus=${JSON.stringify(req.body.p_device_Status)},deletedBy=0, modifiedBy=0 where tbl_store_pos_ID = ${req.body.p_tbl_store_pos_ID}`
        }
      } else {
        utility.sendApiResponse(res, 3, { result: error, code: 3 }); // if only else part is required.
      }
      sqlConnect.connect('query', parameters, function (error, param, fields) {
        if (error) {
          return utility.sendApiResponse(res, 3, { result: error, code: 3 });
        }

        if (param) {
          if (param && param.affectedRows > 0) {
            utility.sendApiResponse(res, 0, { result: param, fields: fields, code: 0 });
          } else {
            utility.sendApiResponse(res, 1, { result: param, fields: fields, code: 1 });
          }
        }
      }, pool);
    }).catch(function (err) {
      utility.sendApiResponse(res, 3, { result: error, code: 3 });
    });
  },

  deletePos: function (pool, req, res) {
    var info = {};
    info = req.body;

    userAccess(pool, req, res).then(function (data) {
      if (data[0].role == accessCodeAdmin) {
        var parameters = {
          query: 'Update tbl_store_pos set isDeleted=1 where tbl_store_pos_ID=' + req.body.p_tbl_store_pos_ID,
          // query: 'DELETE from tbl_store_pos where tbl_store_pos_ID=' + req.body.p_tbl_store_pos_ID,
        }
      } else {
        utility.sendApiResponse(res, 3, { result: error, code: 3 });   // if only else part is required.
      }
      sqlConnect.connect('query', parameters, function (error, param) {
        if (error) {
          return utility.sendApiResponse(res, 3, { result: error, code: 3 }); // when error in sp
        }
        if (param && param.affectedRows > 0) {
          utility.sendApiResponse(res, 0, { result: param, code: 0 });
        } else {
          utility.sendApiResponse(res, 1, { result: "null", code: 1 });
        }
      }, pool);
    }).catch(function (err) {
      utility.sendApiResponse(res, 3, { result: error, code: 3 });
    });
  },

  profit: function (pool, req, res) {
    var info = {};
    info = req.body;
    function selectQuery(info) {
      var query = 'select SUM(tt.totalAmount) - (SUM(tt.GST) + SUM(tp.costPrice) + SUM(tt.specialDiscount)) as Profit from tbl_transaction tt join tbl_invoice ti on tt.transaction_id = ti.transaction_id and ti.isReturned = 0 and ti.isDeleted = 0 join tbl_product tp on tp.product_id = ti.product_id and tp.costPrice is not null where tt.isDeleted = 0 and tt.Store_ID = ' + info.p_store_ID + ' and tt.isVoid = 0 and '

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
        case "Hourly":
          query = query + 'tt.createdOn between date_sub(NOW(),interval 1 hour) and NOW()';
          break;
        default:
          query = query + 'tt.createdOn between date_sub(NOW(),interval 1 month) and NOW()';
      }
      return query;
    }

    var parameters = {
      query: selectQuery(info),
    }

    sqlConnect.connect('query', parameters, function (error, param) {
      if (error) {
        return utility.sendApiResponse(res, 3, { result: error, code: 3 });
      } // when error in sp
      if (param && param[0]) {
        utility.sendApiResponse(res, 0, { result: param, code: 0 });
      }
      else {
        utility.sendApiResponse(res, 1, { result: "null", code: 1 });
      }
    }, pool);
  }

}
