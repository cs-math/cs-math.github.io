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

function get_output_matrix_html(matrix) {
    let matrix_order = get_order(matrix);
    let rows = matrix_order[0];
    let columns = matrix_order[1];
    let html = '<table align="center">';
    for (let r = 0; r < rows; ++r) {
        html += '<tr>\n';
        for (let c = 0; c < columns; ++c) {
            html += `<td>${matrix[r][c]}</td>`;
        }
        html += '\n</tr>\n';
    }
    html += '</table>';
    return html;
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

function get_matrices_sum_or_difference(matrix_arr, should_sum = true) {
    let sum_2d = null;
    if (matrix_arr.length < 2) {
        return [];
    }
    let order = get_order(matrix_arr[0]);
    let first_order = order[0];
    let second_order = order[1];
    for (let matrix of matrix_arr) {
        let matrix_order = get_order(matrix);
        if (matrix_order[0] != first_order || matrix_order[1] != second_order) {
            return [];
        }
        if (!sum_2d) {
            sum_2d = JSON.parse(JSON.stringify(matrix));
            continue;
        }
        for (let r = 0; r < matrix.length; ++r) {
            for (let c = 0; c < matrix.length; ++c) {
                let addition_factor = should_sum ? 1 : -1;
                sum_2d[r][c] += addition_factor * matrix[r][c];
            }
        }
    }
    return sum_2d;
}

function massage_matrices() {
    clear_elements(['solution-label', 'validation']);
    let matrices_areas = document.getElementsByClassName('matrix-area');
    let matrices = [];
    for (let i = 0; i < matrices_areas.length; ++i) {
        let matrix = matrix_area_to_2d(matrices_areas[i]);
        if (matrix.length === 0 || (matrix[0].length === 0 && matrix.length === 1)) {
            continue;
        }
        if (!validate_matrix(matrix)) {
            set_labels({
                validation: `The numbers of elements in each column do not match in matrix #${
                    i + 1
                }`
            });
            return [];
        }
        matrices.push(matrix);
    }
    return matrices;
}

function get_matrices_properties() {
    let matrices = massage_matrices();
    if (matrices.length === 0) {
        return;
    }
    for (i = 0; i < matrices.length; ++i) {
        let matrix = matrices[i];
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

function do_matrices_operations() {
    let matrices = massage_matrices();
    if (matrices.length === 0) {
        return;
    }
    let sum_matrix = get_matrices_sum_or_difference(matrices);
    let difference_matrix = get_matrices_sum_or_difference(matrices, false);
    set_labels({
        sum:
            sum_matrix.length === 0
                ? 'The matrices are not of the same order'
                : get_output_matrix_html(sum_matrix),
        difference:
            sum_matrix.length === 0
                ? 'The matrices are not of the same order'
                : get_output_matrix_html(difference_matrix)
    });
}
