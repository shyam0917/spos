const config = require('dotenv').config()
var express = require("express");
const morgan = require("morgan");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var mysql = require("mysql");
var fs = require("fs");
var atob = require("atob");
var sqlConnect = require("./services/tools/utility/mssql.connection");
var cors = require("cors");
var multer = require("multer");
var dirImage = "./uploads/images/";
var dirFile = "./uploads/files/";
var nodemailer = require("nodemailer");
var Request = require("request");
const ejs = require("ejs");
var moment = require("moment");
let storageForFile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dirFile);
  },
  filename: (req, file, cb) => {

    cb(null, originalname);
  }
});
let storageForImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dirImage);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});
let uploadFile = multer({
  storage: storageForFile
});
let uploadImage = multer({
  storage: storageForImage
});
const setup = require("./services/bal/setup");
var registrationModule = require("./services/bal/registration");
var reportsModule = require("./services/bal/reports");
var dashboardModule = require("./services/bal/dashboard");
var constantData = require("./services/tools/utility/constant");
const crypto = require("crypto");
const licenceRoute = require("./routes/licence");

var jwt = require("jsonwebtoken");
app.use(bodyParser.json());

var appSecret = "APPSECRET";
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(cors());
app.use("/", express.static(path.join(__dirname, "public")));
// app.use(morgan('dev'));
app.set("view engine", "ejs");
// app.engine('html', ejs.renderFile);
app.set("views", __dirname + "/views");
var pool = new mysql.createPool(constantData.dbConnection);
var syncUrl = "http://192.168.1.112:9999/SqliteSync_315/API3";
const payumoney = require("./payumoney");

app.use("/pay", payumoney);
app.post("/response", function (req, res) {
  var key = "3Y9TkKa1";
  var salt = "Rk9gdpEkiF";
  var txnid = req.body.txnid;
  var amount = req.body.amount;
  var productinfo = req.body.productinfo;
  var firstname = "SHIPGIG";
  var email = "vivek@webmindinfosoft.com";
  var udf5 = req.body.udf5;
  var mihpayid = req.body.mihpayid;
  var status = req.body.status;
  var resphash = req.body.hash;

  var keyString =
    key +
    "|" +
    txnid +
    "|" +
    amount +
    "|" +
    productinfo +
    "|" +
    firstname +
    "|" +
    email +
    "|||||" +
    udf5 +
    "|||||";
  var keyArray = keyString.split("|");
  var reverseKeyArray = keyArray.reverse();
  var reverseKeyString = salt + "|" + status + "|" + reverseKeyArray.join("|");

  var cryp = crypto.createHash("sha512");
  cryp.update(reverseKeyString);
  var calchash = cryp.digest("hex");

  var msg = "Payment failed for Hash not verified...";
  if (calchash == resphash) msg = "Transaction Successful and Hash Verified...";

  res.render("response.ejs", {
    key: key,
    salt: salt,
    txnid: txnid,
    amount: amount,
    productinfo: productinfo,
    firstname: firstname,
    email: email,
    mihpayid: mihpayid,
    status: status,
    resphash: resphash,
    msg: msg
  });
});

app.get("/ejs", function (req, res) {
  var time1 = moment().format("YYYY-MM-DD HH:mm:ss");
  var time = JSON.stringify(time1);
  var timeMoment = moment(time, "YYYY-MM-DD HH:mm:ss");
  var parameters = {
    query: `SELECT LincStatus, TimeChngPass FROM tbl_sysuser where sysUser_ID = ${atob(
      req.query.sysid
    )};`
  };
  sqlConnect.connect(
    "query",
    parameters,
    function (error, param, fields) {
      if (error) {
        res.send(`<h3>Try Again<h3>`);
      } else if (!param[0]["LincStatus"]) {

        res.send(
          `<h3>Hi,<h3><p>! You have updated your password with this link. Please generate another link.<p>`
        );
        // res.render('notFound');
      } else {
        var timePrevious = moment(param[0].TimeChngPass, "YYYY-MM-DD HH:mm:ss");
        var duration = moment.duration(timeMoment.diff(timePrevious));
        var timeDiff = duration.asMinutes();

        if (timeDiff > 15) {
          res.send(
            `<h3>Hi,<h3><p>Your session to change password has expired !, Please generate link again.<p>`
          );
        } else {
          res.render("home", {
            sysid: req.query.sysid,
            msg: req.query.msg,
            url: "http://192.168.1.96:3000/updatePasswardEjs"
          });
        }
      }
    },
    pool
  );
});

var exec = require("child_process").exec;
var execPhp = require("exec-php");
app.get("/php", (req, res) => {
  let phpPath = __dirname + "/paytm/generateChecksum.php";
  exec("php " + phpPath, (error, stdout, stderr) => {
    if (error) return res.status(500).json({
      error: error
    });
    res.send(stdout);
  });
});
app.get("/payuMoney_php", (req, res) => {
  let phpPath = __dirname + "/php_file/new_hash.php";
  exec("php " + phpPath, (error, stdout, stderr) => {
    if (stderr) return res.send(stderr + stdout);
    res.send(stdout);
  });
});

const sha512 = require("js-sha512");
app.post("/payuMoney_php", (req, res) => {
  // const { key, txnid, amount, productinfo, firstname, email } = req.body;
  // execPhp('./php_file/new_hash.php', function (error, php, outputprint) {
  //   php.myfunc(key, txnid, amount, productinfo, firstname, email, function (error, result, output, printed) {
  //     if (error) return res.send(error);
  //     res.send(printed);
  //   });
  // });
  const {
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email
  } = req.body;
  let text =
    key +
    "|" +
    txnid +
    "|" +
    amount +
    "|" +
    productinfo +
    "|" +
    firstname +
    "|" +
    email +
    "|||||||||||" +
    "Rk9gdpEkiF";
  let hash = sha512(text);
  return res.send(hash);
});

//************************************************************* authentication/verification function

function isAuthenticated(req, res, next) {
  if (
    req.headers.token !== undefined &&
    req.headers.token !== "null" &&
    req.headers.token !== null
  ) {
    var token = JSON.parse(req.headers.token);
  } else {
    var token = undefined;
  }
  var refreshToken = null;
  req.refreshToken = undefined;
  req.verifytoken = false;
  if (token != undefined && token != "null" && token != null) {
    var decodeToken = jwt.decode(token); // decode token into username and password
    var iat = new Date(decodeToken.iat * 1000); // issue time of token
    var exp = new Date(decodeToken.exp * 1000); // expiry time of token
    var cdt = new Date(); // current time
    var diff = Math.round((((exp - cdt) % 86400000) % 3600000) / 60000); // difference in minutes
    var data = {};
    data.p_username = decodeToken.p_username;
    data.p_password = decodeToken.p_password;
    if (diff < 5) {
      var refreshToken = jwt.sign(data, appSecret, {
        expiresIn: 60 * 60 // expires in 60 minutes
      });
      req.refreshToken = refreshToken;
    }

    jwt.verify(token, appSecret, function (err, token_data) {
      if (err) {
        console.error("Token Mismatch / session time out plz login again", err);
        return res.json({
          success: false,
          message: "Token Mismatch / session time out plz login again!"
        });
      } else {
        req.verifytoken = true;
        next();
      }
    });
  } else {
    console.log("Token Not Found");
    return res.json({
      success: false,
      message: "Token Not Found!"
    });
  }
}

// app.get(constantData.directory + constantData.subDirectory, function (req, res) {
//   res.send("Hello World!");
// });

app.post("/verify", isAuthenticated, function (req, res) {
  if (req.verifytoken) {
    if (req.refreshToken) {
      return res.json({
        verifytoken: true,
        refreshToken: req.refreshToken
      });
    } else {
      return res.json({
        verifytoken: true
      });
    }
  } else {
    return res.json({
      verifytoken: false
    });
  }
});

app.use(function (req, res, next) {
  // new changes aug-27 regan
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,token,user, multipart/form-data"
  );
  next();
});
app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  next();
});

app.post(
  constantData.directory + constantData.subDirectory + "verify",
  isAuthenticated,
  function (req, res) {
    if (req.verifytoken) {
      if (req.refreshToken) {
        return res.json({
          verifytoken: true,
          refreshToken: req.refreshToken
        });
      } else {
        return res.json({
          verifytoken: true
        });
      }
    } else {
      return res.json({
        verifytoken: false
      });
    }
  }
);

// multiple photo upload function
app.post('/uploadMultiplemages', uploadImage.array("uploads", 8), function (req, res) {
  console.log("files ", req.files);

  if (req.files) {
    var fileinfo = req.files;
    res.send(fileinfo);
  }
}

)

//our photo upload function
app.post(
  constantData.directory + constantData.subDirectory + "uploadProductImage",
  function (req, res) {
    var uploadImage = multer({
      storage: multer.memoryStorage()
    }).single(
      "photo"
    );
    uploadImage(req, res, function (err) {
      var buffer = req.file.buffer;
      isAuthenticated;
      var productImageName = req.file.originalname;
      if (fs.existsSync(dirImage + productImageName)) {
        return res.send({
          success: false,
          status: 422,
          msg: "No Duplicate Image Name Allowed"
        });
      }
      if (req.file) {
        fs.writeFile(dirImage + productImageName, buffer, "binary", function (
          err
        ) {
          if (err) {
            throw err;
          }
          return res.send({
            success: true,
            productImageName
          });
        });
      } else {
        return res.send({
          success: false
        });
      }
    });
  }
);
app.get(
  constantData.directory + constantData.subDirectory + "gstCategory",
  (req, res) => {
    setup.getGstCategory(pool, req, res);
  }
);


app.post(
  constantData.directory + constantData.subDirectory + "setGstTable",
  isAuthenticated,
  function (req, res) {
    setup.setGstTable(pool, req, res);
  }
);
app.post(
  constantData.directory + constantData.subDirectory + "getGstTable",
  function (req, res) {
    setup.getGstTable(pool, req, res);
  }
);
//our file upload function
app.post(
  constantData.directory + constantData.subDirectory + "uploadProductFile",
  uploadFile.single("file"),
  function (req, res) {
    var productFileName = req.file.originalname;
    if (!req.file) {
      return res.send({
        success: false
      });
    } else {
      return res.send({
        success: true,
        productFileName
      });
    }
  }
);

app.post(constantData.directory + constantData.subDirectory + "login", function (
  req,
  res
) {
  registrationModule.sysLogin(pool, req, res);
});
var path = require("path");
var s = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "./uploads/files/"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const u = multer({
  storage: s
});
// var upload = multer({ dest: '../uploads/files/' });
app.post(
  constantData.directory + constantData.subDirectory + "uploadFile",
  u.single("myFile"),
  function (req, res) {
    // res.status(200).send('ok');
    setup.sendMail(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "registration",
  function (req, res) {
    registrationModule.sysUserRegistration(pool, req, res);
  }
);
app.post(
  constantData.directory + constantData.subDirectory + "resetPassword",
  function (req, res) {
    registrationModule.sysResetPass(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "forgotPassward",
  function (req, res) {
    registrationModule.sysforgotPassward(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "updatePassward",
  function (req, res) {
    registrationModule.sysUpdatePassward(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "updatePasswardEjs",
  function (req, res) {
    registrationModule.sysUpdatePasswardEjs(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "vaildateSysUser",
  isAuthenticated,
  function (req, res) {
    registrationModule.vaildateSysUser(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "userRegistration",
  isAuthenticated,
  function (req, res) {
    registrationModule.userRegistration(pool, req, res);
  }
);

app.get(
  constantData.directory + constantData.subDirectory + "getUser",
  isAuthenticated,
  function (req, res) {
    registrationModule.getUser(pool, req, res);
  }
);

app.get('/getStates', (req, res) => {
  const options = {
    url: 'https://geodata.solutions/api/api.php?type=getStates&countryId=IN&addClasses=order-alpha',
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
      'Accept': 'application/json'
    }
  };
  Request.get(options).pipe(res);
});
app.post('/getPinInfo', (req, res) => {
  console.log(req.body.pin)
  const options = {
    url: 'https://api.postalpincode.in/pincode/' + req.body.pin,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
      'Accept': 'application/json'
    }
  };
  console.log(options)
  Request.get(options).pipe(res);
})
app.post('/getCities', (req, res) => {
  var stateId = req.body.key;
  const options = {
    url: 'https://geodata.solutions/api/api.php?type=getCities&countryId=IN&stateId=' + stateId + '&addClasses=order-alpha',
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
      'Accept': 'application/json'
    },
    method: 'GET'
  };
  Request.get(options).pipe(res);
})

app.post(
  constantData.directory + constantData.subDirectory + "deleteUser",
  isAuthenticated,
  function (req, res) {
    registrationModule.deleteUser(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "transaction",
  isAuthenticated,
  function (req, res) {
    registrationModule.transaction(pool, req, res);
  }
);

app.get(
  constantData.directory + constantData.subDirectory + "getTransaction",
  isAuthenticated,
  function (req, res) {
    registrationModule.getTransaction(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "checkSysEmailexist",
  function (req, res) {
    registrationModule.checkSysEmailexist(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "checkSysUserexist",
  function (req, res) {
    registrationModule.checkSysUserexist(pool, req, res);
  }
);
app.post(
  constantData.directory + constantData.subDirectory + "deleteTransaction",
  isAuthenticated,
  function (req, res) {
    registrationModule.deleteTransaction(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "addUpdateStore",
  isAuthenticated,
  function (req, res) {
    registrationModule.addUpdateStore(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "checkStoreExist",
  isAuthenticated,
  function (req, res) {
    registrationModule.checkStoreExist(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "getAllStoreId",
  function (req, res) {
    registrationModule.getAllStoreId(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "getstore",
  isAuthenticated,
  function (req, res) {
    registrationModule.getStore(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "deletestore",
  isAuthenticated,
  function (req, res) {
    registrationModule.deleteStore(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "createstore",
  isAuthenticated,
  function (req, res) {
    registrationModule.createStore(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "createcategory",
  isAuthenticated,
  function (req, res) {
    registrationModule.createCategory(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "createsubcategory",
  isAuthenticated,
  function (req, res) {
    registrationModule.createSubcategory(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "updatestore",
  function (req, res) {
    registrationModule.updateStore(pool, req, res);
  }
);

app.post(

  constantData.directory + constantData.subDirectory + "getmanagers",
  isAuthenticated,
  function (req, res) {
    registrationModule.getManagers(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "deletemanager",
  isAuthenticated,
  function (req, res) {
    registrationModule.deleteManagers(pool, req, res);
  }
);
app.post(
  constantData.directory + constantData.subDirectory + "addUpdateProduct",
  isAuthenticated,
  function (req, res) {
    registrationModule.addUpdateProduct(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "deleteProduct",
  isAuthenticated,
  function (req, res) {
    registrationModule.deleteProduct(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "getProduct",
  function (req, res) {
    registrationModule.getProduct2(pool, req, res);
  }
);
app.post(
  constantData.directory + constantData.subDirectory + "searchProdByName",
  function (req, res) {
    registrationModule.searchProdByName(pool, req, res);
  }
);
app.post(
  constantData.directory + constantData.subDirectory + "getProductCount",
  function (req, res) {
    registrationModule.getProductCount(pool, req, res);
  }
);
app.get(
  constantData.directory +
  constantData.subDirectory +
  "getCountAboutOutofStock",
  function (req, res) {
    registrationModule.getCountAboutOutofStock(pool, req, res);
  }
);

app.get(
  constantData.directory + constantData.subDirectory + "getCountOutofStock",
  function (req, res) {
    registrationModule.getCountOutofStock(pool, req, res);
  }
);

app.get(
  constantData.directory + constantData.subDirectory + "gstItems",
  isAuthenticated,
  function (req, res) {
    registrationModule.gstItems(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "transactionPurchase",
  isAuthenticated,
  function (req, res) {
    registrationModule.transactionPurchase(pool, req, res);
  }
);

app.post(
  constantData.directory +
  constantData.subDirectory +
  "transactionInvoiceItems",
  isAuthenticated,
  function (req, res) {
    registrationModule.transactionInvoiceItems(pool, req, res);
  }
);

// Get Unit Of Measurement      changed get to post aug-21
app.post(
  constantData.directory + constantData.subDirectory + "uoms",
  isAuthenticated,
  function (req, res) {
    registrationModule.getUoms(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "adduoms",
  isAuthenticated,
  function (req, res) {
    registrationModule.addUoms(pool, req, res);
  }
);

app.post(
  constantData.directory + constantData.subDirectory + "list",
  isAuthenticated,
  function (req, res) {
    registrationModule.getList(pool, req, res);
  }
);

// GetRoles    changed to post from get aug-21
app.post(
  constantData.directory + constantData.subDirectory + "role",
  isAuthenticated,
  function (req, res) {
    registrationModule.getRole(pool, req, res);
  }
);

// Reports section begin

// TransactionReport
app.post(
  constantData.directory + constantData.subDirectory + "transactionReport",
  isAuthenticated,
  function (req, res) {
    reportsModule.transactionReport(pool, req, res);
  }
);

// InvoiceDetails  getInvoiceDetail
app.post(
  constantData.directory + constantData.subDirectory + "getInvoiceDetail",
  isAuthenticated,
  function (req, res) {
    reportsModule.getInvoiceDetail(pool, req, res);
  }
);

//Aged Inventory Report
app.post(
  constantData.directory + constantData.subDirectory + "expiredGoods",
  isAuthenticated,
  function (req, res) {
    reportsModule.expiredGoods(pool, req, res);
  }
);

// download for excel file 
app.post(
  constantData.directory + constantData.subDirectory + "exportToExcel",
  isAuthenticated,
  function (req, res) {
    reportsModule.exportToExcel(pool, req, res);
  }
);

// Cash Summary Report
app.post(
  constantData.directory + constantData.subDirectory + "cashSummary",
  isAuthenticated,
  function (req, res) {
    reportsModule.cashSummary(pool, req, res);
  }
);

// Sales Report
app.post(
  constantData.directory + constantData.subDirectory + "salesReport",
  isAuthenticated,
  function (req, res) {
    reportsModule.salesReport(pool, req, res);
  }
);

// Customer wise Report
app.post(
  constantData.directory + constantData.subDirectory + "customerReport",
  isAuthenticated,
  function (req, res) {
    reportsModule.customerReport(pool, req, res);
  }
);

// Current User- Single bill

app.post(
  constantData.directory + constantData.subDirectory + "userBillReport",
  isAuthenticated,
  function (req, res) {
    reportsModule.userBillReport(pool, req, res);
  }
);

// Bill/Transaction Tax Report
app.post(
  constantData.directory + constantData.subDirectory + "billTaxReport",
  isAuthenticated,
  function (req, res) {
    reportsModule.billTaxReport(pool, req, res);
  }
);

// Void Bill Report

app.post(
  constantData.directory + constantData.subDirectory + "voidBillReport",
  isAuthenticated,
  function (req, res) {
    reportsModule.voidBillReport(pool, req, res);
  }
);

// Returned Item Report
app.post(
  constantData.directory + constantData.subDirectory + "returnedItemReport",
  isAuthenticated,
  function (req, res) {
    reportsModule.returnedItemReport(pool, req, res);
  }
);

// Inventory(Stock Report)   get changed to post aug-21
app.post(
  constantData.directory + constantData.subDirectory + "stockReport",
  isAuthenticated,
  function (req, res) {
    reportsModule.stockReport(pool, req, res);
  }
);

// Out of Stock Report  changed from get to post
app.post(
  constantData.directory + constantData.subDirectory + "outOfStockReport",
  isAuthenticated,
  function (req, res) {
    reportsModule.outOfStockReport(pool, req, res);
  }
);

// About Out of Stock report    changed from get to post
app.post(
  constantData.directory + constantData.subDirectory + "aboutOutOfStockReport",
  isAuthenticated,
  function (req, res) {
    reportsModule.aboutOutOfStockReport(pool, req, res);
  }
);

// Profit Report ( Only possible if cost price inserted in inventory) (Yearly, Monthly, Weekly)
app.post(
  constantData.directory + constantData.subDirectory + "profitReport",
  isAuthenticated,
  function (req, res) {
    reportsModule.profitReport(pool, req, res);
  }
);

// Returned Cash Report
app.post(
  constantData.directory + constantData.subDirectory + "returnedCashReport",
  isAuthenticated,
  function (req, res) {
    reportsModule.returnedCashReport(pool, req, res);
  }
);

// Store wise Report
app.post(
  constantData.directory + constantData.subDirectory + "storeWiseReport",
  isAuthenticated,
  function (req, res) {
    reportsModule.storeWiseReport(pool, req, res);
  }
);

// All Store Summary/Report (Super Admin)         changed from get to post aug-21
app.post(
  constantData.directory + constantData.subDirectory + "allStoreReport",
  isAuthenticated,
  function (req, res) {
    reportsModule.allStoreReport(pool, req, res);
  }
);

//  Expense Report (Expenses entered by store)   get changed to post aug-21
app.post(
  constantData.directory + constantData.subDirectory + "expenseReport",
  isAuthenticated,
  function (req, res) {
    reportsModule.expenseReport(pool, req, res);
  }
);

// Manager wise Report
app.post(
  constantData.directory + constantData.subDirectory + "managerWiseReport",
  isAuthenticated,
  function (req, res) {
    reportsModule.managerWiseReport(pool, req, res);
  }
);

// Sell using Card Summary Report (Monthly, weekly, Daily, Yearly, etc.)
app.post(
  constantData.directory + constantData.subDirectory + "sellUsingCardReport",
  isAuthenticated,
  function (req, res) {
    reportsModule.sellUsingCardReport(pool, req, res);
  }
);

// Gst Report
app.post(
  constantData.directory + constantData.subDirectory + "gstReport",
  isAuthenticated,
  function (req, res) {
    reportsModule.gstReport(pool, req, res);
  }
);

// Special Discount Report
app.post(
  constantData.directory + constantData.subDirectory + "specialDiscount",
  isAuthenticated,
  function (req, res) {
    reportsModule.specialDiscount(pool, req, res);
  }
);

// Reports section ends

// Dashboard section Begin

//  totalStock
app.get(
  constantData.directory + constantData.subDirectory + "totalStock",
  isAuthenticated,
  function (req, res) {
    dashboardModule.totalStock(pool, req, res);
  }
);

// totalSale
app.get(
  constantData.directory + constantData.subDirectory + "totalSale",
  isAuthenticated,
  function (req, res) {
    dashboardModule.totalSale(pool, req, res);
  }
);

// addPos  08-august regan
app.post(
  constantData.directory + constantData.subDirectory + "add-pos",
  isAuthenticated,
  function (req, res) {
    dashboardModule.addPOS(pool, req, res);
  }
);

//addDeviceStatus   10-august regan
app.post(
  constantData.directory + constantData.subDirectory + "add-deviceStatus",
  isAuthenticated,
  function (req, res) {
    dashboardModule.addDeviceStatus(pool, req, res);
  }
);

// fetchPos   08-august regan
app.post(
  constantData.directory + constantData.subDirectory + "fetch-pos",
  isAuthenticated,
  function (req, res) {
    dashboardModule.getPOS(pool, req, res);
  }
);

// editPos   08-august regan
app.post(
  constantData.directory + constantData.subDirectory + "edit-pos",
  isAuthenticated,
  function (req, res) {
    dashboardModule.editPOS(pool, req, res);
  }
);

// deletePos   09-august regan
app.post(
  constantData.directory + constantData.subDirectory + "delete-pos",
  isAuthenticated,
  function (req, res) {
    dashboardModule.deletePos(pool, req, res);
  }
);

// Profit
app.post(
  constantData.directory + constantData.subDirectory + "profit",
  isAuthenticated,
  function (req, res) {
    dashboardModule.profit(pool, req, res);
  }
);

//caegoryStore     changed from  get to post aug-21
app.post(
  constantData.directory + constantData.subDirectory + "category-store",
  isAuthenticated,
  function (req, res) {
    registrationModule.categoryStore(pool, req, res);
  }
);

// Subcategory Starts
app.post(
  constantData.directory + constantData.subDirectory + "subcategory-store",
  isAuthenticated,
  function (req, res) {
    registrationModule.subcategoryStore(pool, req, res);
  }
);
// Subcategory Ends


app.post(
  constantData.directory + constantData.subDirectory + "errorlog",
  function (req, res) {
    if (req.body.logArray) {
      registrationModule.errorLog(pool, req, res);
    } else {
      res.send({
        Error: "Error"
      });
    }
  }
);

// update api for HSN code implement

// app.post(
//   constantData.directory + constantData.subDirectory + "getUpdateDetails",
//   isAuthenticated,
//   function (req, res) {
//     registrationModule.getUpdateDetails(pool, req, res);
//   }
// );






// Licence Route
app.use("/licence", licenceRoute);
// Dashboard section Ends
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

//global connection -----------------------------
app.listen(3000, function () {
  console.log("Express server listening on port : " + 3000); //+ process.env.PORT
  // Hello
});