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
    //% block="unused"
    _unused = 0,
    //% block="readonly"
    _read = 1,
    //% block="writeonly"
    _write = 2,
    //% block="readwrite"
    _readwrite = 3
}

//% block="cxsn_normal" color="#FA0010" weight=120 icon="\uf11b"
namespace CXSN_normal {
    let pin_id = [
        [AnalogPin.P0, AnalogPin.P3, AnalogPin.P4],
        [AnalogPin.P1, AnalogPin.P5, AnalogPin.P6],
        [AnalogPin.P2, AnalogPin.P7, AnalogPin.P8],
        [AnalogPin.P9, AnalogPin.P10, AnalogPin.P11],
        [AnalogPin.P13, AnalogPin.P14, AnalogPin.P15],
        [AnalogPin.P16, AnalogPin.P19, AnalogPin.P20]];

    export class cxsn_serial {
        _mode: Serial_mode = Serial_mode._unused;
        _rx_pin: DigitalPin;
        _tx_pin: DigitalPin;
        _delay: number = 0;
        _recvDate: string = "";
        _readable:boolean = false;

        constructor(tx: DigitalPin, rx: DigitalPin, baud: number, mode:Serial_mode) {
            this._rx_pin = tx;
            this._tx_pin = rx;
            this._mode = mode;
            this._delay = 1000000 / baud;
            this._readable = false;
        }

        //% block="start $this(port)"
        public begin() {
            if ((this._mode | Serial_mode._read) != 0) {
                control.inBackground(()=>this.reading())
            }
        }
        
        private reading(){
            if ((this._mode | Serial_mode._read) != 0) {
                if (pins.digitalReadPin(this._rx_pin)) {
                    let recvBuf: number = 0;
                    control.waitMicros(this._delay);
                    for (let i = 0; i < 8; i++) {
                        if (pins.digitalReadPin(this._rx_pin)) {
                            recvBuf |= (1 << i)
                        } else {
                            recvBuf &= ~(1 << i)
                        }
                        control.waitMicros(this._delay);
                    }
                    this._recvDate = String.fromCharCode(recvBuf);
                    this._readable = true;
                }
            }
        }

        private writing(transDate: number){
            if ((this._mode | Serial_mode._write) != 0) {
                pins.digitalWritePin(this._tx_pin, 0);
                control.waitMicros(this._delay);
                for (let i = 0; i < 8; i++) {
                    if((transDate & 0x01) == 0){
                        pins.digitalWritePin(this._tx_pin, 0);
                    }else{
                        pins.digitalWritePin(this._tx_pin, 1);
                    }
                    control.waitMicros(this._delay);
                    transDate >>= 1;
                }
                pins.digitalWritePin(this._tx_pin, 1);
            }
        }

        public write(msg: string){
            for(let i = 0;i < msg.length;i++){
                this.writing(msg[i].charCodeAt(0))
            }
        }
        public read(): string {
            let res = this._recvDate;
            this._recvDate = ""
            this._readable = false
            return res;
        }
        public aviable():boolean{
            return this._readable;
        }
    }
    // /**
    //  * Create a Gizmo widget and automtically set it to a variable
    // */
    // //% block="enable %port "
    // //% blockSetVariable=port
    // export function enablePort(port: PortNo): cxsn_serial {
    //     return new cxsn_serial(port);
    // }

    

    //% block="Init the motor as $x"
    //% x.defl=MotorPortNo.port1
    export function motor_Init(x: PortNo) {
        serial.redirect(SerialPin.P0, SerialPin.P1, 9600)
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

