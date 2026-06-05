$ErrorActionPreference = "Continue"
$srcPath = "src"
$files = Get-ChildItem -Path $srcPath -Include "*.tsx","*.ts" -Recurse

foreach ($file in $files) {
    $lines = Get-Content $file.FullName -Encoding UTF8
    if ($lines -eq $null) { continue }
    $content = $lines -join "`n"
    $original = $content

    # Fix inline style backgrounds - page wrappers
    $content = $content -replace 'style=\{\{ background: "linear-gradient\(180deg, #050814.*?\)" \}\}', 'style={{ background: "#F4F5F7" }}'
    $content = $content -replace 'style=\{\{ background: "radial-gradient\(.*?#050814.*?\)" \}\}', 'style={{ background: "#F4F5F7" }}'
    $content = $content -replace 'style=\{\{ background: "linear-gradient\(135deg, #0A1128.*?\)" \}\}', 'style={{ background: "#F4F5F7" }}'

    # Fix remaining bg- class swaps missed (e.g. in [category] subdir)
    $content = $content -replace 'bg-\[#050814\]', 'bg-[#F4F5F7]'
    $content = $content -replace 'bg-\[#0A1128\]', 'bg-white'
    $content = $content -replace 'bg-\[#0a1128\]', 'bg-white'
    $content = $content -replace 'bg-\[#080f24\]', 'bg-slate-50'

    # Fix dark text colors on non-button elements (keep text-[#0A1128] on gold buttons — those are correct)
    # Only fix white text on light backgrounds and dark section text colors
    $content = $content -replace 'text-gray-300\b(?!\s)', 'text-slate-600'
    $content = $content -replace 'text-gray-400\b(?!\s)', 'text-slate-500'
    $content = $content -replace 'text-gray-500\b(?!\s)', 'text-slate-500'
    $content = $content -replace 'border-white/10\b', 'border-slate-200'
    $content = $content -replace 'border-white/5\b', 'border-slate-100'
    $content = $content -replace 'border-white/15\b', 'border-slate-200'

    # Fix dark input fields (bg dark/60 etc)
    $content = $content -replace 'bg-\[#0A1128\]/(?:50|60|40|80|90|95)\b', 'bg-white'
    $content = $content -replace 'bg-\[#050814\]/(?:60|80|85|90)\b', 'bg-white'

    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline -Encoding UTF8
        Write-Host "Updated: $($file.Name)"
    }
}

Write-Host "PASS 2 COMPLETE"
