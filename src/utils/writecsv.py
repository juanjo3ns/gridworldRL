import csv
import os



class CSV:
	def __init__(self,type, version , file):
		self.path = '/data/src/csvdata/'
		if not os.path.exists(os.path.join(self.path,type)):
			os.mkdir(os.path.join(self.path,type))
		if not os.path.exists(os.path.join(self.path,type,version)):
			os.mkdir(os.path.join(self.path,type,version))
		self.file = file
		self.csvfile = open(os.path.join(self.path, type, version, self.file + '.csv'), 'w')
		self.csvwriter = csv.writer(self.csvfile, delimiter=',')

	def write(self, row):
		self.csvwriter.writerow(row)
	def close(self):
		self.csvfile.close()
