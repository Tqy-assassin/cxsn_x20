// 在此处添加您的代码

class cxsn_serial {
    _mode: Serial_mode = Serial_mode._unused;
    _rx_pin: DigitalPin;
    _tx_pin: DigitalPin;
    _delay: number = 0;
    _recvDate: Array<number>;

    constructor() { }

    public init(tx: DigitalPin, rx: DigitalPin, baud: number, mode: Serial_mode) {
        this._rx_pin = tx;
        this._tx_pin = rx;
        this._mode = mode;
        this._delay = 1000000 / baud;
    }

    public reInit(tx: DigitalPin, rx: DigitalPin, baud: number, mode: Serial_mode) {
        this._rx_pin = tx;
        this._tx_pin = rx;
        this._mode = mode;
        this._delay = 1000000 / baud;
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
                this._recvDate.push(recvBuf);
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
        let ret = "";
        while (this.available()) {
            let res = this._recvDate.shift();
            ret += String.fromCharCode(res);
        }
        return ret;
    }
    public available(): boolean {
        return this._recvDate.length > 0;
    }
}