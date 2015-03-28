/**
 * Created by mjwunderlich on 3/27/15.
 */

var globals = {
  rWhich: 'r',
  gWhich: 'g',
  bWhich: 'b',
  rCoeff: 0.7,
  gCoeff: 0.7,
  bCoeff: 0.7,
  siblingAttenuate1: 1.0,
  siblingAttenuate2: 0.0
};

(function(globals) {

  /**
   * Construct a new instance of Cell
   * @constructor
   */
  window.Cell = function(x, y) {
    this.position = { x: x, y: y };
    this.color = { r: 0, g: 0, b: 0, z:0 };
    this.velocity = { x: 0, y: 0, z: 0 };
    this.siblings = { up: null, down: null, left: null, right: null };
    this.state = 0;
    this.next = null;

    this.w = this.h = 0;

    this.randomColor();
  };

  // Static
  Cell.staticTimeElapsed = 0;

  Cell.prototype = {
    getColor: function() {
      return 'rgb(' + ~~(this.color[globals.rWhich]* globals.rCoeff) + ',' + ~~(this.color[globals.gWhich]* globals.gCoeff) + ',' + ~~(this.color[globals.bWhich]* globals.bCoeff) + ')';
    },
    setWH: function(w, h) {
      this.w = w;
      this.h = h;
    },
    randomColor: function() {
      this.color.r = randomColor();
      this.color.g = randomColor();
      this.color.b = randomColor();
    },
    setSiblings: function(up, down, left, right, ul, ur, ll, lr) {
      this.siblings.up = up;
      this.siblings.down = down;
      this.siblings.left = left;
      this.siblings.right = right;
      this.siblings.ul = ul;
      this.siblings.ur = ur;
      this.siblings.ll = ll;
      this.siblings.lr = lr;
    },
    step: function(elapsed) {
      r = this.color.r;
      g = this.color.g;
      b = this.color.b;
      vx = vy = vz = 0;
      vr = vg = vb = 0;
      mr = mg = mb = 0;
      count = 0;

      for (key in this.siblings) {
        cell = this.siblings[key];
        if (!cell) continue;

        vx += cell.velocity.x;
        vy += cell.velocity.y;
        vz += cell.velocity.z;
        vr += cell.color.r;
        vg += cell.color.g;
        vb += cell.color.b;

        dr = r - cell.color.r;
        dg = g - cell.color.g;
        db = b - cell.color.b;

        if (dr*dr + dg*dg + db*db < minDistSquare) {
          mr += dr;
          mg += dg;
          mb += db;
        }

        if (sampleOuterSiblings && globals.siblingAttenuate2) {
          var p = cell;
          for (var k in p.siblings) {
            cell = p.siblings[k];
            if (!cell) continue;

            vx += cell.velocity.x * globals.siblingAttenuate2;
            vy += cell.velocity.y * globals.siblingAttenuate2;
            vz += cell.velocity.z * globals.siblingAttenuate2;
            vr += cell.color.r * globals.siblingAttenuate2;
            vg += cell.color.g * globals.siblingAttenuate2;
            vb += cell.color.b * globals.siblingAttenuate2;

            dr = r - cell.color.r;
            dg = g - cell.color.g;
            db = b - cell.color.b;

            if (dr * dr + dg * dg + db * db < minDistSquare * globals.siblingAttenuate2) {
              mr += dr;
              mg += dg;
              mb += db;
            }

            count += globals.siblingAttenuate2;
          }
        }

        count ++;
      }

      count = 1.0 / count;
      vx *= count; vr *= count;
      vy *= count; vg *= count;
      vz *= count; vb *= count;

      if ((mr != 0) || (mg != 0) || (mb != 0)) {
        mRecip = mMagnitude / Math.sqrt(mr*mr + mg*mg + mb*mb);
        mr *= mRecip;
        mg *= mRecip;
        mb *= mRecip;
      }

      blendCoeff = 0.15 * Math.cos( date.getSeconds() );
      this.velocity.x += blendCoeff * (mr + vx + vr - (r + this.velocity.x));
      this.velocity.y += blendCoeff * (mg + vy + vg - (g + this.velocity.y));
      this.velocity.z += blendCoeff * (mb + vz + vb - (b + this.velocity.z));

      r += this.velocity.x;
      g += this.velocity.y;
      b += this.velocity.z;

      var xxx = -Math.random();
      if (r < 0 || r > 255) {
        r = Math.min(Math.max(r, 0), 255);
        this.velocity.x *= xxx;
      }
      if (g < 0 || g > 255) {
        g = Math.min(Math.max(g, 0), 255);
        this.velocity.y *= xxx;
      }
      if (b < 0 || b > 255) {
        b = Math.min(Math.max(b, 0), 255);
        this.velocity.z *= xxx;
      }

      this.color.r = r;
      this.color.g = g;
      this.color.b = b;
    },

    render: function(ctx) {
      var x = this.position.x, y = this.position.y;
      ctx.moveTo(x * this.w, y * this.h);
      ctx.fillStyle = this.getColor();
      ctx.fillRect(x * this.w, y * this.h, this.w, this.h);
    }
  };

  function interpolateColorComponent(comp1, comp2) {
    var rand = Math.random();
    return Math.floor(comp1 + (comp2-comp1)*rand);
  }

  function randomColor() {
    return Math.random() * 255;
  }

  var
    key,  // iterate over sibling cells
    cell, // sibling cell
    r, g, b, // convenience vars for computation
    vx, vy, vz, // averaged velocities
    vr, vg, vb, // averaged sibling colors
    dr, dg, db, // delta changes from center cell's to sibling's rgb
    mr, mg, mb, // magnitude of rgb (computed from delta rgb)
    mRecip,
    mMagnitude = 4,
    blendCoeff = 0.56,
    minDist = 8,
    minDistSquare = minDist * minDist,
    count,
    sampleOuterSiblings = true,
    date = new Date(),
    baseDate = date.getTime();
})(globals);
