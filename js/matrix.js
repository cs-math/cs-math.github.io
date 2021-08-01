let next_matrix_number = 1;

function set_initial_matrices() {
    draw_matrix_area();
    draw_matrix_area();
}

function draw_matrix_area() {
    let main_div = document.getElementsByClassName('equation-box')[0];
    let matrix_div = document.createElement('div', { class: 'matrix' });
    matrix_div.innerHTML = `<h5>Matrix ${String(next_matrix_number)}</h5>
        <p class="instructions">Elements are separated by a space,<br />
        rows are separated by a new line</p>
        <textarea class="matrix-area" id="matrix${String(next_matrix_number)}"></textarea>`;
    main_div.appendChild(matrix_div);
    ++next_matrix_number;
}

function matrix_area_to_2d(matrix_area) {
    let one_dimension = matrix_area.value.split('\n');
    let two_dimensions = [];
    for (let element of one_dimension) {
        two_dimensions.push(filter_number_arr(element));
    }
    return two_dimensions;
}

function get_matrices_info() {
    let matrices_areas = document.getElementsByClassName('matrix-area');
    for (let matrix_area of matrices_areas) {
        matrix_area_to_2d(matrix_area);
    }
}
