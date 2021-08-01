let next_matrix_number = 1;

function clear_matrix_elements() {
    clear_elements(['matrix-area', 'solution-label']);
}

function set_initial_matrices() {
    draw_matrix_area();
    draw_matrix_area();
}

function draw_matrix_area() {
    let main_div = document.getElementsByClassName('equation-box')[0];
    let matrix_div = document.createElement('div', { class: 'matrix' });
    let matrix_value = next_matrix_number === 1 ? '1   2  3\n4   5  6\n0.5 2 -0.25' : '';
    matrix_div.innerHTML = `<h5>Matrix ${String(next_matrix_number)}</h5>
        <textarea class="matrix-area" id="matrix${String(
            next_matrix_number
        )}">${matrix_value}</textarea>`;
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

function validate_matrix(matrix) {
    let first_row_length = matrix[0].length;
    for (let row of matrix) {
        if (row.length !== first_row_length) {
            return false;
        }
    }
    return true;
}

function is_symmetric_matrix(matrix) {
    for (let i = 0; i < matrix.length; ++i) {
        for (let j = 0; j < matrix.length; ++j) {
            if (matrix[i][j] === matrix[j][i]) {
                continue;
            }
            return false;
        }
    }
    return true;
}

function get_matrices_info() {
    /*
    Symmetry: a11 = a11, a12 = a21, a13 = a31, etc.
    */
    clear_elements(['solution-label']);
    let matrices_areas = document.getElementsByClassName('matrix-area');
    for (let i = 0; i < matrices_areas.length; ++i) {
        let matrix = matrix_area_to_2d(matrices_areas[i]);
        if (matrix[0].length === 0 && matrix.length === 1) {
            continue;
        }
        if (!validate_matrix(matrix)) {
            return set_labels({
                validation: `The numbers of elements in each column do not match in matrix #${
                    i + 1
                }`
            });
        }
        let is_square = matrix[0].length === matrix.length;
        let is_symmetric = is_square ? is_symmetric_matrix(matrix) : false;
        if (i !== 0) {
            add_to_labels({
                shape: ', ',
                symmetry: ', ',
                order: ', '
            });
        }
        add_to_labels({
            shape: is_square ? 'Square' : 'Rectangular',
            symmetry: is_symmetric ? 'Symmetric' : 'Asymmetric',
            order: matrix[0].length + ' x ' + matrix.length
        });
    }
}
