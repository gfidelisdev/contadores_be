var express = require('express')
const supertest = require("supertest")
let request = supertest("http://localhost:8765")

describe("Routes", ()=>{
    it('Should return a list of failures by the given printers and start and end time', ()=>{
        return request.post('/api/failures')
            .send({
                "printers": [
                    {
                        "id":20,
                        "sn":"BRBSQ230P9",
                        "ip":"10.4.11.215",
                        "type":"M"
                    },
                    {
                        "id":31,
                        "sn":"BRBSQ230GQ",
                        "ip":"10.4.76.81",
                        "type":"M"
                    }
                ],
                "startTime": "2023-01-10 00:00:00",
                "endTime": "2023-01-11 00:00:00"
            })
            .then(res=>{
                console.log(res._body)
                expect(res.statusCode).toEqual(200)
                expect(res._body).toEqual(
                    expect.arrayContaining([])
                )
            })
        })
    })