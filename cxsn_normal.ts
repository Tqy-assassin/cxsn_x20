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
    //% block="unused"
    _unused = 0,
    //% block="readonly"
    _read = 1,
    //% block="writeonly"
    _write = 2,
}


//% block="cxsn_normal" color="#F02010" weight=100 icon="\uf11b"
//% groups="['normal', 'motor', 'serial']"
//% group 
namespace CXSN_normal {
    let cx_serial: cxsn_serial[] = [new cxsn_serial(), new cxsn_serial(), new cxsn_serial(),
                                    new cxsn_serial(), new cxsn_serial(), new cxsn_serial()];
    // for(let i = 0;i < 6;i++){
    //     cx_serial[i] = new cxsn_serial();
    // }

    const pin_id = [
        [DigitalPin.P0, DigitalPin.P3, DigitalPin.P4],
        [DigitalPin.P1, DigitalPin.P5, DigitalPin.P6],
        [DigitalPin.P2, DigitalPin.P8, DigitalPin.P7],
        [DigitalPin.P9, DigitalPin.P10, DigitalPin.P11],
        [DigitalPin.P13, DigitalPin.P14, DigitalPin.P15],
        [DigitalPin.P16, DigitalPin.P19, DigitalPin.P20]];
    

    //% block="set port %x as serial with %mode mode"
    //% group="serial"
    export function InitSerial(x: PortNo, mode: Serial_mode) {
        cx_serial[x].init(pin_id[x][0], pin_id[x][2], 9600, mode);
        cx_serial[x].begin()
    }

    //% block="set port %x as serial | mode:%mode | tx pin:%tx_p | rx pin:%rx_p"
    //% tx_p.min=0 tx_p.max=2 tx_p.defl=0
    //% rx_p.min=0 rx_p.max=2 rx_p.defl=2
    //% group="serial"
    //% inlineInputMode=inline
    export function InitSerial_Ex(x: PortNo, mode: Serial_mode, tx_p:number, rx_p:number) {
        cx_serial[x].init(pin_id[x][tx_p], pin_id[x][rx_p], 9600, mode);
        cx_serial[x].begin()
    }
    
    //% block="port %x serial write %str"
    //% group="serial"
    export function Serial_Write_String(x: PortNo, str: string) {
        cx_serial[x].write_string(str);
    }

    //% block="port %x serial write %arr"
    //% group="serial"
    export function Serial_Write_Number(x: PortNo, arr: number[]) {
        cx_serial[x].write_numbers(arr);
    }

    //% block="port %x serial read"
    //% group="serial"
    export function Serial_Read(x: PortNo):string {
        return cx_serial[x].read();
    }

    //% block="set port %x LED %state"
    //% state.shadow=toggleOnOff
    //% group="normal"
    export function Set_LED(x: PortNo, state: boolean) {
        if(state)
            pins.digitalWritePin(pin_id[x][0], 0)
        else
            pins.digitalWritePin(pin_id[x][0], 1)
    }

    //% block="Init the motor as %x"
    //% group="motor"
    export function motor_Init(x: PortNo) {
        cx_serial[x].init(pin_id[x][0], pin_id[x][2], 9600, Serial_mode._write);
        cx_serial[x].begin();
    }

    //% block="set %x the %no %dir rotation, speed is %speed"
    //% inlineInputMode = inline
    //% speed.max=100 speed.min=0 speed.defl=100
    //% group="motor"
    export function set_motor(x: PortNo, no: MotorNo, dir: MotorDir, speed: number) {
        if (no == MotorNo.motor_1) {
            cx_serial[x].write_numbers([0x5A, 0xA0, dir, speed]);
        } else if (no == MotorNo.motor_2) {
            cx_serial[x].write_numbers([0x5A, 0xA5, dir, speed]);
        }
    }
}

