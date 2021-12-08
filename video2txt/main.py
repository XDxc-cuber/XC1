import cv2
import time, sys, os, ctypes
import numpy as np


# create terminal cursor
class COORD(ctypes.Structure):
	_fields_ = [("X", ctypes.c_short), ("Y", ctypes.c_short)] 
	def __init__(self,x,y):
		self.X = x
		self.Y = y

STD_OUTPUT_HANDLE= -11
hOut = ctypes.windll.kernel32.GetStdHandle(STD_OUTPUT_HANDLE)
INIT_POS = COORD(0, 0)

os.system('cls')

# file path
current_path = sys.path[0] + '\\'

# gray_degree-char array
ary = [' ',' ',' ','`','`','`','.','.','^','^','^','^',',',',',':',':','~',
       '~','"','"','<','<','!','!','c','c','t','t','+','+','{','{','i','i',
       '7','7','?','?','u','u','3','3','0','0','p','p','w','w','4','4','A',
       'A','8','8','D','D','X','X','%','%','#','#','#','H','H','W','W','M','M']

# video width and height
width, height = 170, 45



# video file to txt file
def video_to_txts (video_name: str) :

    cap = cv2.VideoCapture(video_name)
    cnt = 0

    with open(current_path + 'txt_file\\char_video.txt', 'w') as f:
        while cap.isOpened():
            ret, im = cap.read()
            if ret:
                cnt += 1
                im = cv2.resize(im, (width, height))
                print("Reading frame " + str(cnt))
                gry = np.zeros((len(im), len(im[0])))
                for i in range(0, len(im)):
                    for j in range(0, len(im[0])):
                        gry[i][j] = 0.299*im[i][j][2] + 0.587*im[i][j][1] + 0.114*im[i][j][0]

                frame = ''
                for i in range(0, len(im)):
                    for j in range(0, len(im[0])):
                        frame += ary[int(gry[i][j]*len(ary)/255 - 0.5)]
                    frame += '\n'
                f.write(frame + '\n')

            else:
                break

        print('Done')




# play txt video in terminal
def play_video(txt_path, time_gap) :

    f = open(txt_path, 'r')
    char_video = f.readlines()
    f.close()

    # 3003 frames at all, just play 3000 frames
    frames_num = 3000

    # get frames
    frames = ['' for i in range(frames_num)]
    line_i = 0

    for i in range(frames_num):
        for j in range(height):
            frames[i] += char_video[line_i]
            line_i += 1
        line_i += 1


    # play char video
    for i in range(frames_num):
        ctypes.windll.kernel32.SetConsoleCursorPosition(hOut,INIT_POS)
        print(frames[i], flush=False)
        sys.stdout.flush()
        time.sleep(time_gap)
        
    

if __name__ == '__main__':
    # video_to_txts(current_path + 'video\\video1.mp4')
    play_video(current_path + 'txt_file\\char_video.txt', 0.01)