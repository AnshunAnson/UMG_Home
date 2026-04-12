from PIL import Image
import os

def compress_gif(input_path, output_path, target_size_mb=95):
    """
    压缩 GIF 文件到目标大小以下
    通过降低颜色数量和调整尺寸来实现
    """
    target_size_bytes = target_size_mb * 1024 * 1024
    
    # 打开原始 GIF
    img = Image.open(input_path)
    
    # 获取原始尺寸
    original_width, original_height = img.size
    print(f"原始尺寸: {original_width}x{original_height}")
    print(f"原始帧数: {img.n_frames}")
    
    # 尝试不同的压缩参数
    # 策略：先尝试降低颜色到 128，如果还是太大，再降低尺寸
    colors = 128
    scale = 1.0
    
    # 先尝试只降低颜色
    temp_path = output_path + ".temp.gif"
    
    # 保存第一帧用于测试
    frames = []
    for frame_idx in range(img.n_frames):
        img.seek(frame_idx)
        frame = img.copy()
        # 转换为 P 模式（调色板模式）
        frame = frame.convert('P', palette=Image.ADAPTIVE, colors=colors)
        frames.append(frame)
    
    # 保存
    frames[0].save(
        temp_path,
        save_all=True,
        append_images=frames[1:],
        loop=img.info.get('loop', 0),
        duration=img.info.get('duration', 100)
    )
    
    temp_size = os.path.getsize(temp_path)
    print(f"降低颜色到 {colors} 后大小: {temp_size / 1024 / 1024:.2f} MB")
    
    # 如果还是太大，需要降低尺寸
    while temp_size > target_size_bytes and scale > 0.5:
        scale -= 0.1
        new_width = int(original_width * scale)
        new_height = int(original_height * scale)
        
        print(f"尝试尺寸: {new_width}x{new_height} (scale: {scale:.1f})")
        
        frames = []
        for frame_idx in range(img.n_frames):
            img.seek(frame_idx)
            frame = img.copy()
            # 先调整尺寸
            frame = frame.resize((new_width, new_height), Image.Resampling.LANCZOS)
            # 再降低颜色
            frame = frame.convert('P', palette=Image.ADAPTIVE, colors=colors)
            frames.append(frame)
        
        frames[0].save(
            temp_path,
            save_all=True,
            append_images=frames[1:],
            loop=img.info.get('loop', 0),
            duration=img.info.get('duration', 100)
        )
        
        temp_size = os.path.getsize(temp_path)
        print(f"  大小: {temp_size / 1024 / 1024:.2f} MB")
    
    # 重命名为最终文件
    os.rename(temp_path, output_path)
    final_size = os.path.getsize(output_path)
    print(f"\n压缩完成!")
    print(f"最终尺寸: {new_width}x{new_height}")
    print(f"最终大小: {final_size / 1024 / 1024:.2f} MB")
    
    return output_path

if __name__ == "__main__":
    input_file = r"E:\AnShunConfig\html\portfolio\public\gifs\FPS.high.gif"
    output_file = r"E:\AnShunConfig\html\portfolio\public\gifs\FPS.high.gif"
    
    # 先备份原文件
    backup_file = input_file + ".backup"
    if not os.path.exists(backup_file):
        os.rename(input_file, backup_file)
        print(f"已备份原文件到: {backup_file}")
    
    compress_gif(backup_file, output_file)
