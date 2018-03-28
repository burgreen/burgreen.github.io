// frog-reader2.js

//import 'vtk.js/Sources/favicon';
//import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
//import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
//import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
//import vtkSTLReader from 'vtk.js/Sources/IO/Geometry/STLReader';

// ----------------------------------------------------------------------------
// main objects
// ----------------------------------------------------------------------------

const reader = vtk.IO.Geometry.vtkSTLReader.newInstance();
const mapper = vtk.Rendering.Core.vtkMapper.newInstance({ scalarVisibility: false });
const actor = vtk.Rendering.Core.vtkActor.newInstance();

const reader2 = vtk.IO.Geometry.vtkSTLReader.newInstance();
const mapper2 = vtk.Rendering.Core.vtkMapper.newInstance({ scalarVisibility: false });
const actor2 = vtk.Rendering.Core.vtkActor.newInstance();

actor.setMapper(mapper);
mapper.setInputConnection(reader.getOutputPort());

actor2.setMapper(mapper2);
mapper2.setInputConnection(reader2.getOutputPort());


// ----------------------------------------------------------------------------

function update() 
{
  const fullScreenRenderer = vtk.Rendering.Misc.vtkFullScreenRenderWindow.newInstance();
  const renderer = fullScreenRenderer.getRenderer();
  const renderWindow = fullScreenRenderer.getRenderWindow();

  const resetCamera = renderer.resetCamera;
  const render = renderWindow.render;

  renderer.addActor(actor);
  renderer.addActor(actor2);
  resetCamera();
  render();
}

// ----------------------------------------------------------------------------
// Use a file reader to load a local file
// ----------------------------------------------------------------------------

/*
const myContainer = document.querySelector('body');
const fileContainer = document.createElement('div');
fileContainer.innerHTML = '<input type="file" class="file"/>';
myContainer.appendChild(fileContainer);

const fileInput = fileContainer.querySelector('input');

function handleFile(event) {
  event.preventDefault();
  const dataTransfer = event.dataTransfer;
  const files = event.target.files || dataTransfer.files;
  if (files.length === 1) {
    myContainer.removeChild(fileContainer);
    const fileReader = new FileReader();
    fileReader.onload = function onLoad(e) {
      reader.parseBinary(fileReader.result);
      update();
    };
    fileReader.readAsArrayBuffer(files[0]);
  }
}

fileInput.addEventListener('change', handleFile);
*/

// ----------------------------------------------------------------------------
// Use the reader to download a file
// ----------------------------------------------------------------------------

  //reader.setUrl(`${__BASE_PATH__}/data/stl/segmentation.stl`, { binary: true }).then(update);
  //reader.setUrl(`frog/wheels.stl`, { binary: true }).then(update);
  //reader2.setUrl(`frog/body.stl`, { binary: true }).then(update);
reader.setUrl(`wheels.stl`, { binary: true })
.then(
  reader2.setUrl(`body.stl`, { binary: true })
  .then(
    update
  )
);