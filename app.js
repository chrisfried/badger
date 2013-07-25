
var gm = require('gm')
  , connect = require('connect')
  , port = process.env.PORT || 8900

connect(
    connect.logger()
  , connect.query()
  , handler
  , connect.errorHandler()
).listen(port);
console.error('listening on http://localhost:' + port);

function handler (req, res, next) {
  var loss = req.query.loss;
  if ('string' !== typeof loss) loss = '';
  loss = loss.trim();
  console.log('trying method %s', loss);

  var fn = function (req, res, next, loss) {

    var img = __dirname + '/base.png';
    
    var resizeX = 300
      , resizeY = 300
    
    var gm = require('gm').subClass({ imageMagick: true });

    var base =
    gm(img)
    .resize(resizeX, resizeY)
    .fill("white")
    .font("Ubuntu-Bold.ttf", 120)
    .drawText(-15,-55, loss, "Center")
    .font("Ubuntu-Regular.ttf", 80)
    .drawText(5,95, "lbs", "Center");
    
    write(base, res, next);
  };
  
  function write (base, res, next) {
    base.stream('png', function (err, stdout, stderr) {
      if (err) return next(err);
      res.setHeader('Expires', new Date(Date.now() + 604800000));
      res.setHeader('Content-Type', 'image/png');
      stdout.pipe(res);
    });
  }
  
  console.log('fn?', !!fn);

  if (!fn) return next();

  fn(req, res, next, loss);
}
