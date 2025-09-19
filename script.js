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

    document.getElementById("graph").addEventListener("click", ()=>{
    const topics = [
      "humidity/history",
      "light-level/history",
      "water/history"
    ]

    topics.forEach((topic) => {
      let msg = "";
      let data = Array.from({ length: 50 }, (_, i) => ({
        date: Date.now() - (49 - i) * 3600 * 1000,
        value: (Math.sin(i/2.5)+1.5)/3 + (Math.random()-0.5)/3
      }))

      data.forEach((v)=>{
        msg+=v.date;
        msg+=":"
        msg+=v.value
        msg+=","
      })

      // msg=' ';

      client.publish(topic, msg, {retain: true})
    })})

    document.getElementById("current").addEventListener("click", ()=>{
        client.publish("light-level/curr", String(Math.random() * 2000 + 5000))
        client.publish("humidity/curr", String(Math.random() * 100));
        client.publish("water/curr", "14");
    })

    document.getElementById("low_light").addEventListener("click", ()=>{
        client.publish("light-level/alert", "1246")
    })
// })