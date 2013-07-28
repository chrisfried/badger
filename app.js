
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
  var pushups = req.query.pushups;
  if ('string' !== typeof pushups) pushups = '';
  pushups = pushups.trim();

  function lossRecord (req, res, next, loss) {

    var img = __dirname + '/weight.png';
    
    var resizeX = 600
      , resizeY = 600
    
    var gm = require('gm').subClass({ imageMagick: true });

    var base =
    gm(img)
    .resize(resizeX, resizeY)
    .fill("white")
    .font("Ubuntu-Bold.ttf", 240)
    .drawText(-30,-110, loss, "Center")
    .font("Ubuntu-Regular.ttf", 160)
    .drawText(10,190, "lbs", "Center");
    
    write(base, res, next);
  };
  
  function pushupsRecord(req, res, next, pushups) {

    var img = __dirname + '/pushups.png';
    
    var resizeX = 600
      , resizeY = 600
    
    var gm = require('gm').subClass({ imageMagick: true });

    var base =
    gm(img)
    .resize(resizeX, resizeY)
    .fill("#e6a955")
    .font("Ubuntu-Bold.ttf", 240)
    .drawText(0,-50, pushups, "Center")
    .fill("#676767")
    .font("Ubuntu-Regular.ttf", 60)
    .drawText(0,-220, "New High Score", "Center");
    
    write(base, res, next);}
  
  function write (base, res, next) {
    base.stream('png', function (err, stdout, stderr) {
      if (err) return next(err);
      res.setHeader('Expires', new Date(Date.now() + 604800000));
      res.setHeader('Content-Type', 'image/png');
      stdout.pipe(res);
    });
  }

  if (loss) {
    lossRecord(req, res, next, loss);
  } else if (pushups) {
    pushupsRecord(req, res, next, pushups);
  } else {
    return next();
  }
}
