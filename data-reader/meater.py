# Match data eater. aka meater.
import cv2 as cv
from pyzbar.pyzbar import decode, ZBarSymbol


cap = cv.VideoCapture(0)
if not cap.isOpened():
    print('No Camera found.')
    exit()
while True:
    ret, frame = cap.read()
    # uze pyzbar to find QRcode data
    data = decode(frame, symbols=[ZBarSymbol.QRCODE])
    if len(data) > 0:
        print(data)
    cv.imshow('frame', frame)
    if cv.waitKey(1) == ord('q'):
        break