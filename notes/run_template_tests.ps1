$repo = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$targetRoot = Join-Path $repo '.tmp'
if (!(Test-Path $targetRoot)) { New-Item -ItemType Directory -Path $targetRoot | Out-Null }
$templates = @('api','atomic','core','golden-atomic','golden-api','golden-core','golden-ref-arch','golden-synaptic','golden-web','library','preact','sink','sink-empty','synaptic')
$results = @()
foreach ($template in $templates) {
  $target = Join-Path $targetRoot $template
  if (Test-Path $target) { Remove-Item -Recurse -Force $target }
  New-Item -ItemType Directory -Path $target | Out-Null
  Push-Location $target

  $installOutput = & deno run -A (Join-Path $repo 'install.ts') --template $template --force 2>&1
  $installOutput | Set-Content 'install.log'
  $installExit = $LASTEXITCODE

  $buildExit = $null
  if ($installExit -eq 0) {
    $buildOutput = & deno task build 2>&1
    $buildOutput | Set-Content 'build.log'
    $buildExit = $LASTEXITCODE
  }

  Pop-Location

  $results += [PSCustomObject]@{
    Template = $template
    InstallExit = $installExit
    BuildExit = if ($buildExit -eq $null) { '' } else { $buildExit }
  }
}

$outPath = Join-Path (Join-Path $repo 'notes') 'template-test-results.json'
$results | ConvertTo-Json | Set-Content $outPath
