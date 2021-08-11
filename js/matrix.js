let next_matrix_number = 1;

function hide_solution_divisions() {
    for (let i of ['operations', 'properties', 'general-operations']) {
        document.getElementById(i).style.display = 'none';
    }
}

function clear_matrix_elements() {
    hide_solution_divisions();
    clear_elements(['matrix-area', 'solution-label']);
}

function set_initial_matrices() {
    draw_matrix_area();
}

function draw_matrix_area() {
    let main_div = document.getElementsByClassName('equation-box')[0];
    let matrix_div = document.createElement('div');
    matrix_div.className = 'matrix';
    matrix_div.innerHTML = `<h5>Matrix ${next_matrix_number} (M${next_matrix_number})</h5>
        <textarea class="matrix-area" id="matrix${next_matrix_number}"></textarea>
        <div>
        <input type="button" class="main-button secondary-button"
        onclick="set_matrix_negative(${next_matrix_number})" value="Negative"></input>
        <input type="button" class="main-button secondary-button"
        onclick="set_matrix_transpose(${next_matrix_number})" value="Transpose"></input></div>`;
    main_div.appendChild(matrix_div);
    if (next_matrix_number === 1) {
        put_matrix_in_area(
            [
                [math.complex('1 + 2i'), 2, 3],
                [0.5, -1.5, 6],
                [7, 8, 9]
            ],
            'matrix1'
        );
    }
    ++next_matrix_number;
    if (next_matrix_number > 2) {
        for (let i of ['remove-button', 'operations-button']) {
            document.getElementById(i).disabled = false;
        }
    }
}

function remove_matrix_area() {
    document.getElementsByClassName('matrix')[next_matrix_number - 2].remove();
    --next_matrix_number;
    if (next_matrix_number <= 2) {
        for (let i of ['remove-button', 'operations-button']) {
            document.getElementById(i).disabled = true;
        }
    }
}

function standardize_operations() {
    let matrices = massage_matrices();
    operations = document.getElementById('general-operations-input').value;
    operations = operations.replaceAll(/M[0-9]+/g, function (match) {
        let matrix = matrices[parseInt(match.replaceAll('M', '')) - 1];
        if (!matrix) {
            throw new Error(`Undefined matrix (${match})`);
        }
        return math.matrix(matrix);
    });
    for (let i of ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) {
        operations = operations
            .replaceAll(i + '[', i + ' * ' + '[')
            .replaceAll(']' + i, ']' + ' * ' + i);
    }
    return operations;
}

function set_matrix_transpose(matrix_number) {
    let matrix_area = document.getElementById(`matrix${matrix_number}`);
    let matrix = matrix_area_to_2d(matrix_area);
    if (!validate_matrix(matrix)) {
        return;
    }
    let transposed_matrix = transpose_matrix(matrix);
    put_matrix_in_area(transposed_matrix, `matrix${matrix_number}`);
}

function set_matrix_negative(matrix_number) {
    let matrix_area = document.getElementById(`matrix${matrix_number}`);
    let matrix = matrix_area_to_2d(matrix_area);
    if (!validate_matrix(matrix)) {
        return;
    }
    let negative_matrix = get_matrix_negative(matrix);
    put_matrix_in_area(negative_matrix, `matrix${matrix_number}`);
}

function transpose_matrix(matrix) {
    let final_matrix = [];
    for (let c = 0; c < matrix[0].length; ++c) {
        let one_dimension = [];
        for (let r = 0; r < matrix.length; ++r) {
            one_dimension.push(matrix[r][c]);
        }
        final_matrix.push(one_dimension);
    }
    return final_matrix;
}

function get_output_matrix_html(matrix) {
    let matrix_order = get_order(matrix);
    let rows = matrix_order[0];
    let columns = matrix_order[1];
    let html = '<table align="center">';
    for (let r = 0; r < rows; ++r) {
        html += '<tr>\n';
        for (let c = 0; c < columns; ++c) {
            html += `<td>${String(math.round(matrix[r][c], DECIMAL_PLACES))}</td>`;
        }
        html += '\n</tr>\n';
    }
    html += '</table>';
    return html;
}

function put_matrix_in_area(matrix, area_id) {
    let max_length = 0;
    let matrix_string = '';
    for (let r = 0; r < matrix.length; ++r) {
        let maximum_element = 0;
        for (let c = 0; c < matrix[r].length - 1; ++c) {
            // TODO: check if more than DECIMAL_PLACES decimals would break formatting
            let element_length = String(matrix[r][c]).length;
            if (element_length < maximum_element) {
                continue;
            }
            maximum_element = element_length;
        }
        if (maximum_element > max_length) {
            max_length = maximum_element;
        }
    }
    ++max_length;
    for (let row of matrix) {
        for (let e = 0; e < row.length; ++e) {
            let repeat_number = e === row.length - 1 ? 0 : max_length - String(row[e]).length;
            matrix_string += String(row[e]) + ' '.repeat(repeat_number);
        }
        matrix_string += '\n';
    }
    set_elements_value({
        [area_id]: matrix_string
    });
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

function matrix_area_to_2d(matrix_area) {
    let one_dimension = matrix_area.value.split('\n');
    let two_dimensions = [];
    for (let element of one_dimension) {
        let final_array = filter_number_arr(element, true);
        if (final_array.length === 0) {
            continue;
        }
        two_dimensions.push(final_array);
    }
    return two_dimensions;
}

function is_symmetric_matrix(matrix, skew_check = false) {
    let multiplication_operator = skew_check ? -1 : 1;
    for (let i = 0; i < matrix.length; ++i) {
        for (let j = 0; j < matrix.length; ++j) {
            if (
                math.evaluate(`${matrix[i][j]} == ${multiplication_operator} * (${matrix[j][i]})`)
            ) {
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

function get_commutes(matrices) {
    let commutes_str = '';
    for (let first = 0; first < matrices.length - 1; ++first) {
        for (let second = first + 1; second < matrices.length; ++second) {
            let first_product = get_matrices_product([matrices[first], matrices[second]]);
            let second_product = get_matrices_product([matrices[second], matrices[first]]);
            if (
                first_product.length === 0 ||
                second_product.length === 0 ||
                !are_matrices_equal([first_product, second_product])
            ) {
                continue;
            }
            commutes_str += commutes_str !== '' ? ', ' : '';
            commutes_str += `(${String(first + 1)}, ${String(second + 1)})`;
        }
    }
    return commutes_str === '' ? 'None' : commutes_str;
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
                if (
                    math.evaluate(`${matrix_arr[i][row][column]} != ${matrix_arr[j][row][column]}`)
                ) {
                    return false;
                }
            }
        }
    }
    return true;
}

function get_matrices_sum_or_difference(matrix_arr, should_sum = true) {
    if (matrix_arr.length < 2) {
        return;
    }
    let addition_factor = should_sum ? 1 : -1;
    let first_order = get_order(matrix_arr[0]);
    let sum_2d = matrix_arr[0];
    for (let i = 1; i < matrix_arr.length; ++i) {
        let matrix = matrix_arr[i];
        let current_order = get_order(matrix);
        if (current_order[0] != first_order[0] || current_order[1] !== first_order[1]) {
            return [];
        }
        let two_dimensions = [];
        for (let rows = 0; rows < first_order[0]; ++rows) {
            let one_dimension = [];
            for (let columns = 0; columns < first_order[1]; ++columns) {
                let summation = math.evaluate(
                    `(${sum_2d[rows][columns]}) + ${addition_factor} * (${matrix[rows][columns]})`
                );
                one_dimension.push(summation);
            }
            two_dimensions.push(one_dimension);
        }
        sum_2d = two_dimensions;
    }
    return sum_2d;
}

function get_matrices_product(matrices) {
    /*
    a11 a12 a13     b11 b12
                    b21 b22
                    b31 b32

    element #1: a11 * b11 + a12 + b21 + a13 * b31
    element #2: a11 * b12 + a12 * b22 + a13 * b32
    element: sum(a[outer_iterator][inner_iterator] * b[inner_iterator][index_of_the_current_element_in_the_row])
             from inner_iterator = 1 to inner_iterator = columns of first/rows of second
             slowest: outer_iterator
             faster: index_of_the_current_element_in_the_row
             fastest: inner_iterator
    */
    if (matrices.length <= 1) {
        return;
    }
    let product = matrices[0];
    for (let m = 1; m < matrices.length; ++m) {
        let matrix = matrices[m];
        let product_order = get_order(product);
        let matrix_order = get_order(matrix);
        if (product_order[1] !== matrix_order[0]) {
            return [];
        }
        let two_dimensions = [];
        for (let outer_iterator = 0; outer_iterator < product_order[0]; ++outer_iterator) {
            let one_dimension = [];
            for (let e = 0; e < matrix_order[1]; ++e) {
                let sum = 0;
                for (let inner_iterator = 0; inner_iterator < product_order[1]; ++inner_iterator) {
                    sum = math.evaluate(
                        `${sum} + (${product[outer_iterator][inner_iterator]}) * (${matrix[inner_iterator][e]})`
                    );
                }
                one_dimension.push(sum);
            }
            two_dimensions.push(one_dimension);
        }
        product = two_dimensions;
    }
    return product;
}

function get_matrix_negative(matrix) {
    if (matrix.length === 0) {
        return;
    }
    for (let r = 0; r < matrix.length; ++r) {
        for (let c = 0; c < matrix[0].length; ++c) {
            matrix[r][c] = math.evaluate(`-(${matrix[r][c]})`);
        }
    }
    return matrix;
}

function massage_matrices() {
    clear_elements(['solution-label']);
    let matrices_areas = document.getElementsByClassName('matrix-area');
    let matrices = [];
    for (let i = 0; i < matrices_areas.length; ++i) {
        let matrix = matrix_area_to_2d(matrices_areas[i]);
        if (matrix.length === 0 || (matrix[0].length === 0 && matrix.length === 1)) {
            continue;
        }
        if (!validate_matrix(matrix)) {
            alert(`The number of elements in each row do not match in Matrix #${String(i + 1)}`);
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
    hide_solution_divisions();
    document.getElementById('properties').style.display = 'block';
    for (let i = 0; i < matrices.length; ++i) {
        let matrix = matrices[i];
        let is_square = matrix[0].length === matrix.length;
        let is_symmetric = is_square && is_symmetric_matrix(matrix);
        let is_skew_symmetric = is_square && is_symmetric_matrix(matrix, true);
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
    let commutes = get_commutes(matrices);
    add_to_labels({
        equality,
        commutes
    });
}

function do_matrices_operations() {
    let matrices = massage_matrices();
    if (matrices.length < 2) {
        return;
    }
    hide_solution_divisions();
    document.getElementById('operations').style.display = 'block';
    let sum_matrix = get_matrices_sum_or_difference(matrices);
    let difference_matrix = get_matrices_sum_or_difference(matrices, false);
    let product_matrix = get_matrices_product(matrices);
    set_elements_html({
        sum:
            sum_matrix.length === 0
                ? 'The matrices are not of the same order'
                : get_output_matrix_html(sum_matrix),
        difference:
            sum_matrix.length === 0
                ? 'The matrices are not of the same order'
                : get_output_matrix_html(difference_matrix),
        product:
            product_matrix.length === 0
                ? "Can't multiply with such dimensions"
                : get_output_matrix_html(product_matrix)
    });
}

function calculate_general_operations(operations) {
    hide_solution_divisions();
    document.getElementById('general-operations').style.display = 'block';
    try {
        operations = standardize_operations(operations);
        let result = math.round(math.evaluate(operations), DECIMAL_PLACES);
        if (math.isMatrix(result)) {
            result = get_output_matrix_html(result._data);
        }
        set_elements_html({
            'general-label': result
        });
    } catch (error) {
        set_elements_html({
            'general-label': error.message
        });
    }
}
