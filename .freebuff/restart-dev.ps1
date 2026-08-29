# Kill all node processes first
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Clear Vite cache
Remove-Item -Recurse -Force "C:\Users\afola\Desktop\muj\node_modules\.vite" -ErrorAction SilentlyContinue

# Start vite dev server
Set-Location "C:\Users\afola\Desktop\muj"
$proc = Start-Process -FilePath 'npx.cmd' -ArgumentList 'vite','--port','5173','--host' -RedirectStandardOutput 'C:\Users\afola\Desktop\muj\.freebuff\preview-eb5faf10-f591-4a05-815c-b1b7623f0a8d.log' -RedirectStandardError 'C:\Users\afola\Desktop\muj\.freebuff\preview-eb5faf10-f591-4a05-815c-b1b7623f0a8d.log.err' -WindowStyle Hidden -PassThru
Write-Output $proc.Id
