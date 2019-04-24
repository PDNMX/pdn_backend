var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

/*
var bodyParser = requiere('body-parser');
*/
var fileUpload = require('express-fileupload');

var indexRouter = require('./routes/index');

var app = express();
var corsOptions={
    origin:false
}
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb', extended: true}));

 */

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(fileUpload());
app.use('/', indexRouter);


// GraphQL
let schema = buildSchema(`
type Query {
quoteOfTheDay: String, 
random: Float!, 
rollThreeDice: [Int]
}
`);

let root =  {
    quoteOfTheDay: () => Math.random() < 0.5? 'Test 1': 'Test 2',
    random: () => Math.random(),
    rollTreeDice: () => [1,2,3].map(_ => 1 + Math.floor(Math.random() * 6))
};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
    rootValue: root
}));

module.exports = app;
