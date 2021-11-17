from .file_reader import FileReader


class Cache:
    def __init__(self):
        self.file_reader = FileReader()
        self.file_path = 'data/cache.json'
    
    def get(self, key):
        return self.file_reader.get_data(self.file_path).get(key)
    
    def put(self, key, val):
        data = self.file_reader.get_data(self.file_path)
        data[key] = val
        self.file_reader.write_data(self.file_path, data)
