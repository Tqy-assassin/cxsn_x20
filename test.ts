CXSN_normal.motor_Init(PortNo.port1)

basic.forever(function() {
    CXSN_normal.set_motor(PortNo.port1, MotorNo.motor_1, MotorDir.clockwise, 100)
    basic.pause(500)
    CXSN_normal.set_motor(PortNo.port1, MotorNo.motor_1, MotorDir.clockwise, 0)
    basic.pause(500)
})