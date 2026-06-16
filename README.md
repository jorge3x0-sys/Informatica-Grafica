<<<<<<< HEAD
# Fabrica API (Node.js + Express)

API propia del Digital Twin de la fábrica inteligente. Sustituye a `API.py` (Flask)
porque el enunciado exige Node.js + Express desplegado en Render.com.

## Ejecutar en local

```bash
npm install
npm start
```

Por defecto escucha en el puerto 5000: http://localhost:5000

Pruebas rápidas:
```bash
curl http://localhost:5000/fabrica
curl http://localhost:5000/puerta
curl -X POST http://localhost:5000/puerta -H "Content-Type: application/json" -d "{\"estado\":\"ABIERTA\",\"ultimoAcceso\":\"RFID\"}"
curl -X POST http://localhost:5000/prensa  -H "Content-Type: application/json" -d "{\"estado\":\"TRABAJANDO\"}"
curl -X POST http://localhost:5000/generador -H "Content-Type: application/json" -d "{\"nivelEnergia\":18}"
```

## Desplegar en Render.com

1. Sube esta carpeta (`fabrica-api`) a un repositorio de GitHub.
2. En Render.com: **New +** → **Web Service** → conecta el repositorio.
3. Configuración:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
4. Render asigna automáticamente la variable `PORT`; el código ya la usa
   (`process.env.PORT || 5000`), no toques nada.
5. Tras el despliegue obtendrás una URL del tipo:
   `https://fabrica-api-xxxx.onrender.com`
6. Usa esa URL en Unity en vez de `http://127.0.0.1:5000`.

## Endpoints

| Método | Ruta             | Descripción                                  |
|--------|------------------|-----------------------------------------------|
| GET    | `/`              | Comprobación de que la API está viva           |
| GET    | `/fabrica`       | Estado completo (puerta + prensa + generador)  |
| GET    | `/puerta`        | Estado de la puerta                            |
| POST   | `/puerta`        | Actualiza `{ estado, ultimoAcceso }`           |
| GET    | `/prensa`        | Estado de la prensa                            |
| POST   | `/prensa`        | Actualiza `{ estado, ciclos, error }`          |
| POST   | `/prensa/ciclo`  | Incrementa el contador de ciclos en +1         |
| GET    | `/generador`     | Estado del generador                           |
| POST   | `/generador`     | Actualiza `{ estado, nivelEnergia, consumo }`  |
| POST   | `/alarma`        | Activa/desactiva la alarma general `{ alarma }`|
| GET    | `/mantenimiento` | Compatibilidad con el script original Unity    |

## Nota sobre el estado en memoria

El estado se guarda en una variable JS en memoria (`estadoFabrica`). Esto es
suficiente para el proyecto, pero significa que si Render reinicia el servicio
(por inactividad en el plan gratuito) el estado vuelve a los valores por
defecto definidos en `server.js`.
=======
# Informatica-Grafica
>>>>>>> 5374d8e71be414bcfc58eeaf7bf4ad51cf403617
