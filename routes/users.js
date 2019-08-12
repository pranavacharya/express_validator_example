var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const { matchedData } = require('express-validator');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

function middleware(req, res, next) {
  res.jsonp(req.body);
}

var chain = [
  body('username').exists().withMessage("please provide username").isEmail().withMessage('Please enter email id as username'),
  body('password').isLength({ min: 5 }).withMessage('password should be of 6 characters')
]

function validate(req, res, next) {
  req.body = matchedData(req, { locations: ['body'] });
  const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // return `${location}[${param}]: ${msg}`;
    return msg;
  };
  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    return res.json({ status: false, message: result.array().join() });
  }
  next();
}

router.post('/', chain, validate, middleware);

module.exports = router;
