class ServiceUnavailableError(Exception):
    code = 503
    description = "Service unavailable"
