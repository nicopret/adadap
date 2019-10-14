var request = require('request');

request({
    uri: 'http://localhost:8080',
    method: 'POST',
    json: {
        id: 1,
        method: "admin_nodeInfo"
    }
}, (err, res) => {
    if (err) return console.error(err);
    console.log(res.body.result.enode);
});