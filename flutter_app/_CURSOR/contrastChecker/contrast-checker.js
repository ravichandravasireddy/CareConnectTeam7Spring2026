// WCAG Contrast Ratio Calculator
// Based on WCAG 2.1 guidelines

// Convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Calculate relative luminance
function getLuminance(rgb) {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
        val = val / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Calculate contrast ratio
function getContrastRatio(color1, color2) {
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
}

// Format ratio to 2 decimal places
function formatRatio(ratio) {
    return ratio.toFixed(2);
}

// Check if ratio passes WCAG level
function passesAA(ratio, isLargeText) {
    return isLargeText ? ratio >= 3.0 : ratio >= 4.5;
}

function passesAAA(ratio, isLargeText) {
    return isLargeText ? ratio >= 4.5 : ratio >= 7.0;
}

// Main contrast checking function
function checkContrast() {
    const fgHex = document.getElementById('fgHex').value.trim();
    const bgHex = document.getElementById('bgHex').value.trim();
    
    // Validate hex colors
    const hexRegex = /^#([A-Fa-f0-9]{6})$/;
    if (!hexRegex.test(fgHex) || !hexRegex.test(bgHex)) {
        alert('Please enter valid hex colors in format #RRGGBB');
        return;
    }
    
    const fgRgb = hexToRgb(fgHex);
    const bgRgb = hexToRgb(bgHex);
    
    if (!fgRgb || !bgRgb) {
        alert('Invalid color values');
        return;
    }
    
    const ratio = getContrastRatio(fgRgb, bgRgb);
    const formattedRatio = formatRatio(ratio);
    
    // Update preview
    document.getElementById('previewBox').style.backgroundColor = bgHex;
    document.getElementById('previewText').style.color = fgHex;
    
    // Update results
    document.getElementById('ratio').textContent = `Contrast Ratio: ${formattedRatio}:1`;
    
    const aaNormal = passesAA(ratio, false);
    const aaLarge = passesAA(ratio, true);
    const aaaNormal = passesAAA(ratio, false);
    const aaaLarge = passesAAA(ratio, true);
    
    document.getElementById('aa-normal').innerHTML = 
        `WCAG AA Normal Text (4.5:1): <span class="${aaNormal ? 'pass' : 'fail'}">${aaNormal ? '✓ PASS' : '✗ FAIL'}</span>`;
    document.getElementById('aa-large').innerHTML = 
        `WCAG AA Large Text (3:1): <span class="${aaLarge ? 'pass' : 'fail'}">${aaLarge ? '✓ PASS' : '✗ FAIL'}</span>`;
    document.getElementById('aaa-normal').innerHTML = 
        `WCAG AAA Normal Text (7:1): <span class="${aaaNormal ? 'pass' : 'fail'}">${aaaNormal ? '✓ PASS' : '✗ FAIL'}</span>`;
    document.getElementById('aaa-large').innerHTML = 
        `WCAG AAA Large Text (4.5:1): <span class="${aaaLarge ? 'pass' : 'fail'}">${aaaLarge ? '✓ PASS' : '✗ FAIL'}</span>`;
    
    document.getElementById('result').style.display = 'block';
}

// Sync color picker with text input
document.getElementById('fgColor').addEventListener('input', function(e) {
    document.getElementById('fgHex').value = e.target.value.toUpperCase();
});

document.getElementById('bgColor').addEventListener('input', function(e) {
    document.getElementById('bgHex').value = e.target.value.toUpperCase();
});

// Sync text input with color picker
document.getElementById('fgHex').addEventListener('input', function(e) {
    const hex = e.target.value.trim();
    if (/^#([A-Fa-f0-9]{6})$/.test(hex)) {
        document.getElementById('fgColor').value = hex;
    }
});

document.getElementById('bgHex').addEventListener('input', function(e) {
    const hex = e.target.value.trim();
    if (/^#([A-Fa-f0-9]{6})$/.test(hex)) {
        document.getElementById('bgColor').value = hex;
    }
});

// Allow Enter key to trigger check
document.getElementById('fgHex').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkContrast();
});

document.getElementById('bgHex').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkContrast();
});
