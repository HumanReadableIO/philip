param (
  # The source directory that contains all Photoshop files
  [Parameter(Mandatory=$true)][string]$source,
  # The intermediary directory for processing Photoshop files
  [Parameter(Mandatory=$true)][string]$tmp,
  # The destination directory that all panels will be extracted to
  [Parameter(Mandatory=$true)][string]$dest
)

# Prepare all Photoshop files and place them in $tmp
Write-Host "-- PHASE: Prep"
Remove-Item "$tmp\*.*"
cscript .\processFolder.vbs $source $tmp

# Extract all Photoshop layers into their own panel
Write-Host "-- PHASE: Extract"
Remove-Item "$dest\*.*"
Get-ChildItem $tmp -Filter *.psd |
Foreach-Object {
  Write-Host $_.BaseName
  $srcFileName = $_.FullName
  $dstFileName = Join-Path $dest $_.BaseName
  magick -dispose Background "$srcFileName" -layers coalesce "$dstFileName.png"
}

# Remove Photoshop preview file
Write-Host "-- PHASE: Clean up"
Remove-Item "$dest\*-0.png"

Write-Host "-- DONE"