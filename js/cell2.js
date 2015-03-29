/**
 * Created by mjwunderlich on 3/29/15.
 */

(function(globals) {

  window.Cell2 = function(x, y) {
    Cell.call(this, x, y);

    this.colorBuffer = {r:0, g:0, b:0};
  };

  Cell2.prototype = Cell.prototype;

  Cell2.prototype._accumulateSiblings = function(attenuation, depth) {
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
  };

  Cell2.prototype.step = function() {
    r = this.color.r;
    g = this.color.g;
    b = this.color.b;
    vx = vy = vz = 0;
    vr = vg = vb = 0;
    mr = mg = mb = 0;
    count = 0;

    this._accumulateSiblings(1.0, globals.samplingDepth);

    count2 = 1.0 / count;
    vx *= count2;
    vy *= count2;
    vz *= count2;

    //count2 = 1.0 / count;
    //vr *= count2;
    //vg *= count2;
    //vb *= count2;

    mRecip = 255 / Math.sqrt(vr*vr + vg*vg + vb*vb);
    vr *= mRecip;
    vg *= mRecip;
    vb *= mRecip;

    if ((mr != 0) || (mg != 0) || (mb != 0)) {
      mRecip = mMagnitude / Math.sqrt(mr*mr + mg*mg + mb*mb);
      mr *= mRecip;
      mg *= mRecip;
      mb *= mRecip;
    }

    // Simulate some individuality
    blendCoeff = 0.67 * Math.cos( date.getSeconds() );
    this.velocity.x += blendCoeff * (mr + vr + vx - (r + this.velocity.x));
    this.velocity.y += blendCoeff * (mg + vg + vy - (g + this.velocity.y));
    this.velocity.z += blendCoeff * (mb + vb + vz - (b + this.velocity.z));

    r += this.velocity.x;
    g += this.velocity.y;
    b += this.velocity.z;

    var xxx = -1;
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
  };

  Cell2.prototype.render = function(ctx) {
    this.color.r = this.colorBuffer.r;
    this.color.g = this.colorBuffer.g;
    this.color.b = this.colorBuffer.b;
    var x = this.position.x, y = this.position.y;
    ctx.moveTo(x * this.w, y * this.h);
    ctx.fillStyle = this.getColor();
    ctx.fillRect(x * this.w, y * this.h, this.w, this.h);
  };


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
    count2,
    sampleOuterSiblings = true,
    date = new Date(),
    baseDate = date.getTime();

})(globals);
