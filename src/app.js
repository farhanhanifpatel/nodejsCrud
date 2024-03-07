"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var app = (0, express_1.default)();
var port = 8080;
app.get('/', function (req, res) {
    res.send('hello how are you');
});
app.listen(port, function () {
    console.log('connectes succesfuuly  ${port}');
});
