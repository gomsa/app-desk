

from escpos.printer import File


def Parallel(self, params={}):
    """ Seiko Epson Corp. Receipt Printer M129 Definitions (EPSON TM-T88IV) """
    p = File(params["devfile"])
    for (k, v) in params.items():
        if k == "text":
            p.block_text(v)
        if k == "barcode":
            p.barcode(v, 'EAN13', 64, 2, '', '')
        if k == "image":
            p.image(v)
        if k == "qr":
            p.qr(v)
        if k == "image":
            p.image(v) 
    p.cut()
