Add-Type -TypeDefinition @'
using System; using System.Runtime.InteropServices;
public static class LI { [StructLayout(LayoutKind.Sequential)] public struct L { public uint cb, t; }
  [DllImport("user32.dll")] public static extern bool GetLastInputInfo(ref L l);
  public static uint Idle() { var l = new L { cb = 8 }; GetLastInputInfo(ref l); return ((uint)Environment.TickCount - l.t) / 1000; } }
'@
"inactivo_s=" + [LI]::Idle() + " hora=" + (Get-Date).ToString('HH:mm:ss')
