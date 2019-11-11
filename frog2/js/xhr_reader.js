// xhr_reader.js

// 2019.02.21 initial coding burgreen

//--------------------------------------
  var xhr_read_json = function() 
//--------------------------------------
{
  function _load_json( src, ok, error ) 
  {
    var request = new XMLHttpRequest(); // this is the "xhr"
    request.overrideMimeType("application/json");
    request.open('GET', src, true);
    request.responseType = 'json';

    request.onreadystatechange = function () 
    {
      if (request.readyState == 4 && request.status == "200") 
      {
        ok(request.response, this);
      }
    };

    request.send(null);
  }

  return function( src, error ) 
  {
    var ok = function( data )
    {
      console.log( 'src =', src )
      console.log( 'data =', data )
      xhr_handle_data_json(data);
    } 
    _load_json( src, ok, error );
  };
}();

//--------------------------------------
  var xhr_read_yaml = function() 
//--------------------------------------
{
  function _load_yaml( src, ok, error ) 
  {
    var request = new XMLHttpRequest(); // this is the "xhr"
    request.overrideMimeType("text/x-yaml");
    request.open('GET', src, true);
    request.responseType = 'text';

    request.onreadystatechange = function () 
    {
      if (request.readyState == 4 && request.status == "200") 
      {
        ok(request.response, this);
      }
    };

    request.send(null);
  }

  return function( src, error ) 
  {
    var ok = function( data )
    {
      //console.log( 'src =', src )
      //console.log( 'data =', data )
      var o = jsyaml.load(data);
      src.func(o);
      //console.log(o);
      //g_obj = obj;
      //var jsonString = JSON.stringify(obj);
      //console.log(jsonString);
    } 
    _load_yaml( src.file, ok, error );
  };
}();

/**
//--------------------------------------
  function xhr_handle_data_json( data ) 
//--------------------------------------
{
  //console.log( 'data =', data )
  document.getElementById('fileContents').innerHTML = JSON.stringify(data);
}

//--------------------------------------
  function xhr_read() 
//--------------------------------------
{
  var file = document.getElementById('userInput').value;
  xhr_read_json(file)
}
**/
