import zerorpc

class RPC(object):
    def Hello(self, params):
        return "Hello, %s" % params

s = zerorpc.Server(RPC())
s.bind("tcp://0.0.0.0:1272")
s.run()