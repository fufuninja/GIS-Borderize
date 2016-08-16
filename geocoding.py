import csv
from geopy.geocoders import Nominatim

f=open('latlong2.csv')
csv_f=csv.reader(f)

address=[]

for row in csv_f:
	address.append(row[0])

del address[0]

geolocator=Nominatim()

for x in range (18,54):
	location = geolocator.reverse(address[x], timeout=200)
	print(location.address)
