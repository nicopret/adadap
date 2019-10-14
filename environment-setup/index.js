const bodyParser = require('body-parser'),
    express = require('express'),
    fs = require('fs');

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/create', function(req, res) {
    const dir = req.body.dir;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        fs.mkdirSync(dir + '/data');
        fs.mkdirSync(dir + '/logs');
        fs.writeFile(dir + '/logs/00.log', '');
        console.log(typeof req.body.count);
        res.send(req.body.dir + ' created with ' + req.body.count + ' test account(s)');
    } else {
        res.send('The project exists, please choose another name');
    }
});

app.listen(3000, () => console.log('running on http://localhost:3000'));