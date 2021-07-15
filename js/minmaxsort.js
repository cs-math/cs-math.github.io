function sort() {
    let text_box = document.getElementById('arr-text-box');

    text_arr = text_box.value.split(' ');

    for (i = 0; i < text_arr.length; i++) {
        text_arr[i] = parseFloat(
            text_arr[i]
                .split('')
                .filter((char) => char.match(/[0-9]|\.|-/))
                .join('')
        );
    }

    text_arr.sort(function (a, b) {
        return b - a;
    });

    text_arr = text_arr.filter(function (value) {
        return !Number.isNaN(value);
    });

    if (text_arr.length === 0 || text_arr.length === 1) {
        text_box.value = null;
        text_box.placeholder = 'Please enter two or more numbers';
        return;
    }

    let min_box = document.getElementById('min');
    let max_box = document.getElementById('max');
    let noe_box = document.getElementById('number-elements');
    min_box.innerHTML = 'Minimum value = ' + text_arr[text_arr.length - 1];
    max_box.innerHTML = 'Maximum value = ' + text_arr[0];
    noe_box.innerHTML = 'Number of elements = ' + text_arr.length;
    array.innerHTML = 'Sorted array = ' + text_arr.join(', ');
}
