function processFile(file, destination)
{
    var activeDoc = app.open(file)

    var groups = []
    var layersToDelete = []

    for  (var i = 0; i < activeDoc.layers.length; i++)
    {
        var layer = activeDoc.layers[i]
        if (layer.typename != "ArtLayer")
        {
            groups.push(layer)
        }
        else 
        {
            if (!layer.visible)
            {
              layersToDelete.push(layer)
              continue
            }
            if (layer.isBackgroundLayer)
            {
              layer.name = "Background"
            }
            else if (layer.allLocked) // AllLocked layers are used as Guides for artists
            {
              layer.allLocked = false
              layersToDelete.push(layer)
            }
            if (layer.kind == LayerKind.SMARTOBJECT)
            {
              layer.rasterize(RasterizeType.ENTIRELAYER)
            }
        }
    }

    for (var i = 0; i < groups.length; i++)
    {
      if (!layer.visible)
      {
        layersToDelete.push(layer)
      }
      else
      {
        groups[i].merge()
      }
    }

    for (var i = 0; i < layersToDelete.length; i++)
    {
        layersToDelete[i].remove()
    }

    activeDoc.saveAs(destination, new PhotoshopSaveOptions(), false, Extension.LOWERCASE)
    activeDoc.close(SaveOptions.DONOTSAVECHANGES)
}

function main(argv) 
{
  var source = new Folder(argv[0])
  var destination = new Folder(argv[1])

  if (source != null && destination != null) 
  {
      var files = source.getFiles()
      for (var i = 0; i < files.length; i++) 
      {
          var file = files[i]
          if (file instanceof Folder)
          {
              // skip
          }
          else
          {
              processFile(file, destination)
          }
      }
  }

  return "OK"
}