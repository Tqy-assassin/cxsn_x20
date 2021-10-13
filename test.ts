let pin = PortNo.port2
CXSN_normal.InitSerial(pin, Serial_mode._readwrite)

basic.forever(function() {
    if (CXSN_normal.Serial_Available(pin)){
        CXSN_normal.Serial_Write_String(pin, CXSN_normal.Serial_Read(pin));
    }

})