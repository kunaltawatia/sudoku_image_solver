var express = require('express');
var multer = require('multer');
var exec = require('child_process').exec;
var path = require('path');

var upload = multer({ dest: 'uploads/', preservePath: true });
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Sudoku Solver' });
});


router.get('/demo', function (req, res) {
  res.render('sudoku', {
    title: 'Solved', sudoku: [[5, 8, 3, 6, 9, 4, 7, 2, 1], [7, 1, 6, 8, 3, 2, 5, 4, 9], [2, 9, 4, 1, 7, 5, 3, 8, 6], [6, 7, 1, 5, 2, 8, 4, 9, 3], [8, 2, 9, 7, 4, 3, 1, 6, 5], [4, 3, 5, 9, 1, 6, 8, 7, 2], [1, 5, 8, 2, 6, 7, 9, 3, 4], [3, 6, 7, 4, 5, 9, 2, 1, 8], [9, 4, 2, 3, 8, 1, 6, 5, 7]],
    imagesrc: '1e5c61e0240ff7dd3eedffd69de46547'
  });
});


router.post('/api', upload.single('image'), (req, res) => {
  var command = `python sudoku.py ${path.join(__dirname, '../', req.file.path)}`
  console.log(command);
  exec(command, { cwd: path.join(__dirname, '../../') }, (err, stdout) => {
    var obj;
    try {
      obj = JSON.parse(stdout);
      if (err || failcheck(obj)) res.json({ error: true })
      // else res.json({ solution: obj })
      else res.render('sudoku', { title: 'Solved', sudoku: obj, imagesrc: req.file.filename })
    }
    catch (e) {
      res.json({ error: true, message: 'CAUGHT EXECPTION' })
    }
  })
});

function failcheck(obj) {
  if (obj.length !== 9) return 1;
  for (l in obj) if (obj[l].length !== 9) return 1;
  return 0;
}

module.exports = router;
