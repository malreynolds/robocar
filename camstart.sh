export LD_LIBRARY_PATH=/home/pi/mjpg-streamer/mjpg-streamer-experimental
/home/pi/mjpg-streamer/mjpg-streamer-experimental/mjpg_streamer -o "output_http.so -w /home/pi/mjpg-streamer/mjpg-streamer-experimental/www" -i "input_raspicam.so -x 640 -y 480 -q 8 -fps 20 -ex night"
