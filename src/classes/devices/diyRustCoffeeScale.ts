import { PeripheralData } from './ble.types';
import { BluetoothScale, SCALE_TIMER_COMMAND, Weight } from './bluetoothDevice';
import { ScaleType } from './index';
import { Logger } from './common/logger';

declare var ble: any;
export class DiyRustCoffeeScale extends BluetoothScale {
  public static DEVICE_NAME = 'coffee-scale';
  public static DATA_SERVICE = '0x181D';
  public static DATA_CHARACTERISTIC = '0x2A9D';
  // Constructor

  // Class Members

  public override batteryLevel: number;
  protected override weight: Weight = {
    actual: 0,
    old: 0,
    smoothed: 0,
    oldSmoothed: 0,
  };
  private logger: Logger;

  constructor(data: PeripheralData, type: ScaleType) {
    super(data, type);
    this.logger = new Logger('RustCoffeeScale');
    this.supportsTaring = false;
    this.connect();
  }

  // Accessors

  /**
   * Checks if this class supports interaction with @param device.
   * @param device The device being checked for support.
   * @returns boolean If support is provided for device.
   */
  public static test(device: any): boolean {
    return (
      device &&
      device.name &&
      device.name.toLowerCase().includes(this.DEVICE_NAME)
    );
  }

  public override getWeight() {
    return this.weight.actual;
  }

  public override getSmoothedWeight() {
    return this.weight.smoothed;
  }

  public override getOldSmoothedWeight() {
    return this.weight.old;
  }

  // Public Methods

  public override async setTimer(command: SCALE_TIMER_COMMAND) {
    this.logger.log('The rust-scale doesnt feature a timer');
  }

  public override async connect() {
    this.logger.log('Connecting...');

    await this.attachNotification();
  }

  /**
   * Tares the Smartchef Scale current weight to 0;
   */
  public override async tare() {
    this.logger.log('Taring is not possible with the rust-scale scale');
  }

  public override disconnectTriggered(): void {
    this.logger.log('Disconnecting...');

    this.deattachNotification();
  }

  // Private Methods

  /**
   * Not supported
   */
  private write(_bytes: number[]) {
    //Not supported
    return null;
  }

  private async attachNotification() {
    ble.startNotification(
      this.device_id,
      DiyRustCoffeeScale.DATA_SERVICE,
      DiyRustCoffeeScale.DATA_CHARACTERISTIC,
      async (_data: any) => {
        this.parseStatusUpdate(_data);
      },
      (_data: any) => {}
    );
  }

  /**
   * Smartchef Scales provide status updates via a 18 length unsigned integer array.
   * @param SmartchefRawStatus The 18 length unsigned integer array retreived from BLE.
   */
  private parseStatusUpdate(_statusUpdate: any) {
    const dataview = new DataView(_statusUpdate);
    const intValue = dataview.getInt32(0, false) ?? 0;

    this.setWeight(intValue / 100.0);
  }

  private async deattachNotification() {
    ble.stopNotification(
      this.device_id,
      DiyRustCoffeeScale.DATA_SERVICE,
      DiyRustCoffeeScale.DATA_CHARACTERISTIC,
      (e: any) => {},
      (e: any) => {}
    );
  }
}
