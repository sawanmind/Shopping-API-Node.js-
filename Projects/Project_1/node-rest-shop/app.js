
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');


const productsRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect('mongodb://node-rest-shop:' + process.env.MONGO_ATLAS_PW + '@node-rest-shop-shard-00-00-2rlai.mongodb.net:27017,node-rest-shop-shard-00-01-2rlai.mongodb.net:27017,node-rest-shop-shard-00-02-2rlai.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin'
,{
    useMongoClient: true  
}
);

app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());

app.use((res,req, next) =>{
res.header('Access-Control-Allow-Origin', '*');
res.header('Allow-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
if (req.method === 'OPTIONS') {
    req.header('Access-Control-Allow-Methods', 'PUT, POST, PATCh, DELETE GET')
    return res.status(200).json({});
}
next();
});

app.use('/products', productsRoutes)
app.use('/orders', orderRoutes)

app.use((req,res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});


app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message: error.message
        }
    });
});

module.exports = app;