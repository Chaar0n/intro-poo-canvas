// Configuración del canvas
const canvas = document.getElementById('gameCanvas');  // Obtiene el elemento canvas del DOM
const ctx = canvas.getContext('2d');  // Obtiene el contexto 2D del canvas para dibujar

// Clase Ball (Pelota)
class Ball {
  constructor(x, y, radius, speedX, speedY, color) {
    // Inicialización de las propiedades de la pelota
    this.x = x;  // Posición X de la pelota
    this.y = y;  // Posición Y de la pelota
    this.radius = radius;  // Radio de la pelota
    this.speedX = speedX;  // Velocidad de la pelota en el eje X
    this.speedY = speedY;  // Velocidad de la pelota en el eje Y
    this.color = color;  // Color de la pelota
  }

  // Método para dibujar la pelota
  draw() {
    ctx.beginPath();  // Comienza un nuevo camino para dibujar
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);  // Dibuja un círculo en la posición (x, y) con el radio dado
    ctx.fillStyle = this.color;  // Asigna el color de la pelota
    ctx.fill();  // Rellena el círculo con el color
    ctx.closePath();  // Cierra el camino de dibujo
  }

  // Método para mover la pelota
  move() {
    this.x += this.speedX;  // Actualiza la posición X con la velocidad en el eje X
    this.y += this.speedY;  // Actualiza la posición Y con la velocidad en el eje Y

    // Detección de colisión con los bordes superior e inferior del canvas
    if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
      this.speedY = -this.speedY;  // Invertir la dirección en el eje Y si hay colisión
    }
  }

  // Método para resetear la posición de la pelota al centro del canvas
  reset() {
    this.x = canvas.width / 2;  // Resetea la posición X al centro del canvas
    this.y = canvas.height / 2;  // Resetea la posición Y al centro del canvas
    this.speedX = -this.speedX;  // Invierte la dirección en el eje X al resetear
  }
}

// Clase Paddle (Paleta)
class Paddle {
  constructor(x, y, width, height, color, isPlayerControlled = false) {
    // Inicialización de las propiedades de la paleta
    this.x = x;  // Posición X de la paleta
    this.y = y;  // Posición Y de la paleta
    this.width = width;  // Ancho de la paleta
    this.height = height;  // Altura de la paleta
    this.color = color;  // Color de la paleta
    this.isPlayerControlled = isPlayerControlled;  // Indica si la paleta es controlada por el jugador
    this.speed = 4;  // Velocidad de movimiento de la paleta
  }

  // Método para dibujar la paleta
  draw() {
    ctx.fillStyle = this.color;  // Asigna el color de la paleta
    ctx.fillRect(this.x, this.y, this.width, this.height);  // Dibuja un rectángulo en la posición (x, y) con el ancho y altura dados
  }

  // Método para mover la paleta controlada por el jugador
  move(direction) {
    if (direction === 'up' && this.y > 0) {
      this.y -= this.speed;  // Mueve la paleta hacia arriba si no está en el borde superior
    } else if (direction === 'down' && this.y + this.height < canvas.height) {
      this.y += this.speed;  // Mueve la paleta hacia abajo si no está en el borde inferior
    }
  }

  // Método para el movimiento automático de la paleta controlada por la IA
  autoMove(ball) {
    if (ball.y < this.y + this.height / 2) {
      this.y -= this.speed;  // Mueve la paleta hacia arriba si la pelota está por encima
    } else if (ball.y > this.y + this.height / 2) {
      this.y += this.speed;  // Mueve la paleta hacia abajo si la pelota está por debajo
    }
  }
}

// Clase Game (Controla el juego)
class Game {
  constructor() {
    // Crear cinco pelotas con diferentes colores, posiciones y velocidades
    this.balls = [
        new Ball(canvas.width / 2, canvas.height / 2, 10, 4, 3, 'blue'), // Pelota roja, radio, velocidad.
        new Ball(canvas.width / 2, canvas.height / 3, 3, 3, 2, 'grey'), // Pelota azul, radio, velocidad.
        new Ball(canvas.width / 2, canvas.height / 4, 25, 5, 2, 'grey'), // Pelota gris, radio 25, velocidad 4.
        new Ball(canvas.width / 2, canvas.height / 5, 5, 4, 1, 'orange'), // Pelota amarilla, radio, velocidad.
        new Ball(canvas.width / 2, canvas.height / 6, 18, 1, -1, 'cyan') // Pelota púrpura, radio, velocidad.
     ];
  
    // Crea las paletas con diferentes tamaños y colores.
    this.paddle1 = new Paddle(0, canvas.height / 2 - 75, 11, 240, 'green', true); // Paleta del jugador (más grande).
    this.paddle2 = new Paddle(canvas.width - 15, canvas.height / 2 - 50, 11, 110, 'red'); // Paleta de la IA (más pequeña).
    this.keys = {}; // Objeto para almacenar el estado de las teclas presionadas.
  }


  // Método para dibujar todas las pelotas y las paletas
  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpia el canvas antes de dibujar
    this.balls.forEach(ball => ball.draw());  // Dibuja cada pelota
    this.paddle1.draw();  // Dibuja la paleta del jugador
    this.paddle2.draw();  // Dibuja la paleta de la IA
  }

  // Método para actualizar el estado del juego
  update() {
    this.balls.forEach(ball => ball.move());  // Mueve cada pelota

    // Movimiento de la paleta del jugador controlada por las teclas
    if (this.keys['ArrowUp']) {
      this.paddle1.move('up');  // Mueve la paleta hacia arriba si se presiona la flecha hacia arriba
    }
    if (this.keys['ArrowDown']) {
      this.paddle1.move('down');  // Mueve la paleta hacia abajo si se presiona la flecha hacia abajo
    }

    // Movimiento automático de la paleta de la IA
    this.paddle2.autoMove(this.balls[0]);  // La IA sigue la primera pelota

    // Detectar colisiones entre las pelotas y las paletas
    this.balls.forEach(ball => {
      // Colisión con la paleta del jugador
      if (ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
          ball.y >= this.paddle1.y && ball.y <= this.paddle1.y + this.paddle1.height) {
        ball.speedX = -ball.speedX;  // Invertir la dirección en el eje X si hay colisión
      }

      // Colisión con la paleta de la IA
      if (ball.x + ball.radius >= this.paddle2.x &&
          ball.y >= this.paddle2.y && ball.y <= this.paddle2.y + this.paddle2.height) {
        ball.speedX = -ball.speedX;  // Invertir la dirección en el eje X si hay colisión
      }

      // Detectar cuando la pelota sale de los bordes y resetear su posición
      if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
        ball.reset();  // Resetea la posición de la pelota si sale del área de juego
      }
    });
  }

  // Método para capturar las teclas presionadas por el jugador
  handleInput() {
    window.addEventListener('keydown', (event) => {
      this.keys[event.key] = true;  // Marca la tecla como presionada
    });
    window.addEventListener('keyup', (event) => {
      this.keys[event.key] = false;  // Marca la tecla como liberada
    });
  }

  // Método para iniciar el juego
  run() {
    this.handleInput();  // Captura las teclas del jugador
    const gameLoop = () => {
      this.update();  // Actualiza el estado del juego
      this.draw();  // Dibuja el estado actual del juego
      requestAnimationFrame(gameLoop);  // Vuelve a llamar a gameLoop en el próximo frame
    };
    gameLoop();  // Inicia el ciclo del juego
  }
}

// Crear una instancia del juego y ejecutarlo
const game = new Game();  // Crea una nueva instancia de la clase Game
game.run();  // Inicia el juego
