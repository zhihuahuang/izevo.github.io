module.exports = function time2color(time) {
    let date = time instanceof Date ? time : new Date(time.replace(/-/g, '/'));

    let i = date.getFullYear();
    let j = date.getMonth() + 1;
    let m = date.getDate();
    let n = date.getDay() + 1;

    let x = i + j * m * n;
    let y = i * j + m * n;
    let z = i * j * m + n;

    let total = z % 100 + 3 * 128;
    let r = x % 256;
    let g = y % 256;
    let b = total - r - g;

    // 数值超出的补偿
    if (b < 64) {
        r = r - 64;
        g = g - 64;
        b = b + 128;
    }
    else if (b > 192) {
        r = r + 64;
        g = g + 64;
        b = b - 128;
    }

    return {
        r,
        g,
        b
    };
};
