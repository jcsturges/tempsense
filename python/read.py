#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Author: James Sturges
# Inspired by: https://www.instructables.com/id/Raspberry-Pi-IoT-Temperature-and-Humidity-Monitor/

import Adafruit_DHT, datetime, json, os, sys, time

PWD = os.path.dirname(os.path.realpath(__file__))
ARGS = sys.argv

# SENSOR = Adafruit_DHT.AM2302
SENSOR = Adafruit_DHT.DHT22
PIN = 4
INTERVAL_SECONDS = 5
FOUT = 'data.json'

def c2f(c):
    return (1.8 * c) + 32

def f2c(f):
    return (f - 32) / 1.8

while True:
    ts = '{}Z'.format(datetime.datetime.utcnow().replace(microsecond=0).isoformat())

    # NOTE: user running script needs sensor permissions (e.g. in the gpio group)
    # https://github.com/adafruit/Adafruit_Python_DHT
    hum, temp_c = Adafruit_DHT.read_retry(SENSOR, PIN)
    data = {
        'timestamp': ts,
        'humidity': hum,
        'temperature': {
            'c': temp_c,
            'f': c2f(temp_c)
        }
    }
    data_fmt = json.dumps(data, indent=4, sort_keys=True)

    # optionally pass dir for output, else use this file's dir
    output = '{0}/{1}'.format(ARGS[1] if len(ARGS) > 1 else PWD, FOUT)
    with open(output, 'w') as dest:
        dest.write(data_fmt)

    print(data_fmt)
    print(' => saved to: {}'.format(output))

    # TODO: skip sleeping, break from while - hack to generate on script run instead of persistent
    #time.sleep(INTERVAL_SECONDS)
    break
