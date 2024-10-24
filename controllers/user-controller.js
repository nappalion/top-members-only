const db = require("../db/queries");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const { isAuth, isAuthRedirectToHome } = require("../routes/auth-middleware");
const passport = require("passport");

const errors = {
  lengthErr: "must be between 1 and 30 characters.",
  minLengthErr: "must be at least 8 characters long.",
  maxLengthErr: "must be less than 255 characters long.",
  intErr: "must be a valid integer.",
  emailErr: "must be a valid email.",
  emptyErr: "must not be empty.",
  emailTakenErr: "is already in use.",
};

const validateSignup = [
  body("first_name")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage(`First Name ${errors.lengthErr}`),
  body("last_name")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage(`Last Name ${errors.lengthErr}`),
  body("username")
    .trim()
    .notEmpty()
    .withMessage(`Email ${errors.emptyErr}`)
    .isEmail()
    .withMessage(`Email ${errors.emailErr}`)
    .custom(async (value) => {
      const user = await db.getUserByUsername(value);
      if (user) {
        throw new Error("Email already in use");
      }
    }),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage(`Password ${errors.minLengthErr}`)
    .isLength({ max: 255 })
    .withMessage(`Password ${errors.maxLengthErr}`),
  body("confirm_password")
    .trim()
    .notEmpty()
    .withMessage(`Confirm Password ${errors.emptyErr}`)
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage(`Passwords do not match`),
];
const validateLogin = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage(`Email ${errors.emptyErr}`)
    .isEmail()
    .withMessage(`Email ${errors.emailErr}`),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage(`Password ${errors.minLengthErr}`)
    .isLength({ max: 255 })
    .withMessage(`Password ${errors.maxLengthErr}`),
];

const validateStatusConfirmation = [
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage(`Password ${errors.minLengthErr}`)
    .isLength({ max: 255 })
    .withMessage(`Password ${errors.maxLengthErr}`),
];

const signupGet = [
  isAuthRedirectToHome,
  (req, res) => {
    res.render("index", {
      title: "Sign up",
    });
  },
];

const signupPost = [
  validateSignup,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("index", {
        title: "Sign up",
        errors: errors.array(),
      });
    }

    try {
      const { first_name, last_name, username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.createUser(first_name, last_name, username, hashedPassword);

      next();
    } catch (err) {
      return next(err);
    }
  },
  passport.authenticate("local", {
    successRedirect: "/confirm-member",
    failureRedirect: "/",
  }),
];

const loginGet = [
  isAuthRedirectToHome,
  (req, res) => {
    res.render("login", {
      title: "Log in",
    });
  },
];

function loginFailedGet(req, res) {
  res.render("login", {
    title: "Log in",
    login_failed: true,
  });
}

const loginPost = [
  validateLogin,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("login", {
        title: "Log in",
        errors: errors.array(),
      });
    }

    next();
  },
  passport.authenticate("local", {
    successRedirect: "/messages",
    failureRedirect: "/login-failed",
  }),
];

const confirmMemberGet = [
  isAuth,
  (req, res) => {
    res.render("confirm-member", { title: "Member Confirmation" });
  },
];

const confirmMemberPost = [
  isAuth,
  validateStatusConfirmation,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("confirm-member", {
        title: "Member Confirmation",
        errors: errors.array(),
      });
    }

    try {
      const memberPasswordHash = await db.getMemberSecret();
      const { password } = req.body;

      const isValid = await bcrypt.compare(password, memberPasswordHash);
      if (!isValid) {
        return res.status(400).render("confirm-member", {
          title: "Member Confirmation",
          errors: [{ msg: "Incorrect password." }],
        });
      }

      await db.setMember(req.user.id);
      if (!req.user.admin_status) {
        res.redirect("/confirm-admin");
      } else {
        res.redirect("/messages");
      }
    } catch (err) {
      return next(err);
    }
  },
];

const confirmAdminGet = [
  isAuth,
  (req, res) => {
    res.render("confirm-admin", { title: "Admin Confirmation" });
  },
];

const confirmAdminPost = [
  isAuth,
  validateStatusConfirmation,
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("confirm-admin", {
        title: "Admin Confirmation",
        errors: errors.array(),
      });
    }

    try {
      const adminPasswordHash = await db.getAdminSecret();
      const { password } = req.body;

      const isValid = await bcrypt.compare(password, adminPasswordHash);
      if (!isValid) {
        return res.status(400).render("confirm-admin", {
          title: "Admin Confirmation",
          errors: [{ msg: "Incorrect password." }],
        });
      }

      await db.setAdmin(req.user.id);
      res.redirect("/messages");
    } catch (err) {
      return next(err);
    }
  },
];

function logoutGet(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  res.redirect("/");
}

module.exports = {
  signupGet,
  signupPost,
  loginGet,
  loginFailedGet,
  loginPost,
  confirmMemberGet,
  confirmMemberPost,
  confirmAdminGet,
  confirmAdminPost,
  logoutGet,
};
