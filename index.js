import { express, Server, cors, os } from './dependencies.js'
const SERVER_IP = "192.168.1.28";//CAMBIAR IP SIEMPRE

const expressApp = express(); 
const PORT = 5051;

expressApp.use(cors({ origin: "*" }));
expressApp.use(express.json()) 
expressApp.use('/app', express.static('public - app'));
expressApp.use('/mupi', express.static('public - mupi'));

const httpServer = expressApp.listen(PORT, () => {
;
    console.log(`Server is running, host http://${SERVER_IP}:${PORT}/`);
    console.table({ 
        'Client Endpoint' : `http://${SERVER_IP}:${PORT}/app`,
        'Mupi Endpoint': `http://${SERVER_IP}:${PORT}/mupi` });
});

const io = new Server(httpServer, { path: '/real-time' }); 

io.on('connection', socket => {
    console.log('Conectado', socket.id);

    socket.on('device-size', deviceSize =>{
        socket.broadcast.emit('mupi-size',deviceSize)
    })

    socket.on('tap', click =>{
        socket.broadcast.emit('tapeado-mupi', click)
        console.log('Tapeé');
    })
    
});

let userData;
expressApp.post('/user-data', (req, res) => {
    userData = req.body;
    res.send({Data: `User data is: ${userData}`})
    console.log(userData);
});
