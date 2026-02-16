// WCAG Contrast Ratio Calculator (React Native app – same logic as Flutter checker)
// Based on WCAG 2.1 guidelines

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function getLuminance(rgb) {
  var r = rgb.r / 255;
  var g = rgb.g / 255;
  var b = rgb.b / 255;
  r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(color1, color2) {
  var lum1 = getLuminance(color1);
  var lum2 = getLuminance(color2);
  var lighter = Math.max(lum1, lum2);
  var darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

function formatRatio(ratio) {
  return ratio.toFixed(2);
}

function passesAA(ratio, isLargeText) {
  return isLargeText ? ratio >= 3.0 : ratio >= 4.5;
}

function passesAAA(ratio, isLargeText) {
  return isLargeText ? ratio >= 4.5 : ratio >= 7.0;
}

function checkContrast() {
  var fgHex = document.getElementById("fgHex").value.trim();
  var bgHex = document.getElementById("bgHex").value.trim();
  var hexRegex = /^#([A-Fa-f0-9]{6})$/;
  if (!hexRegex.test(fgHex) || !hexRegex.test(bgHex)) {
    alert("Please enter valid hex colors in format #RRGGBB");
    return;
  }
  var fgRgb = hexToRgb(fgHex);
  var bgRgb = hexToRgb(bgHex);
  if (!fgRgb || !bgRgb) {
    alert("Invalid color values");
    return;
  }
  var ratio = getContrastRatio(fgRgb, bgRgb);
  var formattedRatio = formatRatio(ratio);
  document.getElementById("previewBox").style.backgroundColor = bgHex;
  document.getElementById("previewText").style.color = fgHex;
  document.getElementById("ratio").textContent =
    "Contrast Ratio: " + formattedRatio + ":1";
  var aaNormal = passesAA(ratio, false);
  var aaLarge = passesAA(ratio, true);
  var aaaNormal = passesAAA(ratio, false);
  var aaaLarge = passesAAA(ratio, true);
  document.getElementById("aa-normal").innerHTML =
    'WCAG AA Normal Text (4.5:1): <span class="' +
    (aaNormal ? "pass" : "fail") +
    '">' +
    (aaNormal ? "✓ PASS" : "✗ FAIL") +
    "</span>";
  document.getElementById("aa-large").innerHTML =
    'WCAG AA Large Text (3:1): <span class="' +
    (aaLarge ? "pass" : "fail") +
    '">' +
    (aaLarge ? "✓ PASS" : "✗ FAIL") +
    "</span>";
  document.getElementById("aaa-normal").innerHTML =
    'WCAG AAA Normal Text (7:1): <span class="' +
    (aaaNormal ? "pass" : "fail") +
    '">' +
    (aaaNormal ? "✓ PASS" : "✗ FAIL") +
    "</span>";
  document.getElementById("aaa-large").innerHTML =
    'WCAG AAA Large Text (4.5:1): <span class="' +
    (aaaLarge ? "pass" : "fail") +
    '">' +
    (aaaLarge ? "✓ PASS" : "✗ FAIL") +
    "</span>";
  document.getElementById("result").style.display = "block";
}

if (typeof document !== "undefined") {
  document.getElementById("fgColor").addEventListener("input", function (e) {
    document.getElementById("fgHex").value = e.target.value.toUpperCase();
  });
  document.getElementById("bgColor").addEventListener("input", function (e) {
    document.getElementById("bgHex").value = e.target.value.toUpperCase();
  });
  document.getElementById("fgHex").addEventListener("input", function (e) {
    var hex = e.target.value.trim();
    if (/^#([A-Fa-f0-9]{6})$/.test(hex)) {
      document.getElementById("fgColor").value = hex;
    }
  });
  document.getElementById("bgHex").addEventListener("input", function (e) {
    var hex = e.target.value.trim();
    if (/^#([A-Fa-f0-9]{6})$/.test(hex)) {
      document.getElementById("bgColor").value = hex;
    }
  });
  document.getElementById("fgHex").addEventListener("keypress", function (e) {
    if (e.key === "Enter") checkContrast();
  });
  document.getElementById("bgHex").addEventListener("keypress", function (e) {
    if (e.key === "Enter") checkContrast();
  });
}
