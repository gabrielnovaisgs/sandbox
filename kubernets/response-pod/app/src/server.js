import exporess from 'express';
import os from 'os'
const app = exporess()
const port = 3000

function getLocalIpAddress() {
    const networkInterface = os.networkInterfaces()
    const ips = []
    Object.keys(networkInterface).forEach(key => {
        const ipv4 = networkInterface[key].filter(inter => (inter.family === 'IPv4' && inter.internal === false))
        if(ipv4.length > 0){

            ips.push(ipv4.flatMap(ip => ({[key]: ip.address})))
        }
    })
    
    return ips
}

app.get('/', (req, res)=> {
    console.log(os.hostname())
    const ips = getLocalIpAddress()
    return res.json(ips.flatMap(item => item))
})

app.listen(port, ()=> {

    console.log("listen on http://localhost:3000")
})