// frog/reader.js

if( WEBGL.isWebGLAvailable() === false ) {
  document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}

// ----------------------------------------------------------------------------
// parts to load
// ----------------------------------------------------------------------------

const part = []
{
  part.push('glass')
  part.push('grill')
  part.push('body2')
  part.push('body')
  part.push('interior')
  part.push('suspension')
  part.push('snorkle')
  part.push('nozzles')
  part.push('waterjet')
  part.push('exhaust')
  part.push('engine')
  part.push('brakes')
  part.push('transmission')
  part.push('wheels')
  part.push('tires')
}

// ----------------------------------------------------------------------------
// main objects
// ----------------------------------------------------------------------------


const g_camera   = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
const g_scene    = new THREE.Scene();
const g_renderer = new THREE.WebGLRenderer( { antialias: true } );
const g_loader   = new THREE.STLLoader();
var   g_controls 
var   g_stats
var   g_headlight

const g_material = new THREE.MeshPhongMaterial({ 
      color: 0x666666, 
      flatShading: false,
      side: THREE.DoubleSide,
});

let g_partDict = {}
let g_color = {}

function load_geom( name )
{
  var file = "data/" + name + ".stl"
  g_loader.load(file, function (geometry) {
    var mesh = new THREE.Mesh( geometry, g_material );
    g_scene.add(mesh);
    view_scene( g_scene )
    g_partDict[name] = {}
    g_partDict[name].mesh = mesh
  });
}

function sceneBoundingBox( scene )
{
  var bb = new THREE.Box3()
  g_scene.traverse( function( node ) {
    if ( node instanceof THREE.Mesh ) {
        // insert your code here, for example:
        //node.material = new THREE.MeshNormalMaterial()
        bb.expandByObject( node )
    }
  } );
  return bb;
}

function view_scene( scene )
{
  bb = sceneBoundingBox( scene )
  viewBoundingBox( bb, g_camera )
}

function viewBoundingBox( box, camera )
{
  if( box.isEmpty() ) console.log("scene empty")
  if( box.isEmpty() ) return;
  var verbose = 0
  var size = new THREE.Vector3(); box.getSize(size)
  var ctr  = new THREE.Vector3(); box.getCenter(ctr)
  var dir  = new THREE.Vector3(); camera.getWorldDirection(dir)
  if(verbose) console.log('bb:', box, box.getCenter( new THREE.Vector3() ) )
  if(verbose) console.log('bb:', size )
  var fov = camera.fov * ( Math.PI / 180 );
  var distance = Math.abs( size.length() / Math.sin( fov / 2 ) );
  distance *= 1.0
  if(verbose) console.log('distance:', distance )
  if(verbose) console.log('dir:', dir )
  var pos = ctr.add( dir.multiplyScalar(-distance) )
  if(verbose) console.log('cam.pos:', camera.position )
  if(verbose) console.log('pos:', pos )
  camera.position.copy(pos)
  if(verbose) console.log('cam.pos:', camera.position )
  if(verbose) console.log('far:', camera.far )
  camera.far = 2*distance
  if(verbose) console.log('far:', camera.far )
  camera.updateProjectionMatrix()
}

function init() 
{
  g_renderer.setPixelRatio( window.devicePixelRatio );
  g_renderer.setSize( 0.65 *window.innerWidth, 0.65*window.innerHeight );
  //document.body.appendChild( g_renderer.domElement );
  document.getElementById("MyScene").appendChild( g_renderer.domElement );

  g_controls = new THREE.TrackballControls( g_camera, g_renderer.domElement );
  g_controls.rotateSpeed = 2.5;
  g_controls.zoomSpeed = -2.2;
  g_controls.panSpeed = 0.8;
  g_controls.noZoom = false;
  g_controls.noPan = false;
  g_controls.staticMoving = true;
  g_controls.dynamicDampingFactor = 0.3;
  g_controls.keys = [ 65, 83, 68 ];
  g_controls.addEventListener( 'change', render );

  g_scene.background = new THREE.Color( 0xcccccc );
  g_scene.background = new THREE.Color( 0x000000 );
  g_scene.background.setRGB(0.2,0.3,0.4)

  for( i in part ) load_geom( part[i] )

  g_headlight = new THREE.DirectionalLight( 0xffffff );
  g_headlight.position.copy( g_camera.position )
  g_scene.add( g_headlight );

  var light = new THREE.AmbientLight( 0xffffff );
  g_scene.add( light );


  g_stats = new Stats();
  //document.body.appendChild( g_stats.dom );

  window.addEventListener( 'resize', onWindowResize, false );

  render();
}

function onWindowResize() 
{
  g_camera.aspect = window.innerWidth / window.innerHeight;
  g_camera.updateProjectionMatrix();

  g_renderer.setSize( 0.65*window.innerWidth, 0.65*window.innerHeight );

  g_controls.handleResize();

  render();
}

function animate() 
{
  requestAnimationFrame( animate );
  g_controls.update();
}

function render() 
{
  g_headlight.position.copy( g_camera.position )
  g_renderer.render( g_scene, g_camera );
  //g_stats.update();
}

// ----------------------------------------------------------------------------
// define gui controls
// ----------------------------------------------------------------------------

/*
 <dl id="checkboxes1">
        <dt>same label or term</dt>
        <dd><input type="checkbox" id="chk1" /><label for="chk1">checkbox 1</label></dd>
        <dd><input type="checkbox" id="chk2" /><label for="chk2">checkbox 2</label></dd>
        <dd><input type="checkbox" id="chk3" /><label for="chk3">checkbox 3</label></dd>
        <dd><input type="checkbox" id="chk4" /><label for="chk4">checkbox 4</label></dd>
  </dl>
*/
function create_checkboxes(markerGroups) 
{
  var container = document.getElementById('checkboxes');
  var dl = document.createElement('dl');

  var dt = document.createElement('dt')
      dt.innerHTML = "Part visibility"

  dl.appendChild(dt)

  for (var i = 0; i < markerGroups.length; i++) 
  {
    var dataTypeId1 = markerGroups[i];
    console.log(dataTypeId1);

    var dd = document.createElement('dd')

    var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = "chk" + markerGroups[i]
        checkbox.name = "chk" + markerGroups[i]
        checkbox.value = "value";
        checkbox.checked = true;
        checkbox.onclick = function(dataType) 
        {
          return function () 
          { 
            //console.log(dataType); 
            checked = document.getElementById("chk"+dataType).checked
            g_partDict[dataType].mesh.visible = checked
            g_renderer.render( g_scene, g_camera );
          };
        }(dataTypeId1)

    var label = document.createElement('label')
        label.htmlFor = "chk" + markerGroups[i]
        label.appendChild(document.createTextNode(markerGroups[i]));

    dd.appendChild(checkbox)
    dd.appendChild(label)
    dl.appendChild(dd)
  }
  container.appendChild(dl);
}

/*
<div>
    <label for="color_g">color_g:</label>
    <input type ="range" min="0" max="1" step="0.1" value="0.3"
        oninput=
        "
          color_g = this.value;
          document.getElementById('color_g_label').innerHTML = color_g;
          g_scene.background.setRGB(color_r, color_g, color_b );
          g_renderer.render( g_scene, g_camera );
        "
        name="color_g" id="color_g">
    </input>
    <em id="color_g_label" style="font-style: normal;"></em>
</div>
*/
function create_color(x,value) 
{
  var name = 'color_' + x
  console.log( name )
  var container = document.getElementById(name);

  var label = document.createElement('label')
      label.innerHTML = name + ":"

  var slider = document.createElement('input');
      slider.type = 'range'
      slider.min = '0'
      slider.max = '1'
      slider.step = '0.1'
      slider.value = value
      slider.oninput = function() 
      { 
        g_color[x] = this.value;
        document.getElementById(name+'_label').innerHTML = g_color[x];
        g_scene.background.setRGB(g_color.r, g_color.g, g_color.b );
        g_renderer.render( g_scene, g_camera );
      }

  var em = document.createElement('em');
      em.id = name + "_label"
      em.style = "font-style: normal"
      em.innerHTML = value

  container.appendChild(label);
  container.appendChild(slider);
  container.appendChild(em);
}


// ----------------------------------------------------------------------------
// display
// ----------------------------------------------------------------------------

create_checkboxes(part)
create_color('r',0.2)
create_color('g',0.3)
create_color('b',0.4)
init();
animate();
