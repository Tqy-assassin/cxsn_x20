
namespace CXSN_normal{
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

    //% fixedInstances
    //% block="serial"
    export class cxsn_serial {
        private _mode: Serial_mode = Serial_mode._unused;
        private _rx_pin: DigitalPin;
        private _tx_pin: DigitalPin;
        private _delay: number = 0;
        private _recvBuf: Array<number>;

        
        constructor(tx_pin: DigitalPin, rx_pin: DigitalPin) {
            this._mode = Serial_mode._unused
            this._delay = 0
            this._recvBuf = []
            this._rx_pin = rx_pin
            this._tx_pin = tx_pin
        }

        //% blockId=InitSerial
        //% block="%serial set mode:%mode"
        //% group="serial"
        public init(mode: Serial_mode) {
            this._mode = mode;
            this._delay = 1000000 / 9600 - 12;
            this.begin()
        }


        //% blockId=InitSerial_Ex
        //% block="%serial set | tx pin:%tx_p | rx pin:%rx_p | baud:%number | mode:%mode"
        //% tx_p.min=0 tx_p.max=2 tx_p.defl=0
        //% rx_p.min=0 rx_p.max=2 rx_p.defl=2
        //% baud.defl=9600
        //% group="serial"
        init_Ex(tx_p: DigitalPin, rx_p: DigitalPin, baud: number, mode: Serial_mode) {
            this._rx_pin = rx_p;
            this._tx_pin = tx_p;
            this._mode = mode;
            this._delay = 1000000 / baud - 12;
            this.begin()
        }

        public begin() {
            if (this._mode == Serial_mode._write || this._mode == Serial_mode._readwrite) {
                pins.digitalWritePin(this._tx_pin, 1)
            }else{
                pins.digitalWritePin(this._tx_pin, 0)
            }
            if (this._mode == Serial_mode._read || this._mode == Serial_mode._readwrite) {
                control.inBackground(() => this.reading())
            }
        }

        private reading() {
            while (this._mode == Serial_mode._read || this._mode == Serial_mode._readwrite) {
                if (pins.digitalReadPin(this._rx_pin) == 0) {
                    let recvDate: number = 0;
                    let i = 0;
                    control.waitMicros(this._delay - 30);
                    for (; i < 8; i++) {
                        if (pins.digitalReadPin(this._rx_pin) == 1) {
                            recvDate |= (1 << i)
                        } else {
                            recvDate &= ~(1 << i)
                        }
                        control.waitMicros(this._delay);
                    }
                    this._recvBuf.push(recvDate);
                } else {
                    control.waitMicros(100);
                }
            }
        }

        private writing(transDate:number) {
            if (this._mode == Serial_mode._write || this._mode == Serial_mode._readwrite) {
                let i = 0;
                // let timer : number;
                // timer = control.micros();
                pins.digitalWritePin(this._tx_pin, 0);
                control.waitMicros(this._delay - 30);
                for (; i <= 7; i++) {
                    if ((transDate & (1 << i)) == 0) {
                        pins.digitalWritePin(this._tx_pin, 0);
                    } else {
                        pins.digitalWritePin(this._tx_pin, 1);
                    }
                    control.waitMicros(this._delay);
                }
                pins.digitalWritePin(this._tx_pin, 1);
                control.waitMicros(this._delay * 2);
            }
        }

        //% blockId=Serial_Write_String
        //% block="%serial serial write %msg"
        //% group="serial"
        write_string(msg: string) {
            for (let i = 0; i < msg.length; i++) {
                this.writing(msg[i].charCodeAt(0))
            }
        }

        //% blockId=Serial_Write_Number
        //% block="%serial write %arr"
        //% group="serial"
        write_numbers(arr: number[]) {
            for (let i = 0; i < arr.length; i++) {
                this.writing(arr[i])
            }
        }


        //% blockId=Serial_Read
        //% block="%serial read"
        //% group="serial"
        read(): string {
            let ret = "";
            while (this.available()) {
                let res = this._recvBuf.shift();
                ret += String.fromCharCode(res);
            }
            return ret;
        }


        //% blockId=Serial_Available
        //% block="%serial read available"
        //% group="serial"
        available(): boolean {
            return this._recvBuf.length > 0;
        }
    }

    //% block="serial Port1" fixedInstance whenUsed
    export const Port1 = new cxsn_serial(pin_id[0][0], pin_id[0][2]);
    //% block="serial Port2" fixedInstance whenUsed
    export const Port2 = new cxsn_serial(pin_id[1][0], pin_id[1][2]);
    //% block="serial Port3" fixedInstance whenUsed
    export const Port3 = new cxsn_serial(pin_id[2][0], pin_id[2][2]);
    //% block="serial Port4" fixedInstance whenUsed
    export const Port4 = new cxsn_serial(pin_id[3][0], pin_id[3][2]);
    //% block="serial Port5" fixedInstance whenUsed
    export const Port5 = new cxsn_serial(pin_id[4][0], pin_id[4][2]);
    //% block="serial Port6" fixedInstance whenUsed
    export const Port6 = new cxsn_serial(pin_id[5][0], pin_id[5][2]);
}
