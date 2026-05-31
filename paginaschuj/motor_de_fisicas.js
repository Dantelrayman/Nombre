/*por que accedi a esto???????*/
const logo = document.getElementById('logo-poli');
let timer_explosion;
let ya_exploto = false;

/*aca basicamente empieza a contar hasta 10 para ver si explota o no, si sacas el mouse entonces se reincia el timer*/
logo.addEventListener('mouseenter', () => {
    if (ya_exploto) return;
    timer_explosion = setTimeout(iniciar_explosion, 10000); 
});

logo.addEventListener('mouseleave', () => {
    clearTimeout(timer_explosion);
});

/* todo esto hasta la proxima funcion es para crear los pedazos del logo y que explote todo*/
function iniciar_explosion() {
    ya_exploto = true;
    const rect = logo.getBoundingClientRect();

/*cambio la imagen por la de los 120 años*/
    logo.src = 'logo_poli_120.png';
    logo.style.animation = 'none'; 

    /*muevo la imagen de logo para cada esquina asi quedan 4 pedazos, uno por esquina*/
    const cuadrantes = [
        { posX: '0px', posY: '0px' },      
        { posX: '-30px', posY: '0px' },    
        { posX: '0px', posY: '-30px' },    
        { posX: '-30px', posY: '-30px' }   
    ];

    const pedazos_fisicos = [];

    cuadrantes.forEach(cuadrante => {
        const pedazo = document.createElement('div');
        pedazo.classList.add('pedazo-logo');
        
        /*esto es para ver donde aparece cada pedacito de la exlposion*/
        let startX = rect.left + (cuadrante.posX === '0px' ? 0 : 30);
        let startY = rect.top + (cuadrante.posY === '0px' ? 0 : 30);
        
        pedazo.style.left = startX + 'px';
        pedazo.style.top = startY + 'px';
        pedazo.style.backgroundPosition = `${cuadrante.posX} ${cuadrante.posY}`;
        
        document.body.appendChild(pedazo); /*esto es para agregarlo al html*/

        /*es basicamente serian los datos iniciales como para resolver MRU de fisica*/
        pedazos_fisicos.push({
            elemento: pedazo,
            x: startX,
            y: startY,
            vx: (Math.random() - 0.5) * 25, /*esto y lo de abajo seria lo que hace que salga volando hacia una direccion random*/
            vy: (Math.random() - 0.5) * 25 - 5, 
            arrastrando: false,
            ultimoMouseX: 0,
            ultimoMouseY: 0
        });
    });

    iniciar_motor_fisicas(pedazos_fisicos);
}

/* siendo sincera de aca no tengo ni idea que hacen estas cosas, el codigo es de un random*/
function iniciar_motor_fisicas(pedazos) {
    function actualizar_fisicas() {
        pedazos.forEach(p => {
            if (!p.arrastrando) { 
                p.vy += 0.6; /*gravedad*/

                p.x += p.vx;
                p.y += p.vy;

                /*esto es para que rebote, a salva le gustaria estas matematicas random...*/
                if (p.x <= 0) { p.x = 0; p.vx *= -0.8; } 
                if (p.x >= window.innerWidth - 30) { p.x = window.innerWidth - 30; p.vx *= -0.8; } 
                if (p.y <= 0) { p.y = 0; p.vy *= -0.8; } 
                if (p.y >= window.innerHeight - 30) { 
                    p.y = window.innerHeight - 30; 
                    p.vy *= -0.7; 
                    p.vx *= 0.95; 
                }

                /*esto hace que se cambien las coords visualmente*/
                p.elemento.style.left = p.x + 'px';
                p.elemento.style.top = p.y + 'px';
            }
        });
        requestAnimationFrame(actualizar_fisicas); /*esto me da miedo pero se llama a si misma hasta que deja de moverse todo*/
    }
    actualizar_fisicas();

    /*cuando apretas un pedacito del logo le decis "tate quieto" y se queda quieto*/
    pedazos.forEach(p => {
        p.elemento.addEventListener('mousedown', (e) => {
            e.preventDefault(); 
            p.arrastrando = true;
            p.vx = 0; 
            p.vy = 0;
            p.ultimoMouseX = e.clientX;
            p.ultimoMouseY = e.clientY;
        });
    });

    /*hace que puedas mover los pedacitos al apretarlos y lanzarlos*/
    document.addEventListener('mousemove', (e) => {
        pedazos.forEach(p => {
            if (p.arrastrando) {
                /*mas  matematicas que no termino de entender!!!!!!!!!!!!*/
                p.vx = e.clientX - p.ultimoMouseX;
                p.vy = e.clientY - p.ultimoMouseY;
                
                p.x += p.vx;
                p.y += p.vy;
                
                p.ultimoMouseX = e.clientX;
                p.ultimoMouseY = e.clientY;
                
                p.elemento.style.left = p.x + 'px';
                p.elemento.style.top = p.y + 'px';
            }
        });
    });

    /*se vuelve a actualizar todo y se vuelve a repetir lo de mas arriba para que siga rebotando*/
    document.addEventListener('mouseup', () => {
        pedazos.forEach(p => p.arrastrando = false);
    });
}