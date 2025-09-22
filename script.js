// const mqtt = require('mqtt');
const options = {
    host: "8063d0822b7649778b3dea7707a3b667.s1.eu.hivemq.cloud",
    port: 8884,
    protocol: "wss",
    username: "admin",
    password: "A1234567b",
    clientId: "Faker",
    rejectUnauthorized: false,
};

// alert("connecting")
const client = mqtt.connect('wss://8063d0822b7649778b3dea7707a3b667.s1.eu.hivemq.cloud:8884/mqtt', options);
client.connect();

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    document.getElementById('connected').style.backgroundColor = 'green'
});

client.on('error', ()=>{
    alert(error)
})


client.on('disconnect', () => {
    alert("disconnected")
    console.log('Disonnected to MQTT broker');
    document.getElementById('connected').style.backgroundColor = 'red'
});

client.on('reconnect', () => {
    console.log('Reconnecting to MQTT broker');
    document.getElementById('connected').style.backgroundColor = 'yellow'
});

// document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById("low_water").addEventListener("click", ()=>{
        client.publish("low_water", "14");
    })

    // document.getElementById("graph").addEventListener("click", ()=>{
    // const topics = [
    //   "humidity/history",
    //   "light-level/history",
    //   "water/history"
    // ]

    // topics.forEach((topic) => {
    //   let msg = "";
    //   let data = Array.from({ length: 50 }, (_, i) => ({
    //     date: Date.now() - (49 - i) * 3600 * 1000,
    //     value: (Math.sin(i/2.5)+1.5)/3 + (Math.random()-0.5)/3
    //   }))

    //   data.forEach((v)=>{
    //     msg+=v.date;
    //     msg+=":"
    //     msg+=v.value
    //     msg+=","
    //   })

    //   // msg=' ';

    //   client.publish(topic, msg, {retain: true})
    // })})

    document.getElementById("current").addEventListener("click", ()=>{
        client.publish("light-level/curr", String(Math.random() * 2000 + 5000))
        client.publish("humidity/curr", String(Math.random() * 100));
        client.publish("water/curr", "14");
    })

    document.getElementById("low_light").addEventListener("click", ()=>{
        client.publish("light-level/alert", "1246")
    })

    document.getElementById("reset").addEventListener("click", ()=>{
        client.publish("light-level/alert", "", {retain: true})
    })

    document.getElementById("continuous").addEventListener("click", async ()=>{
        let hums = [];
        let lvls = [];
        let lights = [];
        const startTime = Date.now()
        const startLevel = 18;

        let lstTime = Date.now();
        let duration = 5000;
        let curr = 0;

        while(true) {
            const hum = 65 + Math.random()*3 - 1.5 - (startLevel - (Date.now()-startTime)/400000)
            client.publish("humidity/curr", String(hum))
            hums.push(hum);
            
            let msg = "";
            let data = Array.from({ length: Math.min(hums.length, 100) }, (_, i) => ({
                date: i,
                value: hums[i]
            }))

            data.forEach((v)=>{
                msg+=v.date;
                msg+=":"
                msg+=v.value
                msg+=","
            })

            client.publish("humidity/history", msg);

            client.publish("water/curr", String(Math.round(startLevel - (Date.now()-startTime)/50000)))
            lvls.push(startLevel - (Date.now()-startTime)/50000)

            msg = "";
            data = Array.from({ length: Math.min(lvls.length, 100) }, (_, i) => ({
                date: i,
                value: lvls[i]
            }))

            data.forEach((v)=>{
                msg+=v.date;
                msg+=":"
                msg+=v.value
                msg+=","
            })

            client.publish("water/history", msg);

            if(Date.now()-lstTime > duration) {
                curr = Math.random() * 100 - 50;
                duration = Math.random() * 10000;
                lstTime = Date.now();
            }

            const light = curr + 1224 + Math.random()*3 - 1.5
            client.publish("light-level/curr", String(light))
            lights.push(light);
            
            msg = "";
            data = Array.from({ length: Math.min(lights.length, 100) }, (_, i) => ({
                date: i,
                value: lights[i]
            }))

            data.forEach((v)=>{
                msg+=v.date;
                msg+=":"
                msg+=v.value
                msg+=","
            })

            client.publish("light-level/history", msg);

            await sleep(1000);
        }
    })
// })

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}