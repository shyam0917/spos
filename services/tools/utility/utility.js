var constantData = require('./constant');
module.exports = {
    sendApiResponse: function (res, code, result) {
        
        res.send({
            status: constantData.enumResponse[code],
            code: code,
            data: result
        });

        
    },
    getStringFromQSOrForm: function (request, sKey, callback) {
        var flag = -1;
        var keys = Object.keys(request.params);
        keys.forEach(function (key, index) {
            if (key.trim() == sKey) {
                flag = 1;
                callback(null, request.params[sKey]);
            }

            if (flag == -1 && keys.length == (index + 1)) {
                callback("Not Found 1");
            }
        }, this);


        // else if (!request.params.Form[sKey]) {
        //      sVal = request.params.Form[sKey];
        //  }

    },
    getIntFromQueryString: function (request, sKey, lDefault, callback) {

        var lVal = lDefault;
        var flag = -1;
        var keys = Object.keys(request.params);
        keys.forEach(function (key, index) {
            if (key.trim() == sKey) {
                if (request.params[sKey] == "") {
                    flag = 1;
                    callback(null, 0);
                }
                if (!isNaN(request.params[sKey])) {
                    flag = 1;
                    callback(null, Number(request.params[sKey]));
                }
            }
            if (flag == -1 && keys.length == (index + 1)) {

                callback(null, lVal);
            }
        }, this);

    },

    getIntFromSPOutput: function (request, sKey, lDefault, callback) {
        var lVal = lDefault;
        var flag = -1;
        // console.log("result",request);

        var keys = Object.keys(request[0]);
        keys.forEach(function (key, index) {
            if (key.trim() == sKey) {
                if (request[0][sKey] == "") {
                    flag = 1;
                    callback(null, 0);
                }
                if (!isNaN(request[0][sKey])) {
                    flag = 1;
                    callback(null, Number(request[0][sKey]));
                }
            }
            if (flag == -1 && keys.length == (index + 1)) {
                callback("Not Found 2");
            }
        }, this);

    },
    getIntFromString: function (sVal, lDefault) {
        if (sVal == "") {
            return lDefault;
        }
        var lVal = lDefault;
        if (!isNaN(lVal)) {
            lVal = Number(sVal);
        }
        return lVal;
    },
    getArrayKeyValueFirstLevel: function (json, key, callback) {
        key = key.trim();
        var arrayLength = json.length - 1;
        var flag = -1;
        json.forEach(function (element, index) {
            if ((element["-Key"].trim()) == key) {
                flag = 1;
                callback(null, element["-Value"]);
            }
            if (flag == -1 && arrayLength == index) {
                callback("Not found 3");
            }
        }, this);

    }
}