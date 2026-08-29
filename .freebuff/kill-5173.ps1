# Kill the old vite server on port 5173
Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object {
    try { $_.Id -ne 0 } catch { $false }
} | ForEach-Object {
    try {
        $port = Get-NetTCPConnection -OwningProcess $_.Id -LocalPort 5173 -ErrorAction SilentlyContinue
        if ($port) { Stop-Process -Id $_.Id -Force }
    } catch {}
}
