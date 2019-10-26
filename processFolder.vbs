' Prepare variables
Dim appRef
Dim javaScriptFile
Dim argsArr()

' Read entire JavaScript... script into a string
Dim fsObj : Set fsObj = CreateObject("Scripting.FileSystemObject")
Dim jsxFile : Set jsxFile = fsObj.OpenTextFile("processFolder.jsx", 1, False)
If Not jsxFile.AtEndOfStream Then fileContents = fileContents & jsxFile.ReadAll
jsxFile.Close
Set jsxFile = Nothing
Set fsObj = Nothing

' Prepare to call main with passed arguments
javascriptFile = fileContents & "main(arguments);"

ReDim argsArr(Wscript.Arguments.length-1)
For i = 0 To Wscript.Arguments.length-1
    argsArr(i) = Wscript.Arguments(i)
Next

' Run Photoshop and tell it to execute the script
Set appRef = CreateObject("Photoshop.Application")
Wscript.Echo appRef.DoJavaScript(javascriptFile, argsArr, 1)