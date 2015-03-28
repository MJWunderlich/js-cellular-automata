/**
 * Created by mjwunderlich on 3/27/15.
 */

(function() {

  window.Field = function(width, height) {
    this.width = width;
    this.height = height;
    this.rows = [];
    this.first = null;

    this._makeField();
  };

  Field.prototype._makeCell = function(x, y) {
    return new Cell(x, y);
  };

  Field.prototype._makeRow = function(y) {
    var
      x, row = [],
      cell,
      w = getCanvasWidth() / this.width,
      h = getCanvasHeight() / this.height;

    for (x=0; x<this.width; ++x) {
      cell = this._makeCell(x, y);
      cell.setWH(w, h);
      row.push( cell );
    }

    return row;
  };

  Field.prototype._makeField = function() {
    var y;
    for (y=0; y<this.height; ++y) {
      this.rows.push( this._makeRow(y) );
    }
  };

  Field.prototype.setup = function() {
    var up, left, down, right, cell, ul = null, ur = null, ll = null, lr = null, prevCell = null;
    var miny, maxy;
    var minx, maxx;
    for (y=0; y<this.height; ++y) {
      for (x=0; x<this.width; ++x) {
        miny = y>0 ? y-1 : this.height-1;
        maxy = y<this.height-1 ? y+1 : 0;
        minx = x>0 ? x-1 : this.width-1;
        maxx = x<this.width-1 ? x+1 : 0;

        up    = this.rows[miny][x];
        left  = this.rows[y][minx];
        down  = this.rows[maxy][x];
        right = this.rows[y][maxx];
        ul    = this.rows[miny][maxx];
        ur    = this.rows[miny][minx];
        ll    = this.rows[maxy][maxx];
        lr    = this.rows[maxy][minx];

        cell = this.rows[y][x]
        cell.velocity = {x:0, y:0, z:0};
        cell.setSiblings(up, down, left, right, ul, ur, ll, lr);
        cell.randomColor();

        if (prevCell) {
          prevCell.next = cell;
        }
        else {
          this.first = cell;
        }

        prevCell = cell;
      }
    }
  };

  Field.prototype.display = function(elapsed) {
    var
      ctx = getCanvasCtx(),
      cell = this.first;
    while (cell) {
      cell.step(elapsed);
      cell.render(ctx);
      cell = cell.next;
    }

    Cell.staticTimeElapsed += elapsed;
  };

  var _canvas = $('#field')[0];
  var _jq = $('#field');

  function getCanvasWidth() {
    return _jq.width();
  }

  function getCanvasHeight() {
    return _jq.height();
  }

  function getCanvasCtx() {
    return _canvas.getContext('2d');
  }
})();
