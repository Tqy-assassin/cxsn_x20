let pin = PortNo.port2
let str = ""

control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_A, EventBusValue.MICROBIT_EVT_ANY, function () {
    CXSN_normal.Serial_Write_String(pin, "Hello world")
})

CXSN_normal.InitSerial_Ex(pin,Serial_mode._readwrite,0,2)
basic.forever(function () {
    if (CXSN_normal.Serial_Available(pin)) {
        str = CXSN_normal.Serial_Read(pin)
        CXSN_normal.Serial_Write_String(pin, str)
    }
})
