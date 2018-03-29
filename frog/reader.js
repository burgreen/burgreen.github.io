// frog/reader.js

// ----------------------------------------------------------------------------
// parts to load
// ----------------------------------------------------------------------------

const part = []
{
  part.push('body')
  part.push('wheels')
}

// ----------------------------------------------------------------------------
// define controls
// ----------------------------------------------------------------------------

let controls = '<table>' 
for( i in part)
{
  controls += '<tr>';
  controls += '<td>'+part[i]+'</td>';
  controls += '<td>';
  controls += '<input class="_'+part[i]+'" type="checkbox" checked />';
  controls += '</td>';
  controls += '</tr>';
}
controls += '</table>' 

// ----------------------------------------------------------------------------
// main objects
// ----------------------------------------------------------------------------

const reader = []
const mapper = []
const actor = []
for( i in part )
{
  reader.push( vtk.IO.Geometry.vtkSTLReader.newInstance() );
  mapper.push( vtk.Rendering.Core.vtkMapper.newInstance({ scalarVisibility: false }) );
  actor.push(  vtk.Rendering.Core.vtkActor.newInstance() );
  actor[i].setMapper( mapper[i] );
  mapper[i].setInputConnection( reader[i].getOutputPort() );
}

const fullScreenRenderer = vtk.Rendering.Misc.vtkFullScreenRenderWindow.newInstance();
const renderer = fullScreenRenderer.getRenderer();
const renderWindow = fullScreenRenderer.getRenderWindow();

const resetCamera = renderer.resetCamera;
const render = renderWindow.render;

fullScreenRenderer.addController(controls);

function update() 
{
  for( i in actor )
  {
    let a = actor[i];
    renderer.addActor(a);
  }
  resetCamera();
  render();
}

// ----------------------------------------------------------------------------
// load parts and display
// ----------------------------------------------------------------------------

const promises = []
for( i in part )
{
  promises.push( reader[i].setUrl('data/'+part[i]+'.stl', { binary: true }) );
}
Promise.all(promises).then( update );

// ----------------------------------------------------------------------------
// add control actions
// ----------------------------------------------------------------------------

for( i in part )
{
  const s = '._'+part[i];
  const a = actor[i];
  document.querySelector(s).addEventListener('change', (e) => {
    a.setVisibility(!!e.target.checked);
    render();
  });
}

