const router = require("express").Router();
const { Product } = require("../../db");
const { check, validationResult } = require("express-validator");

//Get all products
router.get("/", async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

//Create product
router.post(
  "/",
  [
    check("name").isLength({ min: 1 }).withMessage("Nombre es requerido"),
    check("type")
      .isLength({ min: 1 })
      .withMessage("Tipo es requerido")
      .isIn(["grano", "insumo"])
      .withMessage("Tipo debe ser grano o insumo"),
    check("price").isLength({ min: 1 }).withMessage("Precio es requerido"),
    check("stock").isLength({ min: 1 }).withMessage("Stock es requerido"),
    check("min").isLength({ min: 1 }).withMessage("Minimo es requerido"),
    check("max").isLength({ min: 1 }).withMessage("Maximo es requerido"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const product = await Product.create(req.body);
      res.json(product);
    } else {
      res.json({ errors: errors.array() });
    }
  }
);

router.put(
  "/:id",
  [
    check("name").isLength({ min: 1 }).withMessage("Nombre es requerido"),
    check("type")
      .isLength({ min: 1 })
      .withMessage("Tipo es requerido")
      .isIn(["grano", "insumo"])
      .withMessage("Tipo debe ser grano o insumo"),
    check("price").isLength({ min: 1 }).withMessage("Precio es requerido"),
    check("stock").isLength({ min: 1 }).withMessage("Stock es requerido"),
    check("min").isLength({ min: 1 }).withMessage("Minimo es requerido"),
    check("max").isLength({ min: 1 }).withMessage("Maximo es requerido"),
  ],
  async (req, res) => {
    if (verifyType(req.type)) {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        const product = await Product.findByPk(req.params.id);
        await product.update(req.body);
        res.json(product);
      } else {
        res.json({ errors: errors.array() });
      }
    } else {
      res.json({ errors: "No tienes permiso para actualizar" });
    }
  }
);

router.delete("/:id", async (req, res) => {
  if (verifyType(req.type)) {
    const product = await Product.findByPk(req.params.id);
    await product.destroy();
    res.json({ message: "Product deleted" });
  } else {
    res.json({ message: "No tienes permiso para eliminar" });
  }
});

//Get by id
router.get("/id/:id", async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  res.json(product);
});

//Get by name
router.get("/name/:name", async (req, res) => {
  const product = await Product.findOne({
    where: { name: req.params.name },
  });
  res.json(product);
});

//Get by type
router.get("/type/:type", async (req, res) => {
  const product = await Product.findAll({
    where: { type: req.params.type },
  });
  res.json(product);
});

//Get by state min
router.get("/min", async (req, res) => {
  const product = await Product.sequelize.query(
    "SELECT * FROM products WHERE stock <= min",
    { type: Product.sequelize.QueryTypes.SELECT }
  );
  res.json(product);
});

//Get by state max
router.get("/max", async (req, res) => {
  const product = await Product.sequelize.query(
    "SELECT * FROM products WHERE stock >= max",
    { type: Product.sequelize.QueryTypes.SELECT }
  );
  res.json(product);
});

//Increase stock
router.put("/increase/:id&:value", async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  product.stock = parseInt(product.stock) + parseInt(req.params.value);
  await product.sequelize.query(
    `UPDATE products SET stock = ${product.stock}  WHERE id = ${product.id}`
  );
  res.json(product);
});

//Decrease stock
router.put("/decrease/:id&:value", async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  product.stock = parseInt(product.stock) - parseInt(req.params.value);
  await product.sequelize.query(
    `UPDATE products SET stock = ${product.stock}  WHERE id = ${product.id}`
  );
  res.json(product);
});

const verifyType = (type) => {
  if (type != "admin") {
    return false;
  }
  return true;
};

module.exports = router;
