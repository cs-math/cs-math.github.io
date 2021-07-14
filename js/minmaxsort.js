const NUMBER_BOXES = 5;

function add_boxes() {
    let i = 0;
    while (i < NUMBER_BOXES) {
        let main_div = document.createElement('div');

        let label_info = document.createElement('label');
        label_info.setAttribute('class', 'info')
        label_info.innerHTML = `x<sub>${i + 1}</sub> `

        let text_box = document.createElement('input');
        text_box.setAttribute('type', 'number');
        text_box.setAttribute('class', 'number-box');

        let label_min_max = document.createElement('label');
        label_min_max.setAttribute('class', 'info');

        let button_div = document.getElementsByClassName('button-div')[0];

        main_div.appendChild(label_info);
        main_div.appendChild(text_box);
        equation_box = document.getElementsByClassName('equation-box')[0];
        equation_box.insertBefore(main_div, button_div);
        ++i;
    }
}

function sort() {

    let boxes = document.getElementsByClassName('number-box');
    let boxes_arr = Array.prototype.slice.call(boxes);
    boxes_arr.sort(function(a, b) {
        if (parseFloat(a.value) > parseFloat(b.value)) {
            return -1;
        }
        else if (parseFloat(a.value) < parseFloat(b.value)) {
            return 1;
        }
        return 0;
    });
    let i = 0;
    while (i < NUMBER_BOXES) {
        boxes[i].value = boxes_arr[i].value;
        ++i;
    }
}
