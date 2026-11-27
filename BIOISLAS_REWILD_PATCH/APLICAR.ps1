$ErrorActionPreference = 'Stop'
$source = $PSScriptRoot
$target = (Get-Location).Path

$required = @('index.html', 'manifest.webmanifest', 'sw.js', 'js', 'css')
foreach ($item in $required) {
  if (-not (Test-Path (Join-Path $target $item))) {
    throw "No se encontró '$item' en $target. Ejecuta este script desde la raíz del repositorio PWA."
  }
}

Write-Host 'Aplicando actualización BIOISLAS REWILD...' -ForegroundColor Green
$backupName = 'BIOISLAS_REWILD_BACKUP_' + (Get-Date -Format 'yyyyMMdd_HHmmss')
$backupPath = Join-Path $target $backupName
New-Item -ItemType Directory -Path $backupPath -Force | Out-Null
$backupFiles = @('index.html', 'manifest.webmanifest', 'sw.js', 'js/app.js', 'js/map.js') + @(
  'js/modules.js', 'js/game-memorama.js', 'js/game-terms.js', 'js/game-sequence.js', 'js/exam.js', 'js/results.js', 'js/settings.js', 'manual.html'
)
foreach ($backupFile in $backupFiles) {
  $originalPath = Join-Path $target $backupFile
  if (Test-Path $originalPath) {
    $backupDestination = Join-Path $backupPath $backupFile
    $backupDirectory = Split-Path -Parent $backupDestination
    if (-not (Test-Path $backupDirectory)) { New-Item -ItemType Directory -Path $backupDirectory -Force | Out-Null }
    Copy-Item -LiteralPath $originalPath -Destination $backupDestination -Force
  }
}
Write-Host "Respaldo creado en: $backupName" -ForegroundColor DarkCyan
$files = @(
  @{ From = 'index.html'; To = 'index.html' },
  @{ From = 'about.html'; To = 'about.html' },
  @{ From = 'manifest.webmanifest'; To = 'manifest.webmanifest' },
  @{ From = 'sw.js'; To = 'sw.js' },
  @{ From = 'css/experience.css'; To = 'css/experience.css' },
  @{ From = 'js/app.js'; To = 'js/app.js' },
  @{ From = 'js/map.js'; To = 'js/map.js' },
  @{ From = 'js/experience.js'; To = 'js/experience.js' },
  @{ From = 'assets/images/tucan-guide.jpg'; To = 'assets/images/tucan-guide.jpg' }
)

foreach ($file in $files) {
  $destination = Join-Path $target $file.To
  $directory = Split-Path -Parent $destination
  if (-not (Test-Path $directory)) { New-Item -ItemType Directory -Path $directory -Force | Out-Null }
  Copy-Item -LiteralPath (Join-Path $source $file.From) -Destination $destination -Force
  Write-Host "  actualizado: $($file.To)" -ForegroundColor DarkGreen
}

$encoding = [System.Text.UTF8Encoding]::new($false)
$entryScripts = @(
  'js/modules.js', 'js/game-memorama.js', 'js/game-terms.js', 'js/game-sequence.js',
  'js/exam.js', 'js/results.js', 'js/settings.js'
)
foreach ($script in $entryScripts) {
  $path = Join-Path $target $script
  if (-not (Test-Path $path)) { throw "Falta el archivo de entrada esperado: $script" }
  $content = [System.IO.File]::ReadAllText($path)
  if ($content -notmatch "experience\.js") {
    [System.IO.File]::WriteAllText($path, "import './experience.js';`r`n" + $content, $encoding)
    Write-Host "  motion + racha: $script" -ForegroundColor DarkGreen
  }
}

# La guía no tenía módulo JavaScript; se carga el sistema de movimiento sin alterar su contenido.
$manual = Join-Path $target 'manual.html'
if (Test-Path $manual) {
  $html = [System.IO.File]::ReadAllText($manual)
  if ($html -notmatch '/js/experience\.js') {
    $html = $html.Replace('</body>', '  <script type="module" src="/js/experience.js"></script>' + "`r`n" + '</body>')
    [System.IO.File]::WriteAllText($manual, $html, $encoding)
  }
}

# Mantiene el nuevo color de la interfaz en la barra del navegador en todas las páginas existentes.
Get-ChildItem -Path $target -Filter '*.html' -File | ForEach-Object {
  $html = [System.IO.File]::ReadAllText($_.FullName)
  $html = [regex]::Replace($html, '(<meta\s+name=["'']theme-color["'']\s+content=["''])#[0-9a-fA-F]{3,8}(["''])', '${1}#fffdf8${2}', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if ($html -notmatch '/css/experience\.css') {
    $html = $html.Replace('</head>', '  <link rel="stylesheet" href="/css/experience.css">' + "`r`n" + '</head>')
  }
  [System.IO.File]::WriteAllText($_.FullName, $html, $encoding)
}

Write-Host ''
Write-Host 'BIOISLAS REWILD se ha copiado correctamente.' -ForegroundColor Green
Write-Host 'Ejecuta: py -m http.server 5500  y abre http://localhost:5500/' -ForegroundColor Cyan
