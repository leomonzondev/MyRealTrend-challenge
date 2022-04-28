import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'
import http from 'http'
import { isStringObject } from 'util/types'


const app = express()
const PORT = 3001

const server = http.createServer(app)

app.use(cors())

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods:['GET', 'POST']
    }
})

const candidates = {
    "voteA": 0,
    "voteB": 0
}

const products = {
    productA: {
        title:'',
        description:'',
        image:'',
        load:false
    },
    productB: {
        title:'',
        description:'',
        image:'',
        load: false
    }
}

const percentages ={
    perA: 0,
    perB: 0
}

let pauseState = false


const users = []

io.on('connection', socket => {

    socket.emit('users', socket.id)

    socket.on('vote', index => {
        if(index === 0) {
            candidates.voteA += 1
        }
        if(index === 1) {
            candidates.voteB += 1
        }
        
        io.emit('vote', candidates)

    })

    socket.on('reset', () => {
        candidates.voteA = 0
        candidates.voteB = 0
        percentages.perA = 0
        percentages.perB = 0
        products.productA = {
            title: '',
            description: '',
            image: '',
            load: false
        }
        products.productB = {
            title: '',
            description: '',
            image: '',
            load: false
        }

        io.emit('vote', candidates)
        io.emit('item', products)
        io.emit('percentage', percentages)
    })

    socket.on('pause', btnState => {
        io.emit('pause', !btnState)
    })
    

    socket.on('loadProduct', (clientProduct) => {
        const pA = products.productA
        const pB = products.productB

        if (pA.load == true) {
            pB.title = clientProduct.title
            pB.description = clientProduct.price
            pB.image = clientProduct.thumbnail
            pB.load = true
        } else {
            pA.title = clientProduct.title
            pA.description = clientProduct.price
            pA.image = clientProduct.thumbnail
            pA.load = true
        }
        
        console.log('product recibido')
        io.emit('item', products)
        console.log(products)
    })

    socket.on('connection', () => {
        io.emit('vote',candidates)
        io.emit('item', products)
        io.emit('update', percentages)
        // console.log(socket.id, 'Connected')
    })

    socket.on('disconnect', () => {
        // console.log('User Disconnected', socket.id)
    })




})

// io.on('connection', socket => {
    
//     socket.on('send_message', data => {
//         socket.emit('receive_message', data)
//     })

// })


server.listen(PORT, () => {
    console.log(`SV running on port ${PORT}`)
})