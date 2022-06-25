"use strict";

const express = require("express");
const Redis = require("ioredis");
const app = express();
const sub = new Redis();
const pub = new Redis();
const PORT = process.env.HTTP_PORT || 3000;
const REDIS_CHANNEL = "APP_PUB_SUB";
const APP_NAME = process.env.APP_NAME;
const debug = require("debug")(APP_NAME);

(async function () {
    await sub.subscribe([REDIS_CHANNEL]);
    sub.on("message", (channel, message) => {
        debug("channel", channel, message)
    });
})();

app.get("/", (req, res) => {
    res.json("Hello World");
});

app.get("/publish", (req, res) => {
    const msg = req.query.message || "default_message";
    pub.publish(REDIS_CHANNEL, msg);
    res.json("OK");
});

app.listen(parseInt(PORT, 10), () => {
    console.log(`Listening for requests on http://localhost:${PORT}`);
});
