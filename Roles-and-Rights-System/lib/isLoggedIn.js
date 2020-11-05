module.exports = function (req, res, next) {
    var url = "/" + req.route.path.split('/')[1];

    if (req.session.menuItems == undefined) {
        return res.redirect('/');
    }
    if(req.session.sessionAllowedUrls.indexOf(url) !== -1){
        return next();
    }else{
        return res.redirect('/');
    }
};


