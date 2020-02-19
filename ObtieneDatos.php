<?php

  if(isset($_GET['action']) && !empty($_GET['action'])) {
      $action = $_GET['action'];
      switch($action) {
          case 'ObtieneCiudades' :
            $ArrayCiudades = ObtieneCiudades();
            echo json_encode($ArrayCiudades);
            break;
          case 'ObtieneTipos' :
            $ArrayTipos = ObtieneTipos();
            echo json_encode($ArrayTipos);
            break;
          default : break;
      }
  }

  function ObtieneCiudades(){
    $archivojson = fopen("data-1.json","r");
    $datosjson = fread($archivojson, filesize("data-1.json"));
    $Datos = json_decode($datosjson, true);
    $ArrayCiudades = array();

    foreach ($Datos as $key => $value) {
      $ArrayCiudades[] = $value['Ciudad'];
    }

    $ArrayCiudades = array_unique($ArrayCiudades);
    fclose($archivojson);

    return $ArrayCiudades;
  }

  function ObtieneTipos(){
    $archivojson = fopen("data-1.json","r");
    $datosjson = fread($archivojson, filesize("data-1.json"));
    $Datos = json_decode($datosjson, true);
    $ArrayTipos = array();

    foreach ($Datos as $key => $value) {
      $ArrayTipos[] = $value['Tipo'];
    }

    $ArrayTipos = array_unique($ArrayTipos);
    fclose($archivojson);

    return $ArrayTipos;
  }


  if(isset($_GET['action']) && !empty($_GET['action'])) {
      $action = $_GET['action'];
      switch($action) {
          case 'ObtieneTodos' :
            $realStates = ObtieneTodos();
            echo json_encode($realStates);
            break;
          case 'filterResults' :
            $precioInicial =  $_GET['precioInicial'];
            $precioFinal =  $_GET['precioFinal'];
            $tipo =  $_GET['tipo'];
            $ciudad =  $_GET['ciudad'];
            $realStates = filterResults($precioInicial, $precioFinal, $tipo, $ciudad);
            echo json_encode($realStates);
            break;
          default : break;
      }
  }

  function ObtieneTodos(){
    $archivojson = fopen("data-1.json","r");
    $datosjson = fread($archivojson, filesize("data-1.json"));
    $Datos = json_decode($datosjson, true);
    fclose($archivojson);
    return $Datos;
  }

  function filterResults($precioInicial, $precioFinal, $tipo, $ciudad){
    $archivojson = fopen("data-1.json","r");
    $datosjson = fread($archivojson, filesize("data-1.json"));
    $Datos = json_decode($datosjson, true);
    $realState = array();
    $realStatePrice;
    $add = true;
    foreach ($Datos as $key => $value) {
      $add = true;
      $realStatePrice = str_replace(array('$', ','), '' , $value['Precio']);
      if($realStatePrice < $precioInicial || $precioFinal < $realStatePrice){
        $add = false;
      }

      if(!empty($tipo) && $add){
        if($tipo != $value['Tipo']){
            $add = false;
        }
      }

      if(!empty($ciudad) && $add){
        if($ciudad != $value['Ciudad']){
            $add = false;
        }
      }

      if($add){
        $realState[] = $value;
      }
    }

    fclose($archivojson);
    return $realState;
  }





?>
