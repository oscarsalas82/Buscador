/*
  Creación de una función personalizada para jQuery que detecta cuando se detiene el scroll en la página
*/
$.fn.scrollEnd = function(callback, timeout) {
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};
/*
  Función que inicializa el elemento Slider
*/

function inicializarSlider(){
  $("#rangoPrecio").ionRangeSlider({
    type: "double",
    grid: false,
    min: 0,
    max: 100000,
    from: 200,
    to: 80000,
    prefix: "$"
  });
}
/*
  Función que reproduce el video de fondo al hacer scroll, y deteiene la reproducción al detener el scroll

function playVideoOnScroll(){
  var ultimoScroll = 0,
      intervalRewind;
  var video = document.getElementById('vidFondo');
  $(window)
    .scroll((event)=>{
      var scrollActual = $(window).scrollTop();
      if (scrollActual > ultimoScroll){
       video.play();
     } else {
        //this.rewind(1.0, video, intervalRewind);
        video.play();
     }
     ultimoScroll = scrollActual;
    })
    .scrollEnd(()=>{
      video.pause();
    }, 10)
}
*/
inicializarSlider();
//playVideoOnScroll();



$(document).ready(function() {
    //Rellena Ciudades
    ObtieneCiudades(function(){
        $('#selectCiudad').material_select();
    });

    //Rellena Tipos
    ObtieneTipos(function(){
        $('#selectTipo').material_select();
    });

    //Evento clic para mostrar todos
    $('#mostrarTodos').on('click', function() {
        ObtieneTodos();
    });

    //Evento submit
    $('#formulario').submit(BotonBuscar);
});

function ObtieneCiudades(callback){
  $.ajax({
    url: "ObtieneDatos.php",
    dataType: "json",
    type: 'GET',
    data:{action:'ObtieneCiudades'},
    success: function(response){
      $.map(response, function(city){
        var option = '<option value="'+city+'">'+city+'</option>';
        $('#selectCiudad').append(option);
      })
      callback();
    },
    error: function(err){
      console.log(err);
    }
  })
}

function ObtieneTipos(callback){
  $.ajax({
    url: "ObtieneDatos.php",
    dataType: "json",
    type: 'GET',
    data:{action:'ObtieneTipos'},
    success: function(response){
      $.map(response, function(type){
        var option = '<option value="'+type+'">'+type+'</option>';
        $('#selectTipo').append(option);
      })
      callback();
    },
    error: function(err){
      console.log(err);
    }
  })
}

function ObtieneTodos(){
  $.ajax({
    url: "ObtieneDatos.php",
    dataType: "json",
    type: 'GET',
    data:{action:'ObtieneTodos'},
    success: function(response){
      if(response){

        var selectCiudad = $('#selectCiudad');
        selectCiudad.prop('selectedIndex', 0);
        selectCiudad.material_select();

        var selectTipo = $('#selectTipo');
        selectTipo.prop('selectedIndex', 0);
        selectTipo.material_select();

        $('.itemMostrado').remove();

        $.map(response, function(realState, index){
          var template = '<div class="itemMostrado card">'+
                            '<img src="img/home.jpg" alt="">'+
                            '<div class="card-stacked">'+
                              '<div class="card-content">'+
                                '<div><b>Dirección: </b>'+realState['Direccion']+'</div>'+
                                '<div><b>Ciudad: </b>'+realState['Ciudad']+'</div>'+
                                '<div><b>Telefono: </b>'+realState['Telefono']+'</div>'+
                                '<div><b>Código postal: </b>'+realState['Codigo_Postal']+'</div>'+
                                '<div><b>Precio: </b><span class="precioTexto">'+realState['Precio']+'</span></div>'+
                                '<div><b>Tipo: </b>'+realState['Tipo']+'</div>'+
                              '</div>'+
                              '<div class="card-action right-align"><a href="#">Ver más</a></div>'+
                            '</div>'+
                          '</div>'
          $('.colContenido').append(template)
        })
      }
    },
    error: function(err){
      console.log(err);
    }
  })
}

function BotonBuscar(event){
  event.preventDefault()
  var precio = $('#rangoPrecio').val();
  var precioInicial = precio.split(";")[0]
  var precioFinal = precio.split(";")[1]

  var tipo = $('#selectTipo').val();
  var ciudad = $('#selectCiudad').val();

  $.ajax({
    url: "ObtieneDatos.php",
    dataType: "json",
    type: 'GET',
    data:{action:'filterResults', precioInicial:precioInicial, precioFinal:precioFinal, tipo:tipo, ciudad:ciudad},
    success: function(response){
      if(response){
        //Se remueven todos los resultados que anteriormente pudieron haber sido cargados
        $('.itemMostrado').remove();
        $.map(response, function(realState, index){
          var template = '<div class="itemMostrado card">'+
                            '<img src="img/home.jpg" alt="">'+
                            '<div class="card-stacked">'+
                              '<div class="card-content">'+
                                '<div><b>Dirección: </b>'+realState['Direccion']+'</div>'+
                                '<div><b>Ciudad: </b>'+realState['Ciudad']+'</div>'+
                                '<div><b>Telefono: </b>'+realState['Telefono']+'</div>'+
                                '<div><b>Código postal: </b>'+realState['Codigo_Postal']+'</div>'+
                                '<div><b>Precio: </b><span class="precioTexto">'+realState['Precio']+'</span></div>'+
                                '<div><b>Tipo: </b>'+realState['Tipo']+'</div>'+
                              '</div>'+
                              '<div class="card-action right-align"><a href="#">Ver más</a></div>'+
                            '</div>'+
                          '</div>'
          $('.colContenido').append(template)
        })
      }
    },
    error: function(err){
      console.log(err);
    }
  })
}
