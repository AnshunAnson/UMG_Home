# 下载郑州日产Z9项目所有资源
$urls = @(
    # PNG图片
    "https://cdn.autoxyz.cn/prod/image/2025/03/18/fhd-43a175822f814d919b947d93bf49ee45.png",
    "https://cdn.autoxyz.cn/prod/image/2025/03/18/fhd-4f257128d6f045faa359e4047c0f7ed8.png",
    "https://cdn.autoxyz.cn/prod/image/2025/03/18/fhd-03a799b04c284ab88c18d67a3aa8972b.png",
    "https://cdn.autoxyz.cn/prod/image/2025/03/18/fhd-7083ba739171499c827f2f9f0bf8c64f.png",
    "https://cdn.autoxyz.cn/prod/image/2025/03/18/fhd-7eae143e03dc4830a33f28fbf3e7e3e3.png",
    "https://cdn.autoxyz.cn/prod/image/2025/03/18/fhd-b07794935894401ca0f9ecb01d10ec2e.png",
    "https://cdn.autoxyz.cn/prod/image/2025/03/18/fhd-81b1267f8f464ee1912842a3cd33950b.png",
    
    # GIF
    "https://cdn.autoxyz.cn/prod/image/2025/03/19/fhd-0a7b3d7f573e4bac92f00c450de96684.gif",
    "https://cdn.autoxyz.cn/prod/image/2025/03/19/fhd-2191cc2e552e40788412802b6dab03d3.gif",
    "https://cdn.autoxyz.cn/prod/image/2025/03/19/fhd-3f07c36a3df749c4a3408024d49d57d6.gif",
    
    # 视频
    "https://cdn.autoxyz.cn/prod/video/2025/03/24/sd-30c80de956ff4889abf0e8984c70ca5d.mp4",
    "https://cdn.autoxyz.cn/prod/video/2025/03/24/sd-f7426adb700b46e38fe316ee45ad63c2.mp4",
    "https://cdn.autoxyz.cn/prod/video/2025/03/24/sd-493e5c215a5047399a021034043b23d8.mp4",
    "https://cdn.autoxyz.cn/prod/video/2025/03/24/sd-7d772b073aed47ecbd8e85006ad9d3e0.mp4",
    
    # 视频1缩略图
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/a4568bef044e4a30bf9717e75ce6a99c.jpg",
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/fhd-e44ccd03adfe4b198acb5f978ab338f3.jpg",
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/b36ecb78578b4bf3831705d54f7038b9.jpg",
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/e820943aa5c1486cb21c9983bc8506c5.jpg",
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/5343b5010d964328a32811dc9b15aee3.jpg",
    
    # 视频2缩略图
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/fhd-f158db65a1f7459bb60458975585ee14.jpg",
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/604e4a2434e649dbae50629129e2a8a8.jpg",
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/48c7c128913b4e16acc9e4221e12aca3.jpg",
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/8021b390bbed4422a0ead57dceb5bc25.jpg",
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/45e09bfb8cfc42a5914b26f26f9609e5.jpg",
    
    # 视频3缩略图
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/fhd-892f510e54a94a5290652499e249e357.jpg",
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/8ecb448c40f643ea8ef20067db94cf6c.jpg",
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/2efbd97563a642c69152a3c3d1acf308.jpg",
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/fa04d8bb9d42487e8919ba0597f3fc91.jpg",
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/335af12d029a42a699f7118badc37aac.jpg",
    
    # 视频4缩略图
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/a0584adb555a49ffa2f2bbce2a3fbdf3.jpg",
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/fhd-f62d4b9d94f74e4b9d0574a6a2044f53.jpg",
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/503676b12f8140af8b25bbc7127526c7.jpg",
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/5e7d51e50a3b457aac8f418b578416c1.jpg",
    "https://cdn.autoxyz.cn/prod/imgsnp/2025/03/24/c68896feacdf4563bef37f9b4c15f84d.jpg"
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
