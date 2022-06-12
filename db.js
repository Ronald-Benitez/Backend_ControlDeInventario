const Sequelize = require("sequelize");
require("dotenv").config();

//Models
const productModel = require("./models/product");
const userModel = require("./models/user");

//Database setup
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: "mysql"
});

const Product = productModel(sequelize, Sequelize);
const User = userModel(sequelize, Sequelize);

sequelize.sync({force:false}).then(()=>{
    console.log("Database and tables created!");
}).catch(err=>{});


module.exports = {
    Product,
    User
}