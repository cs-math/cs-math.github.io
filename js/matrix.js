let next_matrix_number = 1;

function clear_matrix_elements() {
    clear_elements(['matrix-area', 'solution-label', 'validation']);
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
        let final_array = filter_number_arr(element);
        if (final_array.length === 0) {
            continue;
        }
        two_dimensions.push(final_array);
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

function is_skew_symmetric_matrix(matrix) {
    for (let i = 0; i < matrix.length; ++i) {
        for (let j = 0; j < matrix.length; ++j) {
            if ((i === j && j === 0) || matrix[i][j] === -matrix[j][i]) {
                continue;
            }
            return false;
        }
    }
    return true;
}

function get_order(matrix) {
    return [matrix.length, matrix[0].length];
}

function are_matrices_equal(matrix_arr) {
    if (matrix_arr.length < 2) {
        return false;
    }
    for (let i = 0, j = 1; j < matrix_arr.length; ++i, ++j) {
        let first_order = get_order(matrix_arr[i]);
        let second_order = get_order(matrix_arr[j]);
        if (first_order[0] != second_order[0] || first_order[1] != second_order[1]) {
            return false;
        }
        for (let row = 0; row < first_order[0]; ++row) {
            for (let column = 0; column < first_order[1]; ++column) {
                if (matrix_arr[i][row][column] != matrix_arr[j][row][column]) {
                    return false;
                }
            }
        }
    }
    return true;
}

function get_matrices_properties() {
    /*
    Symmetry: a11 = a11, a12 = a21, a13 = a31, etc.
    */
    clear_elements(['solution-label', 'validation']);
    let matrices_areas = document.getElementsByClassName('matrix-area');
    let matrices = [];
    for (let i = 0; i < matrices_areas.length; ++i) {
        let matrix = matrix_area_to_2d(matrices_areas[i]);
        if (matrix.length === 0 || matrix[0].length === 0 && matrix.length === 1) {
            continue;
        }
        if (!validate_matrix(matrix)) {
            return set_labels({
                validation: `The numbers of elements in each column do not match in matrix #${
                    i + 1
                }`
            });
        }
        matrices.push(matrix);
        let is_square = matrix[0].length === matrix.length;
        let is_symmetric = is_square && is_symmetric_matrix(matrix);
        let is_skew_symmetric = is_square && is_skew_symmetric_matrix(matrix);
        let symmetry = 'Asymmetric';
        if (is_symmetric) {
            symmetry = 'Symmetric';
        } else if (is_skew_symmetric) {
            symmetry = 'Skew-Symmetric';
        }
        if (i !== 0) {
            add_to_labels({
                shape: ', ',
                symmetry: ', ',
                order: ', '
            });
        }
        add_to_labels({
            shape: is_square ? 'Square' : 'Rectangular',
            symmetry,
            order: get_order(matrix).join(' x ')
        });
    }
    let equality = are_matrices_equal(matrices) ? 'Yes' : 'No';
    add_to_labels({
        equality
    });
}
