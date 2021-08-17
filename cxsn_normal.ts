enum MotorPortNo {
    //% block="端口1"
    port1 = 0,
    //% block="端口2"
    port2 = 1,
    //% block="端口3"
    port3 = 2,
    //% block="端口4"
    port4 = 3,
    //% block="端口5"
    port5 = 4,
    //% block="端口6"
    port6 = 5
}

enum MotorNo {
    //% block="电机一"
    motor_1 = 0,
    //% block="电机二"
    motor_2 = 1,
}

enum MotorDir {
    //% block="顺时针"
    clockwise = 0,
    //% block="逆时针"
    counterclockwise = 1,
}

//% block="晨旭少年传感器" color="#FA0010" weight=20 icon="\uf11b"
namespace CXSN_motor {
    //% block = "Hello"
    export function helloWorld() {
        basic.showString("Hello World!")
    }

    //% block="初始化电机 端口 $x"
    //% x.defl=MotorPortNo.port1
    export function motor_Init(x: MotorPortNo) {
        serial.redirect(SerialPin.P0, SerialPin.P1, 9600)
        // basic.showNumber(x)
    }

    //% block="设置 $no $dir 旋转  速度 $speed"
    //% speed.max=100 speed.min=0 speed.defl=100
    export function set_motor(no: MotorNo, dir: MotorDir, speed: number) {
        if (no == MotorNo.motor_1) {
            serial.writeNumbers([0x5A, 0xA0, dir, speed])
        } else if (no == MotorNo.motor_2) {
            serial.writeNumbers([0x5A, 0xA5, dir, speed])
        }
    }
}

