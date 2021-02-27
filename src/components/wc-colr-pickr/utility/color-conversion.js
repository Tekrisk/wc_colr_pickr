export function RGBAToHexA(r, g, b, a) {
  let _r = r.toString(16);
  let _g = g.toString(16);
  let _b = b.toString(16);
  let _a = Math.round(a * 255).toString(16);

  if (_r.length === 1) _r = '0' + _r;
  if (_g.length === 1) _g = '0' + _g;
  if (_b.length === 1) _b = '0' + _b;
  if (_a.length === 1) _a = '0' + _a;

  if (_a === 'ff') {
    return '#' + _r + _g + _b;
  }

  return '#' + _r + _g + _b + _a;
}

export function HSLAToRGBA(h, s, l, a, toHex) {
  let _s = s / 100;
  let _l = l / 100;

  let c = (1 - Math.abs(2 * _l - 1)) * _s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = _l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  if (toHex === true) {
    return RGBAToHexA(r, g, b, a);
  }

  return {
    r: r,
    g: g,
    b: b,
    a: a,
  };
}

export function RGBAToHSLA(r, g, b, a) {
  let _r = r / 255;
  let _g = g / 255;
  let _b = b / 255;
  let _a = a === undefined ? 1 : a;

  let cmin = Math.min(_r, _g, _b),
    cmax = Math.max(_r, _g, _b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta === 0) {
    h = 0;
  } else if (cmax === _r) {
    h = ((_g - _b) / delta) % 6;
  } else if (cmax === _g) {
    h = (_b - _r) / delta + 2;
  } else {
    h = (_r - _g) / delta + 4;
  }

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;

  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return {
    h: h,
    s: s,
    l: l,
    a: _a,
  };
}

export function hexAToRGBA(h, toHSL) {
  let _h = h;

  if (_h.length === 7) {
    _h += 'ff';
  } else if (_h.length === 4) {
    _h += _h.substring(1, 4) + 'ff';
  }

  let r = 0,
    g = 0,
    b = 0,
    a = 1;

  if (_h.length === 5) {
    r = '0x' + _h[1] + _h[1];
    g = '0x' + _h[2] + _h[2];
    b = '0x' + _h[3] + _h[3];
    a = '0x' + _h[4] + _h[4];
  } else if (_h.length === 9) {
    r = '0x' + _h[1] + _h[2];
    g = '0x' + _h[3] + _h[4];
    b = '0x' + _h[5] + _h[6];
    a = '0x' + _h[7] + _h[8];
  }

  a = +(a / 255).toFixed(3);

  if (toHSL) {
    return RGBAToHSLA(+r, +g, +b, a);
  }

  return 'rgba(' + +r + ',' + +g + ',' + +b + ',' + a + ')';
}
