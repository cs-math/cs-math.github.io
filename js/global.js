const DECIMAL_PLACES = 4;

function set_labels(labels_map) {
    for (let key of Object.keys(labels_map)) {
        console.log(labels_map[key]);
        document.getElementById(key).innerHTML = labels_map[key];
    }
}

function add_to_labels(labels_map) {
    for (let key of Object.keys(labels_map)) {
        document.getElementById(key).innerHTML += labels_map[key];
    }
}

function clear_elements(class_names) {
    for (let name of class_names) {
        let elements = document.getElementsByClassName(name);
        for (let element of elements) {
            if (element.nodeName === 'LABEL' || element.nodeName === 'DIV') {
                element.innerHTML = null;
                continue;
            }
            element.value = null;
        }
    }
}

function set_text_boxes_values(text_boxes_arr, values_arr) {
    if (text_boxes_arr.length != values_arr.length) {
        return false;
    }
    for (let i = 0; i < text_boxes_arr.length; ++i) {
        text_boxes_arr[i].value = values_arr[i];
    }
}

function filter_number_arr(text_box) {
    let number_arr = [];
    let text_box_value = '';
    if (typeof text_box === 'object') {
        text_box.value.replaceAll(',', ' ');
        text_box_value = text_box.value.replaceAll(',', ' ');
    } else if (typeof text_box === 'string') {
        text_box_value = text_box.replaceAll(',', ' ');
    } else {
        return;
    }
    number_arr = text_box_value.split(' ');

    for (i = 0; i < number_arr.length; i++) {
        number_arr[i] = parseFloat(
            number_arr[i]
                .split('')
                .filter((char) => char.match(/[0-9]|\.|-/))
                .join('')
        );
    }

    number_arr = number_arr.filter(function (value) {
        return !Number.isNaN(value);
    });

    return number_arr;
}

function get_arr_sum(number_arr) {
    return number_arr.reduce((acc, curr) => acc + curr);
}

function prettify_number(number) {
    // Takes a string, returns a string
    let prettified_number = Math.round((parseFloat(number) + Number.EPSILON) * 10000) / 10000;
    if (prettified_number % 1 === 0) {
        return String(Math.round(prettified_number));
    }
    return String(prettified_number);
}
