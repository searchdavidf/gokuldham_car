# PowerShell script to initialize git repo, commit and push to GitHub.
# Usage: Update $remoteUrl to your repository URL, then run in PowerShell after Git is installed.

param(
  [string]$remoteUrl = '',
  [string]$branch = 'main'
)

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Error "git is not installed or not on PATH. Install Git and re-run this script."
  exit 1
}

if (-not $remoteUrl) {
  Write-Host "No remote URL provided. Please run: .\setup_push.ps1 -remoteUrl 'https://github.com/your-username/gokuldham_car.git'"
  exit 1
}

Set-Location -Path "$PSScriptRoot"

git init
git add .
git commit -m "Initial commit: integrate frontend layout and styles"
git branch -M $branch
git remote add origin $remoteUrl
git push -u origin $branch

Write-Host "Done. Project pushed to $remoteUrl"
