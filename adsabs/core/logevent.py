'''
Created on Apr 30, 2013

@author: jluker
'''

import socket
import datetime

class LogEvent(dict):
    
    @classmethod
    def new(cls, msg, **fields):
        event = cls()
        event['@message'] = msg
        event['@fields'] = fields
        event.init()
        return event
    
    def __init__(self, *args):
        dict.__init__(self, *args)
        
    def init(self):
        """
        this method should be overridden in subclasses
        """
        now = datetime.datetime.utcnow()
        self['@timestamp'] = now.isoformat()
        self['@source'] = socket.gethostname()