# tempsense
Raspberry Pi IoT: Temperature and Humidity Monitor

Inspired by https://www.instructables.com/id/Raspberry-Pi-IoT-Temperature-and-Humidity-Monitor/

## crontab
Update data every minute:

`* * * * * /usr/bin/python3 /home/pi/tempsense/python/read.py /home/pi/tempsense/app/src > /home/pi/tempsense/python/output.log`

## web server
```
DocumentRoot /home/pi/tempsense/app/src
<directory /home/pi/tempsense/app/src>
	Options All
	AllowOverride All
	Require all granted
</directory>
```
