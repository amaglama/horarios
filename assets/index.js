let agregar       = document.getElementById("agregar");
let diasLaborables= ["lunes", "martes", "miercoles", "jueves", "viernes"];
let tabla         = document.getElementById("tabla-registros");
let emp_code      = document.querySelector("input[name='code']");
agregar.addEventListener("click", agregate);

function agregate(){
    
    let nuevaFila = document.createElement('tr');
    nuevaFila.innerHTML = `
    <td class="code_col"></td>
    <td class="hora">
        <input type="time" name="entrada">
    </td>
    <td class="hora">
        <input type="time" name="salida">
    </td>
    <td class="checkeds">
      <label><input type="checkbox" name="default" checked><sup>L-V</sup></label>
      <label><input type="checkbox" name="lunes"><sup>Lu</sup></label>
      <label><input type="checkbox" name="martes"><sup>Ma</sup></label>
      <label><input type="checkbox" name="miercoles"><sup>Mi</sup></label>
      <label><input type="checkbox" name="jueves"><sup>Ju</sup></label>
      <label><input type="checkbox" name="viernes"><sup>Vi</sup></label>
      <label><input type="checkbox" name="sabado"><sup>Sa</sup></label>
      <label><input type="checkbox" name="domingo"><sup>Do</sup></label>
    </td>
        `;
    tabla.appendChild(nuevaFila);

}


tabla.addEventListener("change", function(e){
    if (e.target.nodeName == "INPUT") {
        let dia = e.target.name;
        if(diasLaborables.includes(dia))
        {
            e.target.closest("td").querySelector("input[name='default']").checked = false;
        }
        else if(dia == "default") {
            let semana = e.target.closest("td").querySelectorAll("input:checked");
            semana.forEach(element => {
                if(diasLaborables.includes(element.name))
                    element.checked = false;
            });
        }
        
    }

}, "checkeds");


/***** Buscador *******/

let input = document.getElementById("empleados");
input.addEventListener("input", function() {
  let seleccionado = document.getElementById("list_personal").querySelector("option[value='" + input.value + "']");
  if (seleccionado) {
    emp_code.value = seleccionado.value;
    input.value = seleccionado.text;
    console.log("Valor seleccionado: " + valor);
    console.log("Texto seleccionado: " + texto);
  }
  else{
    document.querySelector("input[name='code']").value = '';
  }
});

/***** Por si acaso *****/
function obtenerSeleccion() {
  var datalist = document.getElementById("list_personal");
  var seleccionado = datalist.querySelector("option[value='" + input.value + "']");
  if (seleccionado) {
    
    console.log("Valor seleccionado: " + valor);
    console.log("Texto seleccionado: " + texto);
  } else {
    console.log("Ningún elemento seleccionado.");
  }
}

document.getElementById("guardar").addEventListener("click", function(){
  let filas = tabla.querySelectorAll("tr");
  let horario = [];
  filas.forEach(fila => {
    let checkeds = fila.querySelectorAll('.checkeds input:checked');
    let dias = [];
    console.log(fila);
    if(checkeds.length > 0 && emp_code.value){
      checkeds.forEach(check => {
        dias.push(check.value);
      });
      horario.push({
        dias: dias,
        emp_code: emp_code.value,
        entrada: fila.querySelector('input[name="entrada]'),
        salida: fila.querySelector('input[name="salida]'),
        id_horario: fila.querySelector('.code_col').innerText,
      });
    }
    else{
      console.log("Selecciona algun dia porfavor");
    }
  });
  
  console.log(horario);
});

/******* Envio de datos al servidor ******/
function guardar(){
  
}

  