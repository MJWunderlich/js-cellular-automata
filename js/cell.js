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
  siblingAttenuate2: 0.0,
  samplingDepth: 0.0
};

(function(globals) {

  /**
   * Construct a new instance of Cell
   * @constructor
   */
  window.Cell = function(x, y) {
    this.position = { x: x, y: y };
    this.color = { r: 0, g: 0, b: 0, z:0 };
    this.colorBuffer = { r:0, g:0, b:0 };
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
    _accumulateSiblings: function(attenuation, depth) {
      attenuation = attenuation || 1.0;
      for (key in this.siblings) {
        cell = this.siblings[key];
        if (!cell) continue;

        // 1. Separation (avoid flockmates)
        // Don't match color exactly

        // Alignment (steer to average heading)
        // 2. Match color tone

        // Cohesion (steer to average position)
        // 3. Maintain color grouping

        // Match the speed of flockmates
        vx += cell.velocity.x * attenuation;
        vy += cell.velocity.y * attenuation;
        vz += cell.velocity.z * attenuation;

        // Match the heading (color) of flockmates
        vr += cell.color.r * attenuation;
        vg += cell.color.g * attenuation;
        vb += cell.color.b * attenuation;

        dr = r - cell.color.r;
        dg = g - cell.color.g;
        db = b - cell.color.b;

        if (dr * dr + dg * dg + db * db < minDistSquare) {
          mr += dr;
          mg += dg;
          mb += db;
        }

        if (depth > 0) {
          cell._accumulateSiblings(attenuation * 0.66667, depth - 1);
        }

        count += attenuation;
      }
    },
    step: function(elapsed) {
      r = this.color.r;
      g = this.color.g;
      b = this.color.b;
      vx = vy = vz = 0;
      vr = vg = vb = 0;
      mr = mg = mb = 0;
      count = 0;

      this._accumulateSiblings(1.0, globals.samplingDepth);

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

      this.colorBuffer.r = r;
      this.colorBuffer.g = g;
      this.colorBuffer.b = b;
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
