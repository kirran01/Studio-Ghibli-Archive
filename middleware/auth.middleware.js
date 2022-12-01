const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
      res.redirect("/login");
      return;
    }
    next();
  };
  
  const isNotLoggedIn = (req, res, next) => {
    if (req.session.user) {
      res.redirect("/");
      return;
    }
    next();
  };

  const notInWatchList=(req,res,next)=>{

  }


module.exports = {isLoggedIn, isNotLoggedIn};