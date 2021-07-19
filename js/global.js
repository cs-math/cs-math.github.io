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
