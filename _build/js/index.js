const time2color = require('./time2color');

Array.from(document.querySelectorAll('.post')).forEach(el => {
    let color = time2color(el.querySelector('time').textContent);
    el.querySelector('header').style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
});
