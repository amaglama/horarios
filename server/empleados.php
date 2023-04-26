<?php
    $empleados = [
        [ "id" => 1, "name" => 'Juan Perez' ],
        [ "id" => 2, "name" => 'Maria Gonzalez' ],
        [ "id" => 3, "name" => 'Pedro Rodriguez' ],
        [ "id" => 4, "name" => 'Ana Ramirez' ],
        [ "id" => 5, "name" => 'Carlos Lopez'],
      ];
    echo json_encode($empleados);
?>