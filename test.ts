CXSN_normal.Port6.init(Serial_mode._write)
basic.forever(function on_forever() {
    CXSN_normal.Port6.write_numbers([0, 1])
    basic.pause(1000)
})
