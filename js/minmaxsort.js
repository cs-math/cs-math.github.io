function sort() {
    let text_box = document.getElementById('arr-text-box');

    let text_arr = text_box.value.split(' ');

    for (i = 0; i < text_arr.length; i++) {
        text_arr[i] = parseFloat(
            text_arr[i]
                .split('')
                .filter((char) => char.match(/[0-9]|\.|-/))
                .join('')
        );
    }

    let minimum_index = ' (x<sub>' + String(text_arr.indexOf(Math.min(...text_arr)) + 1) + '</sub>)';
    let maximum_index = ' (x<sub>' + String(text_arr.indexOf(Math.max(...text_arr)) + 1) + '</sub>)';
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
    min_box.innerHTML = 'Minimum value: ' + text_arr[text_arr.length - 1] + minimum_index;
    max_box.innerHTML = 'Maximum value: ' + text_arr[0] + maximum_index;
    noe_box.innerHTML = 'Number of elements: ' + text_arr.length;
    array.innerHTML = 'Sorted array: ' + text_arr.join(', ');
}
