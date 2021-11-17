import json

class FileReader:
  def get_data(self, path):
      with open(path) as json_file:
          data = json.load(json_file)
      return data
  
  def write_data(self, path, data):
      with open(path, 'w') as outfile:
          json.dump(data, outfile, indent=4)
