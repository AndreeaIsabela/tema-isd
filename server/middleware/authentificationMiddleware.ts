import {config} from '../config/config';
const jwt = require('jsonwebtoken');

const authentication:any = function (req, res, next) {
  try {
    const authorization:any = req.get('authorization');
    const token:any = authorization.split('Bearer ')[1];

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.authentification.jwtSecret, function (err, decoded) {
      if (err) {
        console.log(err);
        return res.status(403)
          .send({ auth: false, message: 'Failed to authenticate tokeeen.' });
      }
      next();
    });
  }
  catch (err) {
    return res.status(403).send({ auth: false, message: 'Failed to authenticate tokeen.' });
  }
};

module.exports = { authentication };
