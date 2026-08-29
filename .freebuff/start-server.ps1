Set-Location "C:\Users\afola\Desktop\muj"
$proc = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c npx vite --port 5173 --host' -WindowStyle Hidden -PassThru
Write-Output $proc.Id
