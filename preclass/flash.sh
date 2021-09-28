# sh flash.sh

# https://www.espruino.com/binaries/espruino_2v09_esp8266_4mb/

# pip3 show esptool
# chmod +x /usr/local/lib/python3.9/site-packages/esptool.py
# ls /dev/tty.* 
alias esptool='/usr/local/lib/python3.9/site-packages/esptool.py'

PORT=/dev/tty.wchusbserial14620
BAUD=115200

esptool --port $PORT erase_flash

esptool  --port $PORT --baud $BAUD \
  write_flash --flash_freq 80m --flash_mode qio --flash_size 32m \
  0x0000 "binaries/boot_v1.6.bin" 0x1000 "binaries/espruino_esp8266_user1.bin" \
  0x3FC000 "binaries/esp_init_data_default.bin" 0x3FE000 "binaries/blank.bin"
# screen $PORT $BAUD

