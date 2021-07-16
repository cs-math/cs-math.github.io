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
