enum MotorPortNo {
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

//% block="cxsn_normal" color="#FA0010" weight=20 icon="\uf11b"
namespace CXSN_motor {
    export class cxsn_port {
        /**
         * Use "$this" to define a variable block that
         * references the "this" pointer.
         */
        //% block="robot $this(robot) say $message"
        public say(message: string) {
            
        }
    }

    //% block = "Hello"
    export function helloWorld() {
        basic.showString("Hello World!")
    }

    //% block="Init the motor as $x"
    //% x.defl=MotorPortNo.port1
    export function motor_Init(x: MotorPortNo) {
        serial.redirect(SerialPin.P0, SerialPin.P1, 9600)
        // basic.showNumber(x)
    }

    //% block="set the $no $dir rotation, speed is $speed"
    //% speed.max=100 speed.min=0 speed.defl=100
    export function set_motor(no: MotorNo, dir: MotorDir, speed: number) {
        if (no == MotorNo.motor_1) {
            serial.writeNumbers([0x5A, 0xA0, dir, speed])
        } else if (no == MotorNo.motor_2) {
            serial.writeNumbers([0x5A, 0xA5, dir, speed])
        }
    }
}

