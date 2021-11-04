enum SerialTxPort{
    //% block="port2"
    Port2 = 1,
    //% block="port4"
    Port4 = 3,
    //% block="port6"
    Port6 = 5,
}
enum SerialRxPort {
    //% block="port2"
    Port2 = 1,
    //% block="port4"
    Port4 = 3,
    //% block="port5"
    Port5 = 4,
}
enum SerialPort {
    //% block="port2"
    Port2 = 1,
    //% block="port4"
    Port4 = 3,
    //% block="port5"
    Port5 = 4,
    //% block="port6"
    Port6 = 5,
}


namespace CXSN_normal{
    const Serial_pin_id = [
        [0, 0, 0],
        [SerialPin.P0, 0, SerialPin.P8],
        [0, 0, 0],
        [SerialPin.P1, SerialPin.P13, SerialPin.P14],
        [0, SerialPin.P15, SerialPin.P16],
        [SerialPin.P2, 0, 0]];

    let serial_tx_p = SerialPin.USB_TX
    let serial_rx_p = SerialPin.USB_RX

    //% blockId=serial_init
    //% block="serial set | tx port:%tx_port tx pin:%tx_p | rx port:%rx_port  rx pin:%rx_p | baud:%number | mode:%mode"
    //% tx_p.min=0 tx_p.max=2 tx_p.defl=0
    //% rx_p.min=0 rx_p.max=2 rx_p.defl=2
    //% baud.defl=9600
    //% group="serial" advanced=true
    export function serial_init(tx_port: SerialPort, tx_p: number, rx_port: SerialPort, rx_p: number, baud: number, mode: Serial_mode) {
        if (mode == Serial_mode._write || mode == Serial_mode._readwrite){
            if (Serial_pin_id[tx_port][tx_p] != 0){
                serial_tx_p = Serial_pin_id[tx_port][tx_p];
            } else {
                serial_tx_p = SerialPin.USB_TX;
            }
        }
        if (mode == Serial_mode._read || mode == Serial_mode._readwrite) {
            if (Serial_pin_id[rx_port][rx_p] != 0) {
                serial_rx_p = Serial_pin_id[rx_port][rx_p];
            }else{
                serial_rx_p = SerialPin.USB_RX;
            }
        }
        serial.redirect(serial_tx_p, serial_rx_p, baud);
    }

    export function tx_serial_init(tx_port: SerialTxPort, tx_p: DigitalPin, baud: number) {
        if (Serial_pin_id[tx_port][tx_p] != 0) {
            serial_tx_p = Serial_pin_id[tx_port][tx_p];
        } else {
            serial_tx_p = SerialPin.USB_TX;
        }
        serial.redirect(serial_tx_p, serial_rx_p, baud);
    }

    export function rx_serial_init(rx_port: SerialRxPort, rx_p: DigitalPin, baud: number) {
        if (Serial_pin_id[rx_port][rx_p] != 0) {
            serial_rx_p = Serial_pin_id[rx_port][rx_p];
        } else {
            serial_rx_p = SerialPin.USB_RX;
        }
        serial.redirect(serial_tx_p, serial_rx_p, baud);
    }
}
