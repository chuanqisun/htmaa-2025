# mov to mp4 at 2x speed
ffmpeg -i input.mov -c:v libx264 -preset medium -crf 23 -vf "setpts=0.5*PTS" -movflags +faststart output.mp4

# move to mp4 at 2x speed, 720p
ffmpeg -i input.mov -c:v libx264 -preset medium -crf 23 -vf "scale=-1:720,setpts=0.5*PTS" -movflags +faststart output_720p.mp4

# move to mp4 at 2x speed, 720p (portrait)
ffmpeg -i input.mov -c:v libx264 -preset medium -crf 23 -vf "scale=720:-1,setpts=0.5*PTS" -movflags +faststart output_720p_portrait.mp4