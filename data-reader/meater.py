# Match data eater. aka meater.
import os
import sys
import json
import hashlib
import cv2 as cv
from pyzbar.pyzbar import decode, ZBarSymbol

from ar_utils import *


# Quick function to create an md5 hash of a dictionary
# Odds of two dictionaries having the same hash are very low, essentially
# impossible
def get_checksum(data):
    return hashlib.md5(
        json.dumps(data, sort_keys=True).encode('utf-8')).hexdigest()


# A list of dictionaries, each containing the data of a scouted team in a match
scoutdata = []
remote_scout_data = get_scouting_data().to_dict('records')
print(remote_scout_data)
scoutdata = scoutdata + remote_scout_data
# List of checksums of the scoutdata elements
# We don't need to store this, we'll just re-compute it on load, so we don't
# store it with the actual scoutdata that gets saved
known_checksums = []

# grab the name of our datafile from the 1st parameter to the script
datafile = sys.argv[1]

# Check if it exists and has some data in it, if so, load it up.
if os.path.exists(datafile) and os.stat(datafile).st_size > 0:
    with open(datafile, 'r') as f:
        scoutdata = json.load(f)

# Zip through any loaded data and compute the checksum, save it into our list
for s in scoutdata:
    known_checksums.append(get_checksum(s))


print(f'Starting with {len(scoutdata)} data points.')
cap = cv.VideoCapture(0) # 0 is usually right, might need to tinker with it
if not cap.isOpened():
    print('No Camera found. Tinkering required.')
    exit()

# This is the main loop of the program.
while True:
    # Grab a frame from the camera
    ret, frame = cap.read()
    # uze pyzbar to find QRcode data, returns a list of matches in an image
    codes = decode(frame, symbols=[ZBarSymbol.QRCODE])
    # If the list is empty we'll skip over this whole loop
    for decoded in codes:
        # Connvert the raw bytes in the 'data' field to a string and read it
        # into a dictionary via json.loads()
        data = json.loads(decoded.data.decode('utf8'))
        # Compute the checksum of the data we just read in
        checksum = get_checksum(data) 
        if not checksum in known_checksums:
            # We have a new data point.
            scoutdata.append(data)
            known_checksums.append(checksum)
            print(data)
            print(f'System has {len(scoutdata)} data points.')
            # Write the whole scoutdata list to the datafile
            with open(datafile, 'w') as f:
                json.dump(scoutdata, f)  # Dump to disk
                # Now try and upload to Cosmos
                container = get_container()
                container.upsert_item(data)
    cv.imshow('frame', frame)
    # If the user presses 'q' in the window, exit the while loop
    # and the program ends.
    if cv.waitKey(1) == ord('q'):
        break