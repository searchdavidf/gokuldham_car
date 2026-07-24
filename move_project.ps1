# Run this script from the workspace root to move all project files into ./gokuldham_car
$dest = Join-Path -Path (Get-Location) -ChildPath 'gokuldham_car'
If (-Not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest | Out-Null }

# List of files/dirs to move (this script will skip itself)
$items = Get-ChildItem -Force | Where-Object { $_.Name -ne 'gokuldham_car' -and $_.Name -ne 'move_project.ps1' }
foreach($it in $items){
  $target = Join-Path $dest $it.Name
  Write-Host "Moving $($it.Name) -> $target"
  Move-Item -Path $it.FullName -Destination $target -Force
}
Write-Host "All files moved to $dest"
