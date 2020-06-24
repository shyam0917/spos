var sql = require('mysql');
module.exports = {
    connect: function (commandType, parameters, callback, pool) {

        if (commandType === 'query1') {
            pool.getConnection(function (err, connection) {
                if (err) {
                    console.log(err, '----')
                }
                // Use the connection
                if (connection) {
                    connection.query(parameters.query, function (error, results, fields) {
                        connection.release();

                        if (error) {
                            callback(error);
                        }
                        else {
                            callback(null, results, fields);
                        }
                    });
                }
            });
        }

        // query to the database and get the records
        if (commandType === 'query') {
            // console.log("query:", parameters.query);
            pool.getConnection(function (err, connection) {
                if (err) {
                    console.log(err, '----')
                }
                // Use the connection
                if (connection) {
                    connection.query(parameters.query, function (error, results, fields) {
                        // And done with the connection.
                        connection.release();

                        // Handle error after the release.
                        if (error) {
                            // console.log(error);
                            callback(error);
                        }
                        else {
                            callback(null, results, fields);
                        }

                        // Don't use the connection here, it has been returned to the pool.
                    });
                }
            });

        }
        // Procedure to call
        else if (commandType === 'procedure') {
            //  console.log("parameters", parameters);
            var paramArray = parameters.inputParameters;
            var p_Result = 0;
            var sqlquery = '';
            if (parameters.hasoutputParameters) {
                sqlquery = sqlquery + 'SET @p_Result=0; call ' + parameters.query;
            }
            else {
                sqlquery = sqlquery + 'call ' + parameters.query;
            }

            if (parameters.inputParameters.length > 0 || parameters.hasoutputParameters) {
                sqlquery = sqlquery + '(';
            }
            parameters.inputParameters.forEach(function (element, index) {
                if (index < parameters.inputParameters.length - 1) {
                    if (element.type == 'string')
                        sqlquery = sqlquery + '"' + element.value + '",';
                    else if (element.type == 'int')
                        sqlquery = sqlquery + ' ' + element.value + ' ,';
                }
                else {
                    if (element.type == 'string')
                        sqlquery = sqlquery + '"' + element.value + '"';
                    else if (element.type == 'int')
                        sqlquery = sqlquery + ' ' + element.value + ' ';
                }

            }, this);
            if (parameters.inputParameters.length == 0 && parameters.hasoutputParameters) {
                sqlquery = sqlquery + '@p_Result';
            }
            if (parameters.inputParameters.length > 0 && parameters.hasoutputParameters) {
                sqlquery = sqlquery + ',@p_Result';
            }

            if (parameters.inputParameters.length > 0 || parameters.hasoutputParameters) {
                sqlquery = sqlquery + ')';
            }
            if (parameters.hasoutputParameters) {
                sqlquery = sqlquery + '; select @p_Result; ';
            }

            // console.log('sqlquery,', sqlquery);

            pool.getConnection(function (err, connection) {
                if (err) {
                    // console.log(err);
                    //callback(err);
                }
                // Use the connection
                connection.query(sqlquery, function (error, results, fields) {
                    // And done with the connection.
                    connection.release();
                    // console.log("results-------------------->", results);
                    // Handle error after the release.
                    if (error) {
                        // console.log('err', error);
                        callback(error);
                    }
                    else {
                        // console.log("new ", results, fields);
                        callback(null, results);
                    }

                    // Don't use the connection here, it has been returned to the pool.
                });
            });

        }
    }
}
