const express = require('express')
const app = express()
const port = 3000

app.get('/auth', (req, res) => {
    res.send(JSON.stringify({
        email: "kukkuluuruu",
        isAdmin: true
    }))
});

app.post('/auth', (req, res) => {
    console.log(req.body);
    let resp = {
        denied: [],
        allowed: ['Objects/ParkingService/ParkingFacilities/0049d5c7-d9d7-4790-a30e-2a53cd8b8810']
    };
    console.log(JSON.stringify(resp))
    res.send(JSON.stringify(resp))
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))