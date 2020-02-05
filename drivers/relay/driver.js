"use strict";

const Homey = require("homey");

class RelayDriver extends Homey.Driver {
  onInit() {
    this.log("HDL RelayDriver has been initiated");
  }

  updateRelayValue(id, channel, level) {
    let combinedId = `${Homey.ManagerSettings.get(
      "hdl_subnet"
    )}.${id}.${channel}`;
    let address = `${Homey.ManagerSettings.get("hdl_subnet")}.${id}`;
    let homeyDevice = this.getDevice({
      id: combinedId,
      address: address,
      channel: channel
    });
    if (homeyDevice instanceof Error) return;
    if (level == 0) {
      homeyDevice.setCapabilityValue("onoff", false).catch(this.error);
    } else {
      homeyDevice.setCapabilityValue("onoff", true).catch(this.error);
    }
  }

  onPairListDevices(data, callback) {
    if (this.isBusConnected == false) {
      this.error(
        "The bus is not connected. Make sure you have defined the settings"
      );
      return;
    }

    this.log("onPairListDevices from Dimmer");

    const devices = [];
    this._bus().on("command", function(command) {
      if (
        Homey.app.devicelist["relays"][command.sender.type.toString()] !=
        undefined
      ) {
        var i;
        for (
          i = 1;
          i <
          Homey.app.devicelist["relays"][command.sender.type.toString()][
            "channels"
          ] +
            1;
          i++
        ) {
          devices.push({
            name: `HDL Relay (${Homey.ManagerSettings.get("hdl_subnet")}.${
              command.sender.id
            } ch ${i})`,
            data: {
              id: `${Homey.ManagerSettings.get("hdl_subnet")}.${
                command.sender.id
              }.${i}`,
              address: `${Homey.ManagerSettings.get("hdl_subnet")}.${
                command.sender.id
              }`,
              channel: i
            }
          });
        }
      }
    });

    this._bus().send("255.255", 0x000e, function(err) {
      if (err) {
        console.log(err);
      }
    });

    setTimeout(() => {
      callback(null, devices);
    }, 10000);
  }

  _bus() {
    return Homey.app.bus();
  }
}

module.exports = RelayDriver;
