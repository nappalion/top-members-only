function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.status(400).render("index", {
      title: "Sign up",
      errors: [
        { msg: "Please create an account or log in to view this information." },
      ],
    });
  }
}

function isAuthRedirectToHome(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/messages");
  } else {
    next();
  }
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.admin_status) {
    next();
  } else {
    res.status(401).json({
      msg: "You are not authorized to view this resource because you are not an admin.",
    });
  }
}

function isMember(req, res, next) {
  if (req.isAuthenticated() && req.user.membership_status) {
    next();
  } else {
    res.status(401).json({
      msg: "You are not authorized to view this resource because you are not a member.",
    });
  }
}

module.exports = { isAdmin, isMember, isAuth, isAuthRedirectToHome };
