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
// define controls
// ----------------------------------------------------------------------------

let controls = '<table>' 
controls += '<tbody id="parts">' 
for( i in part)
{
  controls += '<tr>';
  //controls += '<td id="id_'+part[i]+'+" style="cursor:pointer" onclick="_onClick(event)">'+part[i]+'</td>';
  controls += '<td style="cursor:pointer">'+part[i]+'</td>';
  controls += '<td>';
  controls += '<input class="_'+part[i]+'" type="checkbox" checked />';
  controls += '</td>';
  controls += '</tr>';
}
controls += '</tbody>' 
controls += '</table>' 

fullScreenRenderer.addController(controls);

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

document.getElementById("parts").onclick = (e) =>
{
  let p = e.target.parentElement;
  let i = -1;
  let change = 0;
  if( e.target.nodeName === "TD"    ) change = 1;
  if( e.target.nodeName === "TD"    ) i = p.rowIndex; 
  if( e.target.nodeName === "INPUT" ) i = p.parentElement.rowIndex; 
  const s = '._'+part[i];
  const ele = document.querySelector(s);
  if( change ) ele.checked = !ele.checked;
  actor[i].setVisibility(ele.checked);
  render();
}
