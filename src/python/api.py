import zerorpc
import escpos


class RPC(object):
    res = {
        "status": True,
        "message": "打印命令已发送"
    }

    def Parallel(self, params):
        try:
            escpos.Parallel(params)
            return res
        except Exception as ex:
            res["status"] = False
            res["message"] = ex.message
            return res


s = zerorpc.Server(RPC())
s.bind("tcp://0.0.0.0:4242")
s.run()
