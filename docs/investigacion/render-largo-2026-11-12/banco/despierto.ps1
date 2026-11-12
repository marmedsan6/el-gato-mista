# Mantiene el equipo y la pantalla despiertos mientras vive este proceso (no cambia ajustes de energía).
param([int]$secs=900)
Add-Type -Namespace W -Name P -MemberDefinition '[DllImport("kernel32.dll")] public static extern uint SetThreadExecutionState(uint f);'
$r=[W.P]::SetThreadExecutionState([uint32]"0x80000003")
"peticion activa (prev=0x{0:X})" -f $r
Start-Sleep $secs
