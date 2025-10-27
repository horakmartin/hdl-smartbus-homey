[Back to the main page](index.md)

# Multisensors (8-in-1 12-in-1 and humidity sensors)
HDL have a wide range of different units with several different sensors in them. Rather then adding individual drivers for them in Homey, they are added as a multisensor.

## Capabilities
As you can see in [hdl_devicelist.js](https://github.com/alydersen/hdl-smartbus-homey/blob/v3/hdl/hdl_devicelist.js), multisensors have a main capability, most often "alarm_motion". When you add a new multisensor, only this main capability are added, and others are added when signals containing their state is received. The potential capabilites are:
- alarm_motion
- dry_contact_1
- dry_contact_2
- dry_contact_3
- dry_contact_4
- measure_temperature
- measure_luminance
- measure_humidity

Keep in mind that since homey needs to have received a signal containing the capability's state before the capability is added, several minutes can go by before you have a device with all it's capabilites in Homey.

### Exclusions
Sometimes the signal from a device will contain state for a capability that is not supported for it. [hdl_devicelist.js](https://github.com/alydersen/hdl-smartbus-homey/blob/master/hdl/hdl_devicelist.js) contains a "exclude" option for these per device type, so that it will be disregarded. If you want more added here - follow the [Contribution guidelines](CONTRIBUTING.md)

## Making motion stable
The different multisensor types handles motion a bit different, making trusting the signal received a bit difficult. If you want this to be stable, configure your sensor to send an Universal Switch (UVS) with the value set to "ON" to the device ID of your Homey app. The UVS number that the app will expect is 212, but you can change this in the settings. The ID of your Homey App is configured in your settings. You should also add a similar action for "OFF" sent to the same ID.

## Using timeouts to turn lights off after X amount of time
Homey has built in support for flows to be triggered when zones become active or have been inactive for some time. You can use this to trigger actions like turning on/off lights in Homey, so that it is easier to have lights on for a period of time after motion have been detected. With advanced flow, you can also make this react differently based on the time of day, having e.g. the lights on your bathroom be dimmed low when motion is detected at night.

## Humidity readings
We have found that some units reports humidity values even though they don't have the sensors. This normally results in a reading of 255%. Any reading outside the 0 to 100 scope will be disregarded.
## Dry Contacts
Some multisensors have one or more dry contacts. These are "sensors" allowing you to connect different equipment and react if the equipment closes the circuit (e.g. with a magnetic contact sensor). These types of sensors are either "NO" or "NC", meaning that they are either Normally Open or Normally Closed, and you can configure this in the HDL configuration of the multisensor for some sensor types (e.g. 8-in-1). A NO sensor will trigger if the circuit is closed, and visa-versa for NC.

Because special flow cards are added for these dry contacts, you can trigger flows based on their state. Be aware that not all sensor types (models) sends out a signal when the state of a dry contact changes, so for them the state won't be updated before a state update request is sent from the App (every 60 seconds). If you want this to be fast, set up your multisensor by logic to activate an Universal Switch when the Dry Contact is triggered, and deactivate it when it is not triggered. You can then base your flow on the Universal Switch.

The dedicated **Dry Contact** driver covers standalone HDL-MSD modules (4/6/8 inputs) and exposes up to eight capabilities (`dry_contact_1` ... `dry_contact_8`) together with an optional temperature reading for the T/A variants.

