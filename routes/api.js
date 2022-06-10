const router = require('express').Router();
const middlewares = require('./middlewares');

const apiProductsRouter = require('./api/products');
const apiUsersRouter = require('./api/users');

router.use("/products",middlewares.checkToken, apiProductsRouter);

router.use("/users", apiUsersRouter);


module.exports = router;