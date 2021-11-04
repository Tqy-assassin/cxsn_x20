CXSN_normal.Motor_Init(SerialTxPort.Port2)
basic.forever(function () {
    CXSN_normal.Set_motor(MotorNo.motor_1, MotorDir.clockwise, 100)
    basic.pause(1000)
})
