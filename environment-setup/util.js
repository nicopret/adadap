String.prototype.camelcase = function() {
    var a = this.split(' ');
    b = a.map(string => {
        var c = string.split('');
        var d = c.splice(0, 1)[0].toUpperCase();
        return d + c.join('');
    });
    return b.join('');
  }