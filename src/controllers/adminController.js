const User = require("../models/User");
const Contribution = require("../models/Contribution");
const Comment = require("../models/Comment");
const Role = require("../models/Role");
const Faculty = require("../models/Faculty");

const { jsonToObject, multipleJsonToObject } = require("../utils/jsonToObject");

class AdminController {
  async index(req, res, next) {
    try{
        Promise.all([
            Contribution.find({})
        ])
        .then(([contributions]) => {
            return res.render('admin',{
                title: 'Management',
                noHeader: true,
                contributions: multipleJsonToObject(contributions),
                
            })
        })
    }
    catch (err){
        console.error(err);
        req.flash('error', 'Internal server error');
        return res.redirect('back');
    }
  }
}

module.exports = new AdminController();
