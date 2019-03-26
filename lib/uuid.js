
function v4 () {
  var r = function () { return (Math.random()*16|0).toString(16) },
  y = function () { return (8+Math.random()*4|0).toString(16) },
  r4 = function () { return r()+''+r()+''+r()+''+r() },
  r3 = function () { return r()+''+r()+''+r() };
  return (r4()+''+r4()+'-'+r4()+'-4'+r3()+'-'+y()+r3()+'-'+r4()+''+r4()+''+r4()).toLowerCase();
}

module.exports = v4;