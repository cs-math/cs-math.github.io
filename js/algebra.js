(function () {
    const symbols = ['x', 'y', 'z'];
    window.onload = function () {
        let dropdown = document.getElementById('dropdown');
        dropdown.addEventListener('change', (e) => draw_equations(parseInt(e.target.value)));
        dropdown.addEventListener('change', show_control_buttons);
        document.getElementById('clear-button').addEventListener('click', clear_equations);
        document.getElementById('calculate-button').addEventListener('click', check_and_calculate);
    };

    function show_control_buttons() {
        document.getElementById('control-buttons').style.display = 'block';
        document.getElementById('dropdown').removeEventListener('change', show_control_buttons);
    }

    function clear_equations() {
        clear_elements(['number-box']);
    }

    function draw_equations(number_equations) {
        let input_div = document.getElementById('user-input');
        let solution_div = document.getElementById('solution-box');
        input_div.innerHTML = '';
        solution_div.innerHTML = '';
        for (let i = 0; i < number_equations; ++i) {
            input_div.innerHTML += `<div class="equation">`;
            for (let j = 0; j < number_equations; ++j) {
                input_div.innerHTML += `<input type="number" class="number-box" id="a${i}${j}"></input>${
                    symbols[j]
                }
                ${j === number_equations - 1 ? '=' : '+'} `;
            }
            input_div.innerHTML += `<input type="number" class="number-box" id="c${i}"></div>\n`;
            solution_div.innerHTML += `<div class="result">
                <label>${symbols[i]} = </label>
                <label class="solution-label" id="result${i}"></label>
                </div>`;
        }
    }

    function fill_empties(inputs_collection) {
        for (let input of inputs_collection) {
            if (input.value.length !== 0) {
                continue;
            }
            input.value = '0';
        }
    }

    function get_variables_and_constants(inputs_collection, chosen_equation_number) {
        let one_dimension_size = chosen_equation_number + 1;
        let variables_matrix = [];
        let constants_matrix = [];
        for (let i = 0; i < chosen_equation_number; ++i) {
            let one_dimension = [];
            /*
               1 2 3 c
               4 5 6 c
               7 8 9 c
            */
            for (let j = 0; j < one_dimension_size - 1; ++j) {
                one_dimension.push(parseInt(inputs_collection[j + one_dimension_size * i].value));
            }
            variables_matrix.push(one_dimension);
            constants_matrix.push([
                parseInt(inputs_collection[one_dimension_size - 1 + one_dimension_size * i].value)
            ]);
        }
        return [variables_matrix, constants_matrix];
    }

    function check_and_calculate() {
        let inputs = document.getElementsByClassName('number-box');
        fill_empties(inputs);
        let chosen_equation_number = parseInt(document.getElementById('dropdown').value);
        let [variables_matrix, constants_matrix] = get_variables_and_constants(
            inputs,
            chosen_equation_number
        );
        for (let i = 0; i < variables_matrix.length; ++i) {
            let valid = false;
            for (let j = 0; j < variables_matrix[0].length; ++j) {
                if (variables_matrix[j][i] !== 0) {
                    valid = true;
                    break;
                }
            }
            if (!valid) {
                set_elements_html({
                    'solution-box': `The coefficients of ${symbols[i]} are 0`
                });
            }
        }
    }
})();
