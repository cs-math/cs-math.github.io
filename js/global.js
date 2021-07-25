const DECIMAL_PLACES = 4;

function set_labels(labels_map) {
    for (let key of Object.keys(labels_map)) {
        document.getElementById(key).innerHTML = labels_map[key];
    }
}

function clear_elements(class_names) {
    for (let name of class_names) {
        let elements = document.getElementsByClassName(name);
        for (let element of elements) {
            if (element.nodeName === 'LABEL') {
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
