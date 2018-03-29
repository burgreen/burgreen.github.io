  // simple-cone.js code
  
  var fullScreenRenderer = vtk.Rendering.Misc.vtkFullScreenRenderWindow.newInstance();
  var genericRenderer = vtk.Rendering.Misc.vtkGenericRenderWindow.newInstance();
  var actor              = vtk.Rendering.Core.vtkActor.newInstance();
  var mapper             = vtk.Rendering.Core.vtkMapper.newInstance();
  var cone               = vtk.Filters.Sources.vtkConeSource.newInstance();

  actor.setMapper(mapper);
  mapper.setInputConnection(cone.getOutputPort());

  var renderer = fullScreenRenderer.getRenderer();
  //var renderer = genericRenderer.getRenderer();
  renderer.addActor(actor);
  renderer.resetCamera();

  var renderWindow = fullScreenRenderer.getRenderWindow();
  //var renderWindow = genericRenderer.getRenderWindow();
  renderWindow.render();
  