const router = require('express').Router();
const {Product} = require('../../db');


router.get("/",async (req,res)=>{
    const products = await Product.findAll();
    res.json(products);
});

router.post("/",async (req,res)=>{
    const product = await Product.create(req.body);
    res.json(product);
});

router.put("/:id",async (req,res)=>{
    const product = await Product.findByPk(req.params.id);
    await product.update(req.body);
    res.json(product);
});

router.delete("/:id",async (req,res)=>{
    const product = await Product.findByPk(req.params.id);
    await product.destroy();
    res.json({message:"Product deleted"});
});

//Get by id
router.get("/id/:id",async (req,res)=>{
    const product = await Product.findByPk(req.params.id);
    res.json(product);
});

//Get by name
router.get("/name/:name",async (req,res)=>{
    const product = await Product.findOne({
        where:{name:req.params.name}
    });
    res.json(product);
});

//Get by type
router.get("/type/:type",async (req,res)=>{
    const product = await Product.findAll({
        where:{type:req.params.type}
    });
    res.json(product);
});

//Get by state min
router.get("/min",async (req,res)=>{
    const product= await Product.sequelize.query("SELECT * FROM products WHERE stock <= min",
    {type:Product.sequelize.QueryTypes.SELECT});
    res.json(product);
});

//Get by state max
router.get("/max",async (req,res)=>{
    const product = await Product.sequelize.query("SELECT * FROM products WHERE stock >= max",
    {type:Product.sequelize.QueryTypes.SELECT});
    res.json(product);
});

//Increase stock
router.put("/increase/:id&:value",async (req,res)=>{
    const product = await Product.findByPk(req.params.id);
    product.stock = parseInt(product.stock)+parseInt(req.params.value);
    await product.sequelize.query(`UPDATE products SET stock = ${product.stock}  WHERE id = ${product.id}`);
    res.json(product);

});

//Decrease stock
router.put("/decrease/:id&:value",async (req,res)=>{
    const product = await Product.findByPk(req.params.id);
    product.stock = parseInt(product.stock)-parseInt(req.params.value);
    await product.sequelize.query(`UPDATE products SET stock = ${product.stock}  WHERE id = ${product.id}`);
    res.json(product);

});

module.exports = router;