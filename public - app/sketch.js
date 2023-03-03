const NGROK = `${window.location.hostname}`;
console.log('192.168.1.28', NGROK);
let socket = io(NGROK, { path: '/real-time' });
let controllerX, controllerY = 0
let canvas;
// se declara la variable que se enviará al mupi
let pantallajuego = 1


let mensaje = 'Tap'
let user = {};

console.log(socket)
function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    controllerX = windowWidth / 2  
    controllerY = windowHeight / 2  

    const userAgent = window.navigator.userAgent
    let deviceType

    if (/iPhone | iPad/.test(userAgent)) {
      deviceType = 'iOS'
    } else if (/Android/.test(userAgent)){
      deviceType = 'Android'
    }else {
      deviceType = 'Other'
    }

    socket.emit('device-size', {deviceType, windowWidth,windowHeight})
}

    /*
    
    //Botones de Cambio de pantalla
    boton = createButton('Cambiar Pantalla');
    boton.position(anchoescenario / 4 * 2.8, largoescenario);
    boton.mousePressed(cambiaPantallas);
    boton2 = createButton('Pasar al formulario');
    boton2.position(anchoescenario / 4 * 2.8, largoescenario);
    boton2.mousePressed(cambiaPantallas);

    //Recolectar datos del usuario
    inputName = createInput();
    inputName.input(UserName);
    inputName.position(anchoescenario / 2 ,260);
    inputEmail = createInput();
    inputEmail.input(UserEmail);
    inputEmail.position(anchoescenario / 2 ,300);
    sumit = createButton('Enviar');
    sumit.mousePressed(function () {
      userData(user);
      console.log(user);
  });
    sumit.position(anchoescenario / 4 * 2.8, largoescenario);
  }

  function UserName() {
    user['name'] = this.value();
}

function UserEmail() {
    user['email'] = this.value();
}

*/



  function draw() {
    background(0);
    
   /* switch (pantallas) {
      //Pantalla de tap para pasar al juego y que funciona durante el juego
      case 1:
        inputName.style('display', 'none');
        inputEmail.style('display', 'none');
        boton2.style('display', 'none');
        sumit.style('display', 'none');
        textSize(30);
        text('Tap the button', anchoescenario / 3, 200);     
        rect(480, 260, 300,300);
        break;

        //Pantalla de perdida del juego
          case 2: 
          boton2.style('display', 'block');
          fill(51);
          text('Aquí perdiste y procede el formulario', 460, 360);
          
          break
        //Pantalla de Formulario
          case 3:
          fill(51);
          text('Este es el formulario', 520, 160);
          text('Nombre', 620, 300);
          text('Email', 620, 260);
          boton2.style('display', 'none');
          inputName.style('display', 'block');
          inputEmail.style('display', 'block');
          sumit.style('display', 'block');
          
      default:
        break;
    }
    */
  }



function touchStarted() {
  // console.log("Entro")

 socket.emit('tap', pantallajuego)


}


  //Function de guardar usuarios
  async function userData() {
    const data = {
        method: 'POST',
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(user)
    }
    await fetch('/user-data', data);

}



