// rxmodel.js

// 2018.09.29 added param_param

console.log('RxJS included?', !!Rx);
console.log('Ramda included?', !!R);

/**
const { Subject } = require('rxjs');
const { from } = require('rxjs');
const { map, filter, switchMap } = require('rxjs/operators');
const R = require('ramda');
**/

let g_stamp = 0
let g_next_mode = 1
let g_next_args = []
let g_ref_x = 12
let g_ref_y = 1.5
let g_ref_z = -49

let param0 = // design parameters
{ 
  C_x: [218, 0],
  C_y: [150, 0],
  T_w: [25.39, 0],
  T_h: [12.0, 0],
  T_d: [69.67, 0],
  H_d: [45.67, 0],
}

let param_param = // parameters of design parameters
{ 
  T_h_f: 1.0,
  T_d_f: 1.0,
  H_d_f: 1.0,
}

let data0 = // derived data, never explicitly set
{ 
  // tire locations
  LF_x: [0,0], LF_y: [0,0], 
  RF_x: [0,0], RF_y: [0,0], 
  LR_x: [0,0], LR_y: [0,0], 
  RR_x: [0,0], RR_y: [0,0], 
  // vehicle tire locations
  vLF_x: [0,0], vLF_y: [0,0],
  vRF_x: [0,0], vRF_y: [0,0], 
  vLR_x: [0,0], vLR_y: [0,0], 
  vRR_x: [0,0], vRR_y: [0,0], 
  // tire widths
  LF_w: [0,0], vLF_w: [0,0],
  RF_w: [0,0], vRF_w: [0,0],
  LR_w: [0,0], vLR_w: [0,0],
  RR_w: [0,0], vRR_w: [0,0],
  // tire centers
  T_z: [0,0],
  LF_z: [0,0], vLF_z: [0,0],
  RF_z: [0,0], vRF_z: [0,0],
  LR_z: [0,0], vLR_z: [0,0],
  RR_z: [0,0], vRR_z: [0,0],
  // tire diameters
  LF_d: [0,0], 
  RF_d: [0,0], 
  LR_d: [0,0], 
  RR_d: [0,0], 
  // tire side wall heights
  LF_h: [0,0], 
  RF_h: [0,0], 
  LR_h: [0,0], 
  RR_h: [0,0], 
}

const toObservableObject2 = targetObject => {
    const subject = new Rx.Subject();
    return new Proxy( targetObject, {
        set: (target, name, value) => {
            const oldValue = target[name];
            const newValue = value;
            if( typeof value === 'object' )
            {
              if( target[name][1] > value[1] )
              {
                console.log( 'name = ', name )
                throw 'stamp error'
              }
              else if( target[name][1] == value[1] )
              {
                // no-op
              }
              else
              {
                target[name] = value
                if( g_next_mode )    subject.next({ name, oldValue, newValue, target });
                else g_next_args.push({ subject: subject, arg: { name, oldValue, newValue, target }});
              }
            }
            else if( typeof value === 'number' )
            {
              if( g_next_mode == 1 )
              {
                target[name] = [value,++g_stamp]
                subject.next({ name, oldValue, newValue, target });
              }
              else
              {
                throw 'bad combo, probably need to send [value,stamp]'
              }
            }
            else
            {
              console.log( 'name = ', name )
              console.log( 'type = ',typeof value )
              throw 'need to send object'
            }
        },

        get: (target, name) => name == 'subject' ? subject : target[name]
    });
}

const param = toObservableObject2( param0 );
const data  = toObservableObject2( data0 );

f01 = {
  next: ({name, oldValue, newValue,target}) => {
    if( name == 'C_y' )
    {
      stamp = param.C_y[1]
      data.LF_y  = [g_ref_y + param.C_y[0]/2., stamp]
      data.RF_y  = [g_ref_y - param.C_y[0]/2., stamp]
      data.LR_y  = data.LF_y 
      data.RR_y  = data.RF_y
      data.vLF_y = data.LF_y
      data.vRF_y = data.RF_y
      data.vLR_y = data.LR_y
      data.vRR_y = data.RR_y
    }
  }
}

f02 = {
  next: ({name, oldValue, newValue,target}) => {
    if( name == 'T_w' )
    {
      data.LF_w = param.T_w
      data.RF_w = param.T_w
      data.LR_w = param.T_w
      data.RR_w = param.T_w
      data.vLF_w = data.LF_w
      data.vRF_w = data.RF_w
      data.vLR_w = data.LR_w
      data.vRR_w = data.RR_w
    }
  }
}

f03 = {
  next: ({name, oldValue, newValue,target}) => {
    if( name == 'C_x' )
    {
      stamp = param.C_x[1]
      data.LF_x = [g_ref_x - param.C_x[0]/2., stamp]
      data.RF_x = data.LF_x
      data.LR_x = [g_ref_x + param.C_x[0]/2., stamp]
      data.RR_x = data.LR_x
      data.vLF_x = data.LF_x 
      data.vRF_x = data.RF_x 
      data.vLR_x = data.LR_x
      data.vRR_x = data.RR_x 
    }
  }
}

f04 = {
  next: ({name, oldValue, newValue,target}) => {
    if( name == 'T_z' )
    {
      data.LF_z = data.T_z
      data.RF_z = data.T_z
      data.LR_z = data.T_z
      data.RR_z = data.T_z
      data.vLF_z = data.LF_z
      data.vRF_z = data.RF_z
      data.vLR_z = data.LR_z
      data.vRR_z = data.RR_z
    }
  }
}

f05 = {
  next: ({name, oldValue, newValue,target}) => {
    if( name == 'T_d' )
    {
      stamp = param.T_d[1]
      data.LF_d = param.T_d
      data.RF_d = param.T_d
      data.LR_d = param.T_d
      data.RR_d = param.T_d
      data.T_z = [0.5*param.T_d[0] + g_ref_z, stamp]
    }
  }
}

f06 = {
  next: ({name, oldValue, newValue,target}) => {
    if( name == 'T_h' )
    {
      data.LF_h = param.T_h
      data.RF_h = param.T_h
      data.LR_h = param.T_h
      data.RR_h = param.T_h
    }
  }
}

function get_stamps( i, o )
{
  i_max = R.reduce( R.max,   0, R.pluck(1,i) )
  o_min = R.reduce( R.min, 1e6, R.pluck(1,o) )
  return [i_max,o_min]
}

function f_prep()
{
  g_next_args = []
  g_next_mode = 0
}

function f_exe()
{
  g_next_mode = 1
  for( a in g_next_args )
  {
    n = g_next_args[a]
    n['subject'].next( n['arg'] )
  }
}

f07 = {
  next: ({name, oldValue, newValue,target}) => {
    if( R.contains(name,['T_d']) )
    {
      inputs  = [ param.T_d ]
      outputs = [ param.T_h, param.H_d ]
      stamps  = get_stamps( inputs, outputs )
      if( stamps[0] > stamps[1] )
      {
        f_prep()
        F = param_param.T_d_f
        T = 0.5*param.T_d[0]
        S =     param.T_h[0]
        H = 0.5*param.H_d[0]
        phi = F*H + (F-1)*S
        S = (F  )*T - phi
        H = (1-F)*T + phi
        stamp = param.T_d[1] 
        for( let i of inputs ) i[1] = stamps[0] 
        param.T_h = [S,stamps[0]] 
        param.H_d = [2*H,stamps[0]]
        f_exe()
      }
    }
  }
}

f08 = {
  next: ({name, oldValue, newValue,target}) => {
    if( R.contains(name,['T_h']) )
    {
      inputs  = [ param.T_h ]
      outputs = [ param.T_d, param.H_d ]
      stamps  = get_stamps( inputs, outputs )
      if( stamps[0] > stamps[1] )
      {
        f_prep()
        F = param_param.T_h_f
        T = 0.5*param.T_d[0]
        S =     param.T_h[0]
        H = 0.5*param.H_d[0]
        phi = (1.-F)*H + F*T
        T = (1.-F)*S + phi
        H = (  -F)*S + phi
        stamp = param.T_h[1] 
        param.T_d = [2.*T,stamps[0]] 
        param.H_d = [2.*H,stamps[0]] 
        f_exe()
      }
    }
  }
}

f09 = {
  next: ({name, oldValue, newValue,target}) => {
    if( R.contains(name,['H_d']) )
    {
      inputs  = [ param.H_d ]
      outputs = [ param.T_d, param.T_h ]
      stamps  = get_stamps( inputs, outputs )
      if( stamps[0] > stamps[1] )
      {
        f_prep()
        F = param_param.H_d_f
        T = 0.5*param.T_d[0]
        S =     param.T_h[0]
        H = 0.5*param.H_d[0]
        phi = (1-F)*S + F*T
        T = (1-F)*H + phi
        S = ( -F)*H + phi
        stamp = param.H_d[1] 
        param.T_d = [2*T,stamp]
        param.T_h = [S,stamp]
        f_exe()
      }
    }
  }
}

param.subject.subscribe(f01);
param.subject.subscribe(f02);
param.subject.subscribe(f03);
 data.subject.subscribe(f04);
param.subject.subscribe(f05);
param.subject.subscribe(f06);
param.subject.subscribe(f07);
param.subject.subscribe(f08);
param.subject.subscribe(f09);

// check initial constraints
tol = 1.e-6
val = param0.T_d[0] - (param0.H_d[0] + 2*param0.T_h[0])
if( Math.abs(val) > tol ) throw "T_d,H_d,T_h contraint not met"

g_stamp++;
for( key in param0 ) {
   console.log(`key = ${key} value = ${param0[key]}`)
   param[key] = [param0[key][0],g_stamp]
}

function print()
{
  console.log( '---' )
  console.log( 'parameter C-x:', param.C_x )
  //console.log( 'parameter C-y:', param.C_y )
  //console.log( 'parameter T-w:', param.T_w )
  //console.log( 'parameter T-h:', param.T_h )
  //console.log( 'parameter H-d:', param.H_d )
  //console.log( 'parameter T-d:', param.T_d )
  console.log( 'RF,RR-xy: (%f,%f) (%f,%f)', data.vRF_x[0], data.vRF_y[0], data.vRR_x[0], data.vRR_y[0] )
  console.log( 'LF,LR-xy: (%f,%f) (%f,%f)', data.vLF_x[0], data.vLF_y[0], data.vLR_x[0], data.vLR_y[0] )
  //console.log( 'LF-z,LR-z,LR-z,RR-z: (%d,%d,%d,%d)', data.vLF_z[0], data.vRF_z[0], data.vLR_z[0], data.vRR_z[0] )
  //console.log( 'LF-w,LR-w,LR-w,RR-w: (%d,%d,%d,%d)', data.vLF_w[0], data.vRF_w[0], data.vLR_w[0], data.vRR_w[0] )
  //console.log( 'LF-d,LR-d,LR-d,RR-d: (%d,%d,%d,%d)', data.LF_d[0], data.RF_d[0], data.LR_d[0], data.RR_d[0] )
  //console.log( 'LF-h,LR-h,LR-h,RR-h: (%d,%d,%d,%d)', data.LF_h[0], data.RF_h[0], data.LR_h[0], data.RR_h[0] )
  //console.log( '---' )
}
print()
//param.C_x = [7,++g_stamp]; console.log('parameter C-x was set to %d', param.C_x[0] ); print()
//param.C_y = [3,++g_stamp]; console.log('parameter C-y was set to %d', param.C_y[0] ); print()
//param.T_w = [0.11,++g_stamp]; console.log('parameter T-w was set to %d', param.T_w[0] ); print()

//param.T_h = 0.3; console.log('parameter T-h was set to %f', param.T_h[0] ); print()
//param_param.T_d_f = 0.5; console.log('param_param T-d-bf was set to %f', param_param.T_d_f ); print()
//param.T_d = 2.11; console.log('parameter T-d was set to %f', param.T_d[0] ); print()
//param.H_d = 1.0; console.log('parameter H-d was set to %f', param.H_d[0] ); print()
//param.H_d = 2.0; console.log('parameter H-d was set to %f', param.H_d[0] ); print()

//console.log( param )
//console.log( data )

function morph_tires()
{
  var geom = g_part['tire-1'].mesh.geometry.clone()

  w0 = 25.39 
  w1 = param.T_w[0]/w0

  geom.scale(1,1,w1)

  r0 = param.H_d[0]/2
  r1 = param.T_d[0]/2
  vec = geom.attributes.position.array
  cnt = geom.attributes.position.count
  radii = g_part['tire-1'].radii
  for( i=0; i < cnt; i++ ) 
  {
    x = vec[i*3+0]
    y = vec[i*3+1]
    m = Math.sqrt( x*x + y*y )
    x /= m
    y /= m
    r = r0 + radii[i] * (r1-r0)
    vec[i*3+0] = r*x
    vec[i*3+1] = r*y
  }

  g_part['tire_lf'].mesh.geometry = geom.clone()
  g_part['tire_rf'].mesh.geometry = geom.clone()
  g_part['tire_lr'].mesh.geometry = geom.clone()
  g_part['tire_rr'].mesh.geometry = geom.clone()

  g_part['tire_lf'].mesh.geometry.rotateX( THREE.Math.degToRad(  90 ) )
  g_part['tire_rf'].mesh.geometry.rotateX( THREE.Math.degToRad( -90 ) )
  g_part['tire_lr'].mesh.geometry.rotateX( THREE.Math.degToRad(  90 ) )
  g_part['tire_rr'].mesh.geometry.rotateX( THREE.Math.degToRad( -90 ) )
}

function morph_wheels()
{
  var geom = g_part['wheel-1'].mesh.geometry.clone()

  w0 = 25.39 
  w1 = param.T_w[0]/w0
  d0 = 45.67 
  d1 = param.H_d[0]/d0

  geom.scale(d1,d1,w1)

  g_part['wheel_lf'].mesh.geometry = geom.clone()
  g_part['wheel_rf'].mesh.geometry = geom.clone()
  g_part['wheel_lr'].mesh.geometry = geom.clone()
  g_part['wheel_rr'].mesh.geometry = geom.clone()

  g_part['wheel_lf'].mesh.geometry.rotateX( THREE.Math.degToRad(  90 ) )
  g_part['wheel_rf'].mesh.geometry.rotateX( THREE.Math.degToRad( -90 ) )
  g_part['wheel_lr'].mesh.geometry.rotateX( THREE.Math.degToRad(  90 ) )
  g_part['wheel_rr'].mesh.geometry.rotateX( THREE.Math.degToRad( -90 ) )
}

function translate_tires()
{
  g_part['tire_lf'].mesh.position.x = data.vLF_x[0]
  g_part['tire_lf'].mesh.position.y = data.vLF_y[0]
  g_part['tire_lf'].mesh.position.z = data.vLF_z[0]
  g_part['tire_rf'].mesh.position.x = data.vRF_x[0]
  g_part['tire_rf'].mesh.position.y = data.vRF_y[0]
  g_part['tire_rf'].mesh.position.z = data.vRF_z[0]
  g_part['tire_lr'].mesh.position.x = data.vLR_x[0]
  g_part['tire_lr'].mesh.position.y = data.vLR_y[0]
  g_part['tire_lr'].mesh.position.z = data.vLR_z[0]
  g_part['tire_rr'].mesh.position.x = data.vRR_x[0]
  g_part['tire_rr'].mesh.position.y = data.vRR_y[0]
  g_part['tire_rr'].mesh.position.z = data.vRR_z[0]

  g_part['wheel_lf'].mesh.position.x = data.vLF_x[0]
  g_part['wheel_lf'].mesh.position.y = data.vLF_y[0]
  g_part['wheel_lf'].mesh.position.z = data.vLF_z[0]
  g_part['wheel_rf'].mesh.position.x = data.vRF_x[0]
  g_part['wheel_rf'].mesh.position.y = data.vRF_y[0]
  g_part['wheel_rf'].mesh.position.z = data.vRF_z[0]
  g_part['wheel_lr'].mesh.position.x = data.vLR_x[0]
  g_part['wheel_lr'].mesh.position.y = data.vLR_y[0]
  g_part['wheel_lr'].mesh.position.z = data.vLR_z[0]
  g_part['wheel_rr'].mesh.position.x = data.vRR_x[0]
  g_part['wheel_rr'].mesh.position.y = data.vRR_y[0]
  g_part['wheel_rr'].mesh.position.z = data.vRR_z[0]
}

function create_param_slider(o)
{
  var container = document.getElementById('param_'+o.dv);

  var label = document.createElement('label')
      label.innerHTML = o.description

  var br = document.createElement('br')

  var slider = document.createElement('input');
      slider.type = 'range'
      slider.id = o.dv + "_slider"
      slider.min = o.min
      slider.max = o.max
      slider.step = o.step
      slider.value = o.value
      slider.oninput = o.oninput()

  var em = document.createElement('em');
      em.id = o.dv + "_label"
      em.style = "font-style: normal"
      em.innerHTML = o.value

  container.appendChild(label);
  container.appendChild(br);
  container.appendChild(slider);
  container.appendChild(em);
}

// create slider elements

create_param_slider({
  dv: 'C_x',
  description: 'Tire contact point length',
  value: param.C_x[0],
  min: 150,
  max: 300,
  step: 10,
  oninput: function()
  {
    return function() 
    { 
      param.C_x = parseFloat(this.value);
      document.getElementById('C_x_label').innerHTML = param.C_x[0]
      translate_tires()
      g_renderer.render( g_scene, g_camera );
    }
  },
})

create_param_slider({
  dv: 'C_y',
  description: 'Tire contact point width',
  value: param.C_y[0],
  min: 100,
  max: 250,
  step: 10,
  oninput: function()
  {
    return function() 
    { 
      param.C_y = parseFloat(this.value);
      document.getElementById('C_y_label').innerHTML = param.C_y[0]
      translate_tires()
      g_renderer.render( g_scene, g_camera );
    }
  },
})

create_param_slider({
  dv: 'T_w',
  description: 'Tire width',
  value: param.T_w[0],
  min: 10,
  max: 50,
  step: 2,
  oninput: function()
  {
    return function() 
    { 
      param.T_w = parseFloat(this.value);
      document.getElementById('T_w_label').innerHTML = param.T_w[0]
      morph_tires()
      morph_wheels()
      translate_tires()
      g_renderer.render( g_scene, g_camera );
    }
  },
})

create_param_slider({
  dv: 'T_d',
  description: 'Tire diameter',
  value: param.T_d[0],
  min: 40,
  max: 100,
  step: 5,
  oninput: function()
  {
    return function() 
    { 
      param.T_d = parseFloat(this.value);
      document.getElementById('T_d_label').innerHTML = param.T_d[0]
      document.getElementById('T_h_label').innerHTML = param.T_h[0]
      document.getElementById('H_d_label').innerHTML = param.H_d[0]
      document.getElementById('T_h_slider').value = param.T_h[0]
      document.getElementById('H_d_slider').value = param.H_d[0]
      morph_tires()
      morph_wheels()
      translate_tires()
      g_renderer.render( g_scene, g_camera );
    }
  },
})

create_param_slider({
  dv: 'T_d_f',
  description: 'Hub diameter blend factor',
  value: param_param.T_d_f,
  min: 0,
  max: 1,
  step: 0.1,
  oninput: function()
  {
    return function() 
    { 
      param_param.T_d_f = parseFloat(this.value);
      document.getElementById('T_d_f_label').innerHTML = param_param.T_d_f
    }
  },
})

create_param_slider({
  dv: 'H_d',
  description: 'Hub diameter',
  value: param.H_d[0],
  min: 10,
  max: 70,
  step: 5,
  oninput: function()
  {
    return function() 
    { 
      param.H_d = parseFloat(this.value);
      document.getElementById('H_d_label').innerHTML = param.H_d[0]
      document.getElementById('T_h_label').innerHTML = param.T_h[0]
      document.getElementById('T_d_label').innerHTML = param.T_d[0]
      document.getElementById('T_h_slider').value = param.T_h[0]
      document.getElementById('T_d_slider').value = param.T_d[0]
      morph_tires()
      morph_wheels()
      translate_tires()
      g_renderer.render( g_scene, g_camera );
    }
  },
})

create_param_slider({
  dv: 'H_d_f',
  description: 'Hub diameter blend factor',
  value: param_param.H_d_f,
  min: 0,
  max: 1,
  step: 0.1,
  oninput: function()
  {
    return function() 
    { 
      param_param.H_d_f = parseFloat(this.value);
      document.getElementById('H_d_f_label').innerHTML = param_param.H_d_f
    }
  },
})

create_param_slider({
  dv: 'T_h',
  description: 'Tire sidewall height',
  value: param.T_h[0],
  min: 3,
  max: 20,
  step: 2,
  oninput: function()
  {
    return function() 
    { 
      param.T_h = parseFloat(this.value);
      document.getElementById('T_h_label').innerHTML = param.T_h[0]
      document.getElementById('H_d_label').innerHTML = param.H_d[0]
      document.getElementById('T_d_label').innerHTML = param.T_d[0]
      document.getElementById('H_d_slider').value = param.H_d[0]
      document.getElementById('T_d_slider').value = param.T_d[0]
      morph_tires()
      morph_wheels()
      translate_tires()
      g_renderer.render( g_scene, g_camera );
    }
  },
})

create_param_slider({
  dv: 'T_h_f',
  description: 'Tire sidewall height blend factor',
  value: param_param.T_h_f,
  min: 0,
  max: 1,
  step: 0.1,
  oninput: function()
  {
    return function() 
    { 
      param_param.T_h_f = parseFloat(this.value);
      document.getElementById('T_h_f_label').innerHTML = param_param.T_h_f
    }
  },
})
