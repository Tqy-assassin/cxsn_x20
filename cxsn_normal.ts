enum PortNo {
    //% block="port1"
    port1 = 0,
    //% block="port2"
    port2 = 1,
    //% block="port3"
    port3 = 2,
    //% block="port4"
    port4 = 3,
    //% block="port5"
    port5 = 4,
    //% block="port6"
    port6 = 5
}

enum MotorNo {
    //% block="motor_1"
    motor_1 = 0,
    //% block="motor_2"
    motor_2 = 1,
}

enum MotorDir {
    //% block="clockwise"
    clockwise = 0,
    //% block="counterclockwise"
    counterclockwise = 1,
}

enum Serial_mode {
    //% block="readwrite"
    _readwrite = 3,
    //% block="writeonly"
    _write = 2,
    //% block="readonly"
    _read = 1,
    //% block="unused"
    _unused = 0,
}

enum Servo_port {
    //% block="port1"
    port1 = 0,
    //% block="port2"
    port2 = 1,
    //% block="port3"
    port3 = 2,
}

//% block="cxsn_normal" color="#F02010" weight=100 icon="\uf11b"
//% groups="['normal', 'motor', 'serial', 'servo']"
//% group 
namespace CXSN_normal {
    const pin_id = [
        [DigitalPin.P0, DigitalPin.P3, DigitalPin.P4],
        [DigitalPin.P1, DigitalPin.P5, DigitalPin.P6],
        [DigitalPin.P2, DigitalPin.P8, DigitalPin.P7],
        [DigitalPin.P9, DigitalPin.P10, DigitalPin.P11],
        [DigitalPin.P13, DigitalPin.P14, DigitalPin.P15],
        [DigitalPin.P16, DigitalPin.P19, DigitalPin.P20]];
    const analog_pin = [
        [AnalogPin.P0, AnalogPin.P3, AnalogPin.P4],
        [AnalogPin.P1, AnalogPin.P5, AnalogPin.P6],
        [AnalogPin.P2, AnalogPin.P8, AnalogPin.P7],
        [AnalogPin.P9, AnalogPin.P10, AnalogPin.P11],
        [AnalogPin.P13, AnalogPin.P14, AnalogPin.P15],
        [AnalogPin.P16, AnalogPin.P19, AnalogPin.P20]];

    // let cx_serial: cxsn_serial[] = [new cxsn_serial(), new cxsn_serial(), new cxsn_serial(), 
    // new cxsn_serial(), new cxsn_serial(), new cxsn_serial()];

    //% blockId=Set_LED
    //% block="set port %x LED %state"
    //% state.shadow=toggleOnOff
    //% group="normal"
    export function Set_LED(x: PortNo, state: boolean) {
        if (state)
            pins.digitalWritePin(pin_id[x][0], 0)
        else
            pins.digitalWritePin(pin_id[x][0], 1)
    }

    /*LEDpwm*/

    //% blockId=Read_Key
    //% block="%x key state"
    //% group="normal"
    export function Read_Key(x: PortNo): boolean{
        if (pins.digitalReadPin(pin_id[x][0]) == 0)
            return true
        else
            return false
    }

    //% blockId=RP_Read_Number
    //% block="the number of %x RP"
    //% group="normal"
    export function RP_Read_Number(x: PortNo): number {
        return pins.analogReadPin(analog_pin[x][0])
    }

    //% blockId=RP_Read_Voltage
    //% block="the voltage of %x"
    //% group="normal"
    export function RP_Read_Voltage(x: PortNo): number {
        return pins.analogReadPin(analog_pin[x][0]) * 5 / 1023
    }

    //% blockId=Motor_Init
    //% block="Init the motor as %serial"
    //% group="motor"
    export function Motor_Init(serial: cxsn_serial) {
        serial.init(Serial_mode._write)
    }

    //% blockId=Set_motor
    //% block="set %serial the %no %dir rotation, speed is %speed"
    //% inlineInputMode = inline
    //% speed.max=100 speed.min=0 speed.defl=100
    //% group="motor"
    export function Set_motor(serial: cxsn_serial, no: MotorNo, dir: MotorDir, speed: number) {
        if (no == MotorNo.motor_1) {
            serial.write_numbers([0x5A, 0xA0, dir, speed]);
        } else if (no == MotorNo.motor_2) {
            serial.write_numbers([0x5A, 0xA5, dir, speed]);
        }
    }


    /**
     * Set the servo angle
     * @param degrees the angle of the servo
     */
    //% weight=100 help=servos/set-angle
    //% blockId=Servos_SetAngle block="set %servo angle to %degrees=protractorPicker °"
    //% degrees.defl=90
    //% servo.fieldEditor="gridpicker"
    //% servo.fieldOptions.width=220
    //% servo.fieldOptions.columns=2
    //% group="servo"
    export function Servos_SetAngle(servo: Servo_port, degrees: number){
        switch(servo){
            case 0:
                servos.P0.setAngle(degrees)
                break;
            case 1:
                servos.P1.setAngle(degrees)
                break;
            case 2:
                servos.P2.setAngle(degrees)
                break;
            default:
                break;
        }
    }

    
    /**
     * Set the throttle on a continuous servo
     * @param speed the throttle of the motor from -100% to 100%
     */
    //% weight=99 help=servos/run
    //% blockId=Servos_Run block="continuous %servo run at %speed=speedPicker \\%"
    //% servo.fieldEditor="gridpicker"
    //% servo.fieldOptions.width=220
    //% servo.fieldOptions.columns=2
    //% group="servo"
    export function Servos_Run(servo: Servo_port, speed: number) {
        switch (servo) {
            case 0:
                servos.P0.run(speed)
                break;
            case 1:
                servos.P1.run(speed)
                break;
            case 2:
                servos.P2.run(speed)
                break;
            default:
                break;
        }
    }


    /**
     * Set the pulse width to the servo in microseconds
     * @param micros the width of the pulse in microseconds
     */
    //% weight=10 help=servos/set-pulse
    //% blockId=Servos_SetPulse block="set %servo pulse to %micros μs"
    //% micros.min=500 micros.max=2500
    //% micros.defl=1500
    //% servo.fieldEditor="gridpicker"
    //% servo.fieldOptions.width=220
    //% servo.fieldOptions.columns=2
    //% group="servo"
    export function Servos_SetPulse(servo: Servo_port, micros: number) {
        switch (servo) {
            case 0:
                servos.P0.setPulse(micros)
                break;
            case 1:
                servos.P1.setPulse(micros)
                break;
            case 2:
                servos.P2.setPulse(micros)
                break;
            default:
                break;
        }
    }

    /**
     * Stop sending commands to the servo so that its rotation will stop at the current position.
     */
    // On a normal servo this will stop the servo where it is, rather than return it to neutral position.
    // It will also not provide any holding force.
    //% weight=10 help=servos/stop
    //% blockId=Servos_Stop block="stop %servo"
    //% servo.fieldEditor="gridpicker"
    //% servo.fieldOptions.width=220
    //% servo.fieldOptions.columns=2
    //% group="servo"
    export function Servos_Stop(servo: Servo_port) {
        switch (servo) {
            case 0:
                servos.P0.stop()
                break;
            case 1:
                servos.P1.stop()
                break;
            case 2:
                servos.P2.stop()
                break;
            default:
                break;
        }
    }

    /**
     * Set the possible rotation range angles for the servo between 0 and 180
     * @param minAngle the minimum angle from 0 to 90
     * @param maxAngle the maximum angle from 90 to 180
     */
    //% help=servos/set-range
    //% blockId=Servos_SetRange block="set %servo range from %minAngle to %maxAngle"
    //% minAngle.min=0 minAngle.max=90
    //% maxAngle.min=90 maxAngle.max=180 maxAngle.defl=180
    //% servo.fieldEditor="gridpicker"
    //% servo.fieldOptions.width=220
    //% servo.fieldOptions.columns=2
    //% group="servo"
    export function Servos_SetRange(servo: Servo_port, minAngle: number, maxAngle: number) {
        switch (servo) {
            case 0:
                servos.P0.setRange(minAngle, maxAngle)
                break;
            case 1:
                servos.P1.setRange(minAngle, maxAngle)
                break;
            case 2:
                servos.P2.setRange(minAngle, maxAngle)
                break;
            default:
                break;
        }
    }

    /**
     * Set a servo stop mode so it will stop when the rotation angle is in the neutral position, 90 degrees.
     * @param enabled on true to enable this mode
     */
    //% help=servos/set-stop-on-neutral
    //% blockId=Servos_SetStopOnNeutral block="set %servo stop on neutral %enabled"
    //% enabled.shadow=toggleOnOff
    //% group="servo"
    //% servo.fieldEditor="gridpicker"
    //% servo.fieldOptions.width=220
    //% servo.fieldOptions.columns=2
    export function Servos_SetStopOnNeutral(servo: Servo_port, enabled: boolean) {
        switch (servo) {
            case 0:
                servos.P0.setStopOnNeutral(enabled)
                break;
            case 1:
                servos.P1.setStopOnNeutral(enabled)
                break;
            case 2:
                servos.P2.setStopOnNeutral(enabled)
                break;
            default:
                break;
        }
    }
}