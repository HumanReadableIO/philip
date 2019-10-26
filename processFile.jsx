function processFile(file, destination)
{
    var activeDoc = app.open(file)

    var groups = []
    var invisibleLayers = []

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
              invisibleLayers.push(layer)
              continue
            }
            if (layer.isBackgroundLayer)
            {
                layer.name = "Background"
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
        invisibleLayers.push(layer)
      }
      else
      {
        groups[i].merge()
      }
    }

    for (var i = 0; i < invisibleLayers.length; i++)
    {
        invisibleLayers[i].remove()
    }

    activeDoc.saveAs(destination, new PhotoshopSaveOptions(), false, Extension.LOWERCASE)
    activeDoc.close(SaveOptions.DONOTSAVECHANGES)
}


function main() 
{
  var files = app.openDialog()
  var destination = Folder.selectDialog("Destination folder")
  
  if (files != null && destination != null) 
  {
      for (var i = 0; i < files.length; i++) 
      {
          var file = files[i]
          if (file instanceof Folder)
          {
              // skip
          }
          else
          {
              processFile(file)
          }
      }
  }
  
  return ""
}

main()