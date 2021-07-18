const ROUND_TO = 4;

function set_labels(labels_map) {
    for (let key of Object.keys(labels_map)) {
        document.getElementById(key).innerHTML = labels_map[key];
    }
}

function find_mode(arr) {
    let numbers_map = {}; // Maps each number to its count
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
        } else if (max_rep < current_repetition) {
            modes = [number];
            max_rep = current_repetition;
        }
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

function find_outliers(arr, upper_bound, lower_bound) {
    let outliers = [];
    for (element of arr) {
        if (element > upper_bound) {
            outliers.push(element);
            continue;
        }
        break;
    }
    arr.reverse();
    for (element of arr) {
        if (element < lower_bound) {
            outliers.push(element);
            continue;
        }
        break;
    }
    return outliers;
}

function find_variance(arr, mean, population=true) {
    let denominator = population ? arr.length : arr.length - 1;
    let sum = 0;
    for (element of arr) {
        sum += Math.pow(element - mean, 2) / denominator
    }
    return sum;
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

    let number_elements = number_arr.length;
    let sum = number_arr.reduce((acc, cur) => acc + cur).toFixed(ROUND_TO);
    let minimum_value = number_arr[number_arr.length - 1];
    let maximum_value = number_arr[0];
    let mean = (sum / number_arr.length).toFixed(ROUND_TO);
    let mode = find_mode(number_arr);
    mode = mode.length == 0 ? 'N/A' : mode.join(', ');
    // For the first and third quartiles
    // if array is of odd length: | 0 -> (n + 1) / 2 - 1 | and | (n + 1) / 2 - 1 -> n - 1 |
    // if array is of even length: | 0 -> n / 2 - 1 | and | n / 2 -> n - 1 |
    let first_separator =
        number_elements % 2 == 1 ? (number_elements + 1) / 2 - 2 : number_elements / 2 - 1;
    let second_separator = number_elements % 2 == 1 ? first_separator + 2 : number_elements / 2;
    let third_quartile = find_median(number_arr.slice(0, first_separator + 1));
    let first_quartile = find_median(number_arr.slice(second_separator));
    let iqr = third_quartile - first_quartile;
    let upper_bound = parseFloat(third_quartile) + 1.5 * iqr;
    let lower_bound = parseFloat(first_quartile) - 1.5 * iqr;
    let outliers = find_outliers(number_arr, upper_bound, lower_bound);
    outliers = outliers.length === 0 ? 'N/A' : outliers.join(', ');
    let population_variance = find_variance(number_arr, mean).toFixed(ROUND_TO);
    let sample_variance = find_variance(number_arr, mean, false).toFixed(ROUND_TO);

    set_labels({
        array: number_arr.join(', '),
        'number-elements': number_elements,
        sum,
        min: minimum_value + minimum_index,
        max: maximum_value + maximum_index,
        mean,
        median: find_median(number_arr),
        mode,
        range: maximum_value - minimum_value,
        'first-quartile': first_quartile,
        'third-quartile': third_quartile,
        iqr,
        'upper-bound': upper_bound,
        'lower-bound': lower_bound,
        outliers,
        'population-variance': population_variance,
        'sample-variance': sample_variance,
        'population-sd': Math.sqrt(population_variance).toFixed(ROUND_TO),
        'sample-sd': Math.sqrt(sample_variance).toFixed(ROUND_TO)
    });
}
