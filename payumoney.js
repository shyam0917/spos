const router = require('express').Router();
const crypto = require('crypto');
const request = require('request');

router.get('/', function (req, res) {

    res.render('checkout.ejs', { orderid: ord });
});


router.post('/', function (req, res) {
    var ord = JSON.stringify(Math.random() * 1000);
    var i = ord.indexOf('.');
    ord = 'ORD' + ord.substr(0, i);
    let data = req.body;
    if (!data.key || !data.salt || !ord || !data.amount || !data.pinfo || !data.fname || !data.email || !data.mobile || !data.udf5 || data.mobile.length < 10) {
        return res.send(null);
    }
    var cryp = crypto.createHash('sha512');
    var text = data.key + '|' + ord + '|' + data.amount + '|' + data.pinfo + '|' + data.fname + '|' + data.email + '|||||' + data.udf5 + '||||||' + data.salt;
    cryp.update(text);
    var hash = cryp.digest('hex');
    res.json({ "msg": hash });
});

router.post('/response', function (req, res) {
    var key = '3Y9TkKa1';
    var salt = 'Rk9gdpEkiF';
    var txnid = req.body.txnid;
    var amount = req.body.amount;
    var productinfo = req.body.productinfo;
    var firstname = 'SHIPGIG';
    var email = 'vivek@webmindinfosoft.com';
    var udf5 = req.body.udf5;
    var mihpayid = req.body.mihpayid;
    var status = req.body.status;
    var resphash = req.body.hash;

    var keyString = key + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|||||' + udf5 + '|||||';
    var keyArray = keyString.split('|');
    var reverseKeyArray = keyArray.reverse();
    var reverseKeyString = salt + '|' + status + '|' + reverseKeyArray.join('|');

    var cryp = crypto.createHash('sha512');
    cryp.update(reverseKeyString);
    var calchash = cryp.digest('hex');

    var msg = 'Payment failed for Hash not verified...';
    if (calchash == resphash)
        msg = 'Transaction Successful and Hash Verified...';

    res.render('response.ejs', {
        key: key, salt: salt, txnid: txnid, amount: amount, productinfo: productinfo,
        firstname: firstname, email: email, mihpayid: mihpayid, status: status, resphash: resphash, msg: msg
    });
});


router.get('/payumoney', (req, res) => {
    let data = {
        key: '3Y9TkKa1',
        txnid: 'txn123456',
        amount: '10.00',
        productinfo: 'P01,P02',
        firstname: 'aman',
        email: 'aman@shipgigventures.com',
        phone: '8920401676',
        surl: 'http://localhost:3000/pay/success',
        furl: 'http://localhost:3000/pay/failure',
        hash: '',
        service_provider: 'payu_paisa'
    }
    var cryp = crypto.createHash('sha512');
    var text = data.key + '|' + data.txnid + '|' + data.amount + '|' + data.productinfo + '|' + data.firstname + '|' + data.email + '||||||' + '||||||' + 'Rk9gdpEkiF';
    cryp.update(text);
    var hash = cryp.digest('hex');
    data.hash = hash;
    let url = "https://test.payu.in/_payment";
    request.post({
        url,
        form: data
    }, (err, response, body) => {
        if (err) {
            return res.send({ error: err, body })
        }
        res.send(response);
    })
});

router.get('/success', (req, res) => {
    res.send(req.body);
})

router.get('/failure', (req, res) => {
    res.send(req.body);
})
module.exports = router;