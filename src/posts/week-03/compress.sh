# mov to mp4 at 2x speed
ffmpeg -i input.mov -c:v libx264 -preset medium -crf 23 -vf "setpts=0.5*PTS" -movflags +faststart output.mp4

# mov to mp4 at 2x speed, 720p
ffmpeg -i input.mov -c:v libx264 -preset medium -crf 23 -vf "scale=-1:720,setpts=0.5*PTS" -af "atempo=2.0" -movflags +faststart output_720p.mp4

# mov to mp4 at 2x speed, 720p (portrait)
ffmpeg -i input.mov -c:v libx264 -preset medium -crf 23 -vf "scale=720:-1,setpts=0.5*PTS" -af "atempo=2.0" -movflags +faststart output_720p_portrait.mp4

# mov to mp4, original speed, 720p
ffmpeg -i input.mov -c:v libx264 -preset medium -crf 23 -vf "scale=-1:720" -movflags +faststart output_720p.mp4

# mov to mp4, original speed, 720p (portrait)
ffmpeg -i input.mov -c:v libx264 -preset medium -crf 23 -vf "scale=720:-1" -movflags +faststart output_720p_portrait.mp4
