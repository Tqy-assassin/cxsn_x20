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
    export class cxsn_serial {
        _mode: Serial_mode = Serial_mode._unused;
        _rx_pin: DigitalPin;
        _tx_pin: DigitalPin;
        _delay: number = 0;
        _recvDate: string = "";
        _readable: boolean = false;

        constructor() {}

        public init(tx: DigitalPin, rx: DigitalPin, baud: number, mode: Serial_mode) {
            this._rx_pin = tx;
            this._tx_pin = rx;
            this._mode = mode;
            this._delay = 1000000 / baud;
            this._readable = false;
        }

        public reInit(tx: DigitalPin, rx: DigitalPin, baud: number, mode: Serial_mode) {
            this._rx_pin = tx;
            this._tx_pin = rx;
            this._mode = mode;
            this._delay = 1000000 / baud;
            this._readable = false;
        }

        public begin() {
            if ((this._mode | Serial_mode._read) != 0) {
                control.inBackground(() => this.reading())
            }
        }

        private reading() {
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

        private writing(transDate: number) {
            if ((this._mode | Serial_mode._write) != 0) {
                pins.digitalWritePin(this._tx_pin, 0);
                control.waitMicros(this._delay);
                for (let i = 0; i < 8; i++) {
                    if ((transDate & 0x01) == 0) {
                        pins.digitalWritePin(this._tx_pin, 0);
                    } else {
                        pins.digitalWritePin(this._tx_pin, 1);
                    }
                    control.waitMicros(this._delay);
                    transDate >>= 1;
                }
                pins.digitalWritePin(this._tx_pin, 1);
            }
        }

        public write_string(msg: string) {
            for (let i = 0; i < msg.length; i++) {
                this.writing(msg[i].charCodeAt(0))
            }
        }
        public write_numbers(nums: number[]) {
            for (let i = 0; i < nums.length; i++) {
                this.writing(nums[i])
            }
        }
        public read(): string {
            let res = this._recvDate;
            this._recvDate = ""
            this._readable = false
            return res;
        }
        public aviable(): boolean {
            return this._readable;
        }
    }
    
    let cx_serial: cxsn_serial[] = [new cxsn_serial(), new cxsn_serial(), new cxsn_serial(),new cxsn_serial(), new cxsn_serial(), new cxsn_serial()];
    // for(let i = 0;i < 6;i++){
    //     cx_serial[i] = new cxsn_serial();
    // }

    const pin_id = [
        [DigitalPin.P0, DigitalPin.P3, DigitalPin.P4],
        [DigitalPin.P1, DigitalPin.P5, DigitalPin.P6],
        [DigitalPin.P2, DigitalPin.P7, DigitalPin.P8],
        [DigitalPin.P9, DigitalPin.P10, DigitalPin.P11],
        [DigitalPin.P13, DigitalPin.P14, DigitalPin.P15],
        [DigitalPin.P16, DigitalPin.P19, DigitalPin.P20]];
    
    // export function NewSerial(tx: DigitalPin, rx: DigitalPin, baud: number, mode: Serial_mode): cxsn_serial {
    //     return new cxsn_serial(tx, rx, baud, mode);
    // }
    

    //% block="Init the motor as $x"
    export function motor_Init(x: PortNo) {
        cx_serial[x].init(pin_id[x][0], pin_id[x][2], 9600, Serial_mode._write);
    }

    //% block="set %x the $no $dir rotation, speed is $speed"
    //% inlineInputMode = inline
    //% speed.max=100 speed.min=0 speed.defl=100
    export function set_motor(x: PortNo, no: MotorNo, dir: MotorDir, speed: number) {
        if (no == MotorNo.motor_1) {
            cx_serial[x].write_numbers([0x5A, 0xA0, dir, speed]);
        } else if (no == MotorNo.motor_2) {
            cx_serial[x].write_numbers([0x5A, 0xA5, dir, speed]);
        }
    }
}

