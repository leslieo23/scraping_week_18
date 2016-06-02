$.getJSON('/read', function(data) {
  for (var i = 0; i<data.length; i++){
    $('#saved').append('<p data-id="' + data[i]._id + '">'+ data[i].title + '<br />'+ data[i].link + '</p>');
  }
});


$(document).on('click', 'p', function(){
  $('#read').empty();
  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "GET",
    url: "/saved/" + thisId,
  })
    .done(function( data ) {
      console.log(data);
      $('#read').append('<h2>' + data.title + '</h2>');
      $('#read').append('<input id="titleinput" name="title" >');
      $('#read').append('<textarea id="bodyinput" name="body"></textarea>');
      $('#read').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');

      if(data.note){
        $('#titleinput').val(data.note.title);
        $('#bodyinput').val(data.note.body);
      }
    });
});

$(document).on('click', '#savenote', function(){
  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $('#titleinput').val(),
      body: $('#bodyinput').val()
    }
  })
    .done(function( data ) {
      console.log(data);
      $('#notes').empty();
    });


  $('#titleinput').val("");
  $('#bodyinput').val("");
});