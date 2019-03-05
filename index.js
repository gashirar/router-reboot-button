require('date-utils')
const DashButton = require('dash-button');
const { Client } = require('tplink-smarthome-api')
const {exec} = require('child_process');
const button = new DashButton("XX:XX:XX:XX:XX:XX");


const client = new Client();
let device;
let prev_reboot = jstDate();

function jstDate() {
  let dt = new Date();
  dt.setTime(dt.getTime() + 1000*60*60*9);
  return dt;
}

function toFormat(dt) {
  return dt.toFormat("YYYY/MM/DD HH24:MI:SS");
}

const plug = client.getDevice({host: 'XXX.XXX.XXX.XXX'}).then((dev)=>{
  device = dev;
  dev.getSysInfo().then(console.log);
  dev.setPowerState(true);
});

button.addListener(() => {
  let now = jstDate();
  let diff_seconds = (now.getTime() - prev_reboot.getTime()) / 1000;
  if (diff_seconds > 10) {
    device.setPowerState(false);
    console.log(toFormat(now), " : Rebooting Router...");
    prev_reboot = now;
    setTimeout(() => {
      device.setPowerState(true);
    }, 5000);
  } else {
    console.log(toFormat(now), " : Previous Reboot Time (", toFormat(prev_reboot), ")");
  }
});

console.log("Start...");
