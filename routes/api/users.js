const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { User } = require("../../db");
const { check, validationResult } = require("express-validator");
const moment = require("moment");
const jwt = require("jwt-simple");
require("dotenv").config();

//Create user
router.post(
  "/register",
  [
    check("name").isLength({ min: 1 }).withMessage("Nombre es requerido"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Contraseña es requerida min 6 caracteres"),
    check("type")
      .isLength({ min: 1 })
      .withMessage("Tipo de usuario es requerido")
      .isIn(["admin", "user"])
      .withMessage("Tipo de usuario debe ser admin o user"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      const user = await User.create(req.body);
      res.json(user);
    } else {
      res.json({ errors: errors.array() });
    }
  }
);

//Get all users
router.get("/", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

//Get user by id
router.get("/id/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.json(user);
});

//Get user by name
router.get("/name/:name", async (req, res) => {
  const user = await User.findOne({
    where: { name: req.params.name },
  });
  res.json(user);
});

//Update user
router.put(
  "/:id",
  [
    check("name").isLength({ min: 1 }).withMessage("Nombre es requerido"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Contraseña es requerida min 6 caracteres"),
    check("type")
      .isLength({ min: 1 })
      .withMessage("Tipo de usuario es requerido")
      .isIn(["admin", "user"])
      .withMessage("Tipo de usuario debe ser admin o user"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      const user = await User.findByPk(req.params.id);
      await user.update(req.body);
      res.json(user);
    } else {
      res.json({ errors: errors.array() });
    }
  }
);

//Delete user
router.delete("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  await user.destroy();
  res.json({ message: "Usuario eliminado" });
});

//Login user
router.post("/login", async (req, res) => {
  const user = await User.findOne({ where: { name: req.body.name } });
  if (user) {
    if (req.body.password) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.json({ success: createToken(user) });
      } else {
        res.json({ message: "Contraseña incorrecta" });
      }
    } else {
      res.json({ message: "Debe ingresar la contraseña" });
    }
  } else {
    res.json({ message: "Usuario no encontrado" });
  }
});

const createToken = (user) => {
  const payload = {
    userId: user.id,
    createdAt: moment().unix(),
    expiredAt: moment().add(30, "minutes").unix(),
    type: user.type,
  };

  return jwt.encode(payload, process.env.JWT_SECRET);
};

module.exports = router;
