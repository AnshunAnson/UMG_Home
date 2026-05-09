# 下载郑州日产Z9项目资源
$urls = @(
    # PNG图片
    "https://cdn.autoxyz.cn/prod/image/2025/03/18/fhd-43a175822f814d919b947d93bf49ee45.png",
    "https://cdn.autoxyz.cn/prod/image/2025/03/18/fhd-4f257128d6f045faa359e4047c0f7ed8.png",
    
    # GIF
    "https://cdn.autoxyz.cn/prod/image/2025/03/19/fhd-0a7b3d7f573e4bac92f00c450de96684.gif",
    
    # 视频
    "https://cdn.autoxyz.cn/prod/video/2025/03/24/sd-30c80de956ff4889abf0e8984c70ca5d.mp4",
    
    # 视频缩略图
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/a4568bef044e4a30bf9717e75ce6a99c.jpg",
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/fhd-e44ccd03adfe4b198acb5f978ab338f3.jpg",
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/b36ecb78578b4bf3831705d54f7038b9.jpg",
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/e820943aa5c1486cb21c9983bc8506c5.jpg",
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/5343b5010d964328a32811dc9b15aee3.jpg"
)

$outputDir = "e:\AnShunConfig\html\portfolio\public\gifs\zhengzhou_nissan_z9"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force
}

$counter = 1
foreach ($url in $urls) {
    $extension = [System.IO.Path]::GetExtension($url)
    $fileName = "resource_$counter$extension"
    $outputPath = Join-Path $outputDir $fileName
    
    Write-Host "Downloading $url..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $outputPath -UseBasicParsing
        Write-Host "Saved to $outputPath"
    } catch {
        Write-Host "Failed to download $url : $_"
    }
    $counter++
}

Write-Host "`nDownload complete!"
