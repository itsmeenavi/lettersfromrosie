Add-Type -AssemblyName System.Drawing

$srcPath = Resolve-Path "public\lfr.jpg"
$dstPath = Join-Path (Get-Location) "public\lfr-circle.png"

$src = [System.Drawing.Image]::FromFile($srcPath)
$size = [Math]::Min($src.Width, $src.Height)

$bmp = New-Object System.Drawing.Bitmap $size, $size
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::Transparent)

$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddEllipse(0, 0, $size, $size)
$g.SetClip($path)

$cropX = ($src.Width - $size) / 2
$cropY = ($src.Height - $size) / 2
$g.DrawImage($src, [System.Drawing.Rectangle]::new(0, 0, $size, $size), $cropX, $cropY, $size, $size, [System.Drawing.GraphicsUnit]::Pixel)

$g.Dispose()
$src.Dispose()

$bmp.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Circle icon created successfully!"
