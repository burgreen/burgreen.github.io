// frog/reader.js

console.log('Three-js included?', !!THREE);

if( WEBGL.isWebGLAvailable() === false ) 
{
  document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}

// ----------------------------------------------------------------------------
// parts to load
// ----------------------------------------------------------------------------

const g_parts = []
{
  g_parts.push('body2')
  g_parts.push('body')
  /*
  g_parts.push('glass')
  g_parts.push('grill')
  g_parts.push('interior')
  g_parts.push('suspension')
  g_parts.push('snorkle')
  g_parts.push('nozzles')
  g_parts.push('waterjet')
  g_parts.push('exhaust')
  g_parts.push('engine')
  g_parts.push('brakes')
  g_parts.push('tires')
  g_parts.push('wheels')
  */
  g_parts.push('transmission')
}

const g_parts_ref = []
{
  g_parts_ref.push('wheel-1')
  g_parts_ref.push('tire-1')
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

let g_part = {}

let g_color = {}
g_color.r = 0.2
g_color.g = 0.3
g_color.b = 0.4

var g_vehicle_ref_x = 12
var g_vehicle_ref_y = 1.5
var g_vehicle_ref_z = -49
var g_vehicle_dx    = 218
var g_vehicle_dy    = 150
var g_vehicle_dz    = 69/2.

function load_geom( name )
{
  var file = "data/" + name + ".stl"
  g_loader.load(file, function (geometry) {
    geometry.computeBoundingBox()
    var mesh = new THREE.Mesh( geometry, g_material );
    g_scene.add(mesh);
    view_scene( g_scene )
    g_part[name] = {}
    g_part[name].mesh = mesh
    g_part[name].bbox = geometry.boundingBox
  });
}

function load_geom_ref( name )
{
  var file = "data/" + name + ".stl"
  g_loader.load(file, function (geometry) {
    geometry.computeBoundingBox()
    var mesh = new THREE.Mesh( geometry, g_material );
    g_part[name] = {}
    g_part[name].mesh = mesh
    g_part[name].bbox = geometry.boundingBox
    if( name === "tire-1" ) make_tires()
    if( name === "tire-1" ) compute_radii('tire-1')
    if( name === "wheel-1" ) make_wheels()
  });
}

function compute_radii(name)
{
  vec = g_part[name].mesh.geometry.attributes.position.array
  cnt = g_part[name].mesh.geometry.attributes.position.count
  r = []
  for( i=0; i < cnt; i++ ) 
  {
    x = vec[i*3+0]
    y = vec[i*3+1]
    z = vec[i*3+2]
    r.push( Math.sqrt( x*x + y*y ) )
  }
  r_min = R.reduce( R.min, +10000, r )
  r_max = R.reduce( R.max, -10000, r )
  g_part[name].radii = R.map( x => (x-r_min)/(r_max-r_min), r )
}

function make_tires()
{
  geom = g_part['tire-1'].mesh.geometry
  var tire_lf = new THREE.Mesh( geom.clone(), g_material );
  var tire_rf = new THREE.Mesh( geom.clone(), g_material );
  var tire_lr = new THREE.Mesh( geom.clone(), g_material );
  var tire_rr = new THREE.Mesh( geom.clone(), g_material );
  g_scene.add(tire_lf);
  g_scene.add(tire_rf);
  g_scene.add(tire_lr);
  g_scene.add(tire_rr);
  g_part['tire_lf'] = {}
  g_part['tire_rf'] = {}
  g_part['tire_lr'] = {}
  g_part['tire_rr'] = {}
  g_part['tire_lf'].mesh = tire_lf
  g_part['tire_rf'].mesh = tire_rf
  g_part['tire_lr'].mesh = tire_lr
  g_part['tire_rr'].mesh = tire_rr
  init_tires()
  view_scene( g_scene )
}

function init_tires()
{
  g_part['tire_lf'].mesh.geometry.rotateX( THREE.Math.degToRad(  90. ) )
  g_part['tire_rf'].mesh.geometry.rotateX( THREE.Math.degToRad( -90 ) )
  g_part['tire_lr'].mesh.geometry.rotateX( THREE.Math.degToRad(  90 ) )
  g_part['tire_rr'].mesh.geometry.rotateX( THREE.Math.degToRad( -90 ) )

  g_part['tire_lf'].mesh.position.x = g_vehicle_ref_x - g_vehicle_dx/2.
  g_part['tire_lf'].mesh.position.y = g_vehicle_ref_y - g_vehicle_dy/2.
  g_part['tire_lf'].mesh.position.z = g_vehicle_ref_z + g_vehicle_dz
  g_part['tire_rf'].mesh.position.x = g_vehicle_ref_x - g_vehicle_dx/2.
  g_part['tire_rf'].mesh.position.y = g_vehicle_ref_y + g_vehicle_dy/2.
  g_part['tire_rf'].mesh.position.z = g_vehicle_ref_z + g_vehicle_dz
  g_part['tire_lr'].mesh.position.x = g_vehicle_ref_x + g_vehicle_dx/2.
  g_part['tire_lr'].mesh.position.y = g_vehicle_ref_y - g_vehicle_dy/2.
  g_part['tire_lr'].mesh.position.z = g_vehicle_ref_z + g_vehicle_dz
  g_part['tire_rr'].mesh.position.x = g_vehicle_ref_x + g_vehicle_dx/2.
  g_part['tire_rr'].mesh.position.y = g_vehicle_ref_y + g_vehicle_dy/2.
  g_part['tire_rr'].mesh.position.z = g_vehicle_ref_z + g_vehicle_dz
}

function init_wheels()
{
  g_part['wheel_lf'].mesh.geometry.rotateX( THREE.Math.degToRad(  90. ) )
  g_part['wheel_rf'].mesh.geometry.rotateX( THREE.Math.degToRad( -90 ) )
  g_part['wheel_lr'].mesh.geometry.rotateX( THREE.Math.degToRad(  90 ) )
  g_part['wheel_rr'].mesh.geometry.rotateX( THREE.Math.degToRad( -90 ) )

  g_part['wheel_lf'].mesh.position.x = g_vehicle_ref_x - g_vehicle_dx/2.
  g_part['wheel_lf'].mesh.position.y = g_vehicle_ref_y - g_vehicle_dy/2.
  g_part['wheel_lf'].mesh.position.z = g_vehicle_ref_z + g_vehicle_dz
  g_part['wheel_rf'].mesh.position.x = g_vehicle_ref_x - g_vehicle_dx/2.
  g_part['wheel_rf'].mesh.position.y = g_vehicle_ref_y + g_vehicle_dy/2.
  g_part['wheel_rf'].mesh.position.z = g_vehicle_ref_z + g_vehicle_dz
  g_part['wheel_lr'].mesh.position.x = g_vehicle_ref_x + g_vehicle_dx/2.
  g_part['wheel_lr'].mesh.position.y = g_vehicle_ref_y - g_vehicle_dy/2.
  g_part['wheel_lr'].mesh.position.z = g_vehicle_ref_z + g_vehicle_dz
  g_part['wheel_rr'].mesh.position.x = g_vehicle_ref_x + g_vehicle_dx/2.
  g_part['wheel_rr'].mesh.position.y = g_vehicle_ref_y + g_vehicle_dy/2.
  g_part['wheel_rr'].mesh.position.z = g_vehicle_ref_z + g_vehicle_dz
}

function make_wheels()
{
  geom = g_part['wheel-1'].mesh.geometry
  var wheel_lf = new THREE.Mesh( geom.clone(), g_material );
  var wheel_rf = new THREE.Mesh( geom.clone(), g_material );
  var wheel_lr = new THREE.Mesh( geom.clone(), g_material );
  var wheel_rr = new THREE.Mesh( geom.clone(), g_material );
  g_scene.add(wheel_lf);
  g_scene.add(wheel_rf);
  g_scene.add(wheel_lr);
  g_scene.add(wheel_rr);
  g_part['wheel_lf'] = {}
  g_part['wheel_rf'] = {}
  g_part['wheel_lr'] = {}
  g_part['wheel_rr'] = {}
  g_part['wheel_lf'].mesh = wheel_lf
  g_part['wheel_rf'].mesh = wheel_rf
  g_part['wheel_lr'].mesh = wheel_lr
  g_part['wheel_rr'].mesh = wheel_rr
  init_wheels()
  view_scene( g_scene )
  g_renderer.render( g_scene, g_camera );
}

function sceneBoundingBox( scene )
{
  var bb = new THREE.Box3()
  g_scene.traverse( function( node ) {
    if( node instanceof THREE.Mesh ) bb.expandByObject( node )
  });
  return bb;
}

function viewBoundingBox( box, camera )
{
  var verbose = 0
  if( box.isEmpty() ) console.log("scene empty")
  if( box.isEmpty() ) return;
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

function view_scene( scene )
{
  bb = sceneBoundingBox( scene )
  viewBoundingBox( bb, g_camera )
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

  for( i in g_parts ) load_geom( g_parts[i] )
  for( i in g_parts_ref ) load_geom_ref( g_parts_ref[i] )

  g_headlight = new THREE.DirectionalLight( 0xffffff );
  g_headlight.position.copy( g_camera.position )
  g_scene.add( g_headlight );

  var light = new THREE.AmbientLight( 0xffffff );
  g_scene.add( light );

  //g_stats = new Stats();
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
function create_checkboxes(parts) 
{
  var container = document.getElementById('checkboxes');
  var dl = document.createElement('dl');
      dl.id = "checkboxes_dl"

  var dt = document.createElement('dt')
      dt.innerHTML = "Part visibility"

  dl.appendChild(dt)

  for (var i = 0; i < parts.length; i++) 
  {
    var part = parts[i];
    console.log(part);

    var dd = document.createElement('dd')

    var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = "chk" + parts[i]
        checkbox.name = "chk" + parts[i]
        checkbox.value = "value";
        checkbox.checked = true;
        checkbox.onclick = function(data) 
        {
          return function() 
          { 
            //console.log(data); 
            checked = document.getElementById("chk"+data).checked
            g_part[data].mesh.visible = checked
            g_renderer.render( g_scene, g_camera );
          };
        }(part)

    var label = document.createElement('label')
        label.htmlFor = "chk" + parts[i]
        label.appendChild(document.createTextNode(parts[i]));

    dd.appendChild(checkbox)
    dd.appendChild(label)
    dl.appendChild(dd)
  }
  container.appendChild(dl);
}

function create_checkboxes_tires() 
{
    var dl = document.getElementById('checkboxes_dl');

    var dd = document.createElement('dd')

    var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = "chk_tires"
        checkbox.name = "chk_tires"
        checkbox.value = "value";
        checkbox.checked = true;
        checkbox.onclick = function() 
        { 
          checked = document.getElementById("chk_tires").checked
          g_part['tire_lf'].mesh.visible = checked
          g_part['tire_rf'].mesh.visible = checked
          g_part['tire_lr'].mesh.visible = checked
          g_part['tire_rr'].mesh.visible = checked
          g_renderer.render( g_scene, g_camera );
        };

    var label = document.createElement('label')
        label.htmlFor = "chk_tires"
        label.appendChild(document.createTextNode("tires"));

    dd.appendChild(checkbox)
    dd.appendChild(label)
    dl.appendChild(dd)
}

function create_checkboxes_wheels() 
{
    var dl = document.getElementById('checkboxes_dl');

    var dd = document.createElement('dd')

    var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = "chk_wheels"
        checkbox.name = "chk_wheels"
        checkbox.value = "value";
        checkbox.checked = true;
        checkbox.onclick = function() 
        { 
          checked = document.getElementById("chk_wheels").checked
          g_part['wheel_lf'].mesh.visible = checked
          g_part['wheel_rf'].mesh.visible = checked
          g_part['wheel_lr'].mesh.visible = checked
          g_part['wheel_rr'].mesh.visible = checked
          g_renderer.render( g_scene, g_camera );
        };

    var label = document.createElement('label')
        label.htmlFor = "chk_wheels"
        label.appendChild(document.createTextNode("wheels"));

    dd.appendChild(checkbox)
    dd.appendChild(label)
    dl.appendChild(dd)
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
// create elements
// ----------------------------------------------------------------------------

create_checkboxes(g_parts)
create_checkboxes_wheels()
create_checkboxes_tires()
create_color('r',g_color.r)
create_color('g',g_color.g)
create_color('b',g_color.b)
init();
animate();
