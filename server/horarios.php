<?php
  // foreach($_POST as $campo => $valor){
  //   echo "- ". $campo ." = ". $valor;
  // }
  $emp = $_POST["empleado"];
    $empleados = [
      [ "id" => 1, "dias" => 'lunes, martes, miercoles', "entrada" => '08:00:00', "salida" => '12:00:00', "emp_code" => 2 ],
      [ "id" => 2, "dias" => 'lunes', "entrada" => '13:00:00', "salida" => '20:00:00', "emp_code" => 2 ],
      [ "id" => 3, "dias" => 'sabado', "entrada" => '08:00:00', "salida" => '12:00:00', "emp_code" => 2 ],
      [ "id" => 4, "dias" => 'domingo', "entrada" => '10:00:00', "salida" => '20:00:00', "emp_code" => 2 ],
      [ "id" => 5, "dias" => 'default', "entrada" => '08:00:00', "salida" => '12:00:00', "emp_code" => 3 ],
      [ "id" => 6, "dias" => 'domingo', "entrada" => '10:00:00', "salida" => '20:00:00', "emp_code" => 3 ],
      [ "id" => 7, "dias" => 'lunes', "entrada" => '08:00:00', "salida" => '12:00:00', "emp_code" => 5 ],
      [ "id" => 8, "dias" => 'miercoles', "entrada" => '10:00:00', "salida" => '20:00:00', "emp_code" => 5 ],
    ];
  $horarios = [];
  foreach($empleados as $fila)
  {
    if($fila["emp_code"] == $emp)
    {
      $horarios[] = $fila;
    }
  }
  echo json_encode($horarios);
?>