const ROUND_TO = 4;

function set_labels(labels_map) {
    for (let key of Object.keys(labels_map)) {
        document.getElementById(key).innerHTML = labels_map[key];
    }
}

function find_mode(arr) {
    let numbers_map = {};
    let max_rep = 1;
    let modes = [];
    for (let number of arr) {
        if (!(number in numbers_map)) {
            numbers_map[number] = 1;
            continue;
        }

        ++numbers_map[number];
        let current_repetition = numbers_map[number];

        if (max_rep === current_repetition && !modes.includes(number)) {
            modes.push(number);
        }
        else if (max_rep < current_repetition) {
            modes = [number];
        }
        max_rep = Math.max(current_repetition, max_rep);
    }
    return modes;
}

function find_median(arr) {
    let len = arr.length;
    if (len % 2 == 0) {
        return ((arr[len / 2 - 1] + arr[len / 2]) / 2).toFixed(ROUND_TO);
    }
    return arr[(len + 1) / 2 - 1];
}

function calculate_stats() {
    let text_box = document.getElementById('arr-text-box');

    let number_arr = text_box.value.split(' ');

    for (i = 0; i < number_arr.length; i++) {
        number_arr[i] = parseFloat(
            number_arr[i]
                .split('')
                .filter((char) => char.match(/[0-9]|\.|-/))
                .join('')
        );
    }

    let minimum_index =
        ' (x<sub>' + String(number_arr.indexOf(Math.min(...number_arr)) + 1) + '</sub>)';
    let maximum_index =
        ' (x<sub>' + String(number_arr.indexOf(Math.max(...number_arr)) + 1) + '</sub>)';
    number_arr.sort(function (a, b) {
        return b - a;
    });

    number_arr = number_arr.filter(function (value) {
        return !Number.isNaN(value);
    });

    if (number_arr.length === 0 || number_arr.length === 1) {
        text_box.value = null;
        text_box.placeholder = 'Enter two or more space-separated numbers';
        return;
    }

    let sum = number_arr.reduce((acc, cur) => acc + cur).toFixed(ROUND_TO);
    let mean = (sum / number_arr.length).toFixed(ROUND_TO);
    let mode = find_mode(number_arr);
    mode = mode.length == 0 ? 'N/A' : mode.join(', ');
    set_labels({
        array: number_arr.join(', '),
        'number-elements': number_arr.length,
        sum,
        min: number_arr[number_arr.length - 1] + minimum_index,
        max: number_arr[0] + maximum_index,
        mean,
        median: find_median(number_arr),
        mode
    });
}
