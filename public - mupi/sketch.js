// Aqui se conecta el servidor
const NGROK = `${window.location.hostname}`;
let socket = io(NGROK, {
  path: '/real-time'
});
console.log('192.168.1.28', NGROK);



let deviceWidth, deviceHeight = 0;
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// aqui se nombran las variables del juego
let fps = 0 // 1 ,2 ,3 ,4
const DEGREE = Math.PI / 180

// estados del juego, en que pantalla del juego me encuentro
let pantallamupi = 0 // 1, 2, 3




//cargar imagenes
const imagen = new Image()
imagen.src = './assets/arte_2.png'
const bggame = new Image()
bggame.src = './assets/arte_4.png'
const bgGo = new Image()
bgGo.src = './assets/bgGO_3.png'


// no se esta usando
const estado = {
  actual : 0,
  listo : 0,
  jugando : 1,
  perder : 2
}




// para controlar el juego, pasar de start al juego y de restart a star, tambien controla los saltos del toro

canvas.addEventListener('click', function () {
  switch (pantallamupi) {
    // case 0 pantallamupi (let pantallamupi = 0)
    case 0:
      pantallamupi = 1
      break;
      // case 1 : (variable que contenga funcion flap) tap
    case 1:
      toro.flap(); // funcion para volar del toro
      break;
      case 2:
      pantallamupi = 0
      // reinicia el juego
      tubos.reset();
      toro.reset();
      puntaje.reset();

      break;
     
  }
  

}

)





//Aqui se crea el piso
const piso = {
  sX: 0,
  sY: 668,
  w: 430,
  h: 100,
  x: 0,
  y: canvas.height - 100,
  dx: 2,

  draw: function () {
    ctx.drawImage(imagen, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
    //piso repetido
    ctx.drawImage(imagen, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h)
  },


  // aqui se le da movimiento al piso
  actualizar: function () {
    if (pantallamupi == 1) {
      this.x = (this.x - this.dx) % (this.w / 2)
    }
  }

}

//Aqui se crea el fondo del juego
const bg = {
  sX: 0,
  sY: 0,
  w: 431,
  h: 768,
  x: 0,
  y: 0,

  draw: function () {
    ctx.drawImage(bggame, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
    //fondo repetido
    ctx.drawImage(bggame, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h)
  }

}

//aqui se crea el toro

const toro = {

  animation: [{
      sX: 450,
      sY: 0
    },
    {
      sX: 450,
      sY: 70
    },
    {
      sX: 450,
      sY: 140
    },
    {
      sX: 450,
      sY: 70
    }

  ],

  // variables de posiciones y fisicas
  x: 100,
  y: 250,
  w: 65,
  h: 50,
  radio: 10, // hitbox
  frame: 0,
  gravedad: 0.25,
  salto: 4.6,
  velocidad: 0,
  rotacion: 0,


  draw: function () {
    let toro = this.animation[this.frame]

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotacion);
    ctx.drawImage(imagen, toro.sX, toro.sY, this.w, this.h, -this.w / 2, -this.h / 2, this.w, this.h)
    ctx.restore()

  },
  // fisicas de volar
  flap: function () {
    this.velocidad =- this.salto

  },

  //animacion y juego
  actualizar: function () {
    //si el juego esta en la pantalla start el toro es más lento
    this.velanim = pantallamupi == 0 ? 10 : 5
    // Se incrementan los fps de a 1 por cada estado
    this.frame += fps % this.velanim == 0 ? 1 : 0
    // la animacion cambia entre las imagenes (de 0 a 4) veces y se devuelve a 0
    this.frame = this.frame % this.animation.length // la primera a la segunda imagen y asi hasta llegar a la cuarta y se devuelve 

    // le damos las fisicas al toro
    if (pantallamupi == 0) {
      // aqui se resetea la posicion y velocidad
      this.y = 150
      this.rotacion = 0 * DEGREE


    } else {
      this.velocidad += this.gravedad; // fisica de caer
      this.y += this.velocidad; // la velocidad con la que cae

      // aqui se detecta si se ha perdido o no
      if (this.y + this.h / 2 >= canvas.height - piso.h) {
        this.y = canvas.height - piso.h - this.h / 2
        if (pantallamupi == 1) {
          pantallamupi = 2 // pantalla de perder
        }
      }

      // para que deje de volar
      if (this.velocidad >= this.salto) {
        this.rotacion = 90 * DEGREE;
        this.frame = 1;
      } else {
        this.rotacion = -25 * DEGREE
      }
    }
  },

  // reset de fisicas
  reset: function () {
    this.velocidad = 0


  },


}

// Aqui se crea el mensaje de start y su estado

const start = {
  sX: 5,
  sY: 420,
  w: 210,
  h: 90,
  x: canvas.width / 2 - 100,
  y: canvas.height / 2 - 60,

  draw: function () {
    if (pantallamupi == 0) {


      ctx.drawImage(imagen, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)

    }

  }

}
// Aqui se crea el mensaje de restart y su estado

const restart = {
  sX: 5,
  sY: 520,
  w: 250,
  h: 35,
  x: canvas.width / 2 - 120,
  y: canvas.height / 2  - 200,

  X : 0,
  Y: 0,
  W: 431,
  H: 768,
  posx: 0,
  posy: 0,



  draw: function () {
    if (pantallamupi == 2) {       
      
      ctx.drawImage(bgGo, this.X, this.Y, this.W,this.H, this.posx, this.posy,this.W,this.H) // imagen de fondo 
      ctx.drawImage(imagen, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h) // mensaje de GAME OVER


    }

  }

}




// aqui se crean los tubos

const tubos = {
  posicion: [],

  //tubo de arriba 
  top: {
    sX: 600,
    sY: 285,

  },
  // tubo de abajo
  bottom: {
    sX: 450,
    sY: 284
  },
  w: 100  ,
  h: 480,
  // separacion entre tubos
  gap: 170,
  maxYpos: -150, // que se salgan del canva
  dx: 2,

  // para pintarlos
  draw: function () {
    // para pintar ...
    for (let i = 0; i < this.posicion.length; i++) {
      let p = this.posicion[i];

      let topYpos = p.y // guarda posicion del tubo de arriba
      let bottomYpos = p.y + this.h + this.gap // guarda la pos del tubo de abajo + el gap

      // para el tubo de arriba
      ctx.drawImage(imagen, this.top.sX, this.top.sY, this.w, this.h, p.x, topYpos, this.w, this.h)
      // para el tubo de abajo
      ctx.drawImage(imagen, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYpos, this.w, this.h)


    }
  },
 // añade tubos
  actualizar: function () {
    if (pantallamupi !== 1) return;
    if (fps % 100 == 0) {
      this.posicion.push({
        x: canvas.width,
        y: this.maxYpos * (Math.random() + 1)

      })
    }

    for (let i = 0; i < this.posicion.length; i++) {
      let p = this.posicion[i];

      let bottomPipeYPos = p.y + this.h + this.gap

      //aqui se detecta que nos chocamos
      // para el tubo de arriba
      if (toro.x + toro.radio > p.x && toro.x - toro.radio < p.x + this.w && toro.y + toro.radio > p.y && toro.y - toro.radio < p.y + this.h) {
        pantallamupi = 2
      }
      // para el tubo de abajo
      if (toro.x + toro.radio > p.x && toro.x - toro.radio < p.x + this.w && toro.y + toro.radio > bottomPipeYPos && toro.y - toro.radio < bottomPipeYPos + this.h) {
        pantallamupi = 2
      }

      //aqui se mueven los tubos a la izquierda

      p.x -= this.dx

      // para eliminar los tubos cuando salen del canvas
      if (p.x + this.w <= 0) {
        this.posicion.shift() 
        puntaje.value += 1 // contador de puntaje
        //puntaje.best = Math.max(puntaje.value, puntaje.best)
        //localStorage.setItem('best', puntaje.best)
      }

    }

  },

  reset: function () {
    this.posicion = []

  }

}

// aqui va el puntaje
const puntaje = {
  //best: parseInt(localStorage.getItem('best')) || 0,
  value: 0,

  draw: function () {
    ctx.fillStyle = '#fff'

    if (pantallamupi == 1) {
      ctx.lineWidth = 1;
      ctx.font = '35px Poppins';
      ctx.fillText(this.value, canvas.width / 2, 100) 
    } else if (pantallamupi == 2) {
      // puntaje
      ctx.font = '30px Poppins';
      ctx.lineWidth = 1
      ctx.fillText('Final Score :', canvas.width/2 - 78, canvas.height/2 - 80)
      ctx.font = '40px Poppins';
      ctx.lineWidth = 1
      ctx.fillText(this.value, canvas.width/2 - 5, canvas.height/2)
      ctx.fillStyle = 'white'
      ctx.fillRect(canvas.width/2 - 28, canvas.height/2 + 20, 70, 3)
      
      ctx.font = '18px Poppins';
      ctx.fillText('Now tap again and fill the form in your', canvas.width/2 - 165, canvas.height/2 + 110)
      ctx.fillText('phone to get your reward!', canvas.width/2 - 115, canvas.height/2 + 140)
      // mejor puntaje
      //ctx.lineWidth = 1
      //ctx.fillText(`Best Score : ${this.best}`, canvas.width/2 - 80, canvas.height/2 + 50)

    }
  },

  reset: function () {
    this.value = 0
  }
}

function draw() {

  

    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    bg.draw();
    tubos.draw();
    piso.draw();
    toro.draw();
    start.draw();
    restart.draw()
    puntaje.draw();



  


}

function actualizar() {
  toro.actualizar();
  piso.actualizar();
  tubos.actualizar();
}

function loop() {
  draw()
  actualizar()
  fps++

  requestAnimationFrame(loop)
}

loop()

// indica que dispositivo se concetó
socket.on('mupi-size', deviceSize => {
  let {
    deviceType,
    windowWidth,
    windowHeight
  } = deviceSize;
  deviceWidth = windowWidth;
  deviceHeight = windowHeight;
  console.log(`User is using an ${deviceType} smartphone size of ${deviceWidth} and ${deviceHeight}`);
});

socket.on('tapeado-mupi', click => {
  console.log(click)
  
  pantallamupi = click
  toro.flap();
  
})
