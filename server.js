// server.js
// API propia del Digital Twin - Node.js + Express
// Desplegada en Render.com
//
// Endpoints:
//   GET  /                -> estado de salud (para comprobar que la API vive)
//   GET  /fabrica          -> estado completo (puerta + prensa + generador + alarma)
//   GET  /puerta            -> estado de la puerta
//   GET  /prensa             -> estado de la prensa
//   GET  /generador           -> estado del generador
//   GET  /mantenimiento        -> compatibilidad con el script "modo maquina.cs" original
//   POST /puerta              -> actualizar estado de la puerta
//   POST /prensa               -> actualizar estado de la prensa
//   POST /generador             -> actualizar estado del generador
//   POST /alarma                  -> activar / desactivar la alarma general

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// --------------------------------------------------------------------------
// Estado en memoria de toda la fábrica (esto simula la "base de datos" del
// Digital Twin; en una versión más avanzada esto se sustituiría por una
// base de datos real, pero para el proyecto basta con memoria del proceso).
// --------------------------------------------------------------------------
let estadoFabrica = {
  modoFabrica: "AUTOMATICO",
  alarma: false,
  puerta: {
    estado: "CERRADA",       // ABIERTA | CERRADA | BLOQUEADA | DENEGADO
    ultimoAcceso: "NINGUNO"  // RFID | RAYCAST | TRIGGER
  },
  prensa: {
    estado: "APAGADA",       // APAGADA | ENCENDIDA | TRABAJANDO | ERROR | MANTENIMIENTO
    ciclos: 0,
    error: false
  },
  generador: {
    estado: "NORMAL",        // NORMAL | BAJO_CONSUMO | CRITICO
    nivelEnergia: 100,
    consumo: 0
  }
};

// --------------------------------------------------------------------------
// GET /  -> sanity check, útil para comprobar que Render ha desplegado bien
// --------------------------------------------------------------------------
app.get("/", (req, res) => {
  res.json({ ok: true, mensaje: "API Digital Twin Fábrica Inteligente funcionando" });
});

// --------------------------------------------------------------------------
// GET /fabrica -> devuelve TODO el estado en un único JSON
// (formato igual al ejemplo del enunciado del PDF)
// --------------------------------------------------------------------------
app.get("/fabrica", (req, res) => {
  res.json(estadoFabrica);
});

// --------------------------------------------------------------------------
// PUERTA
// --------------------------------------------------------------------------
app.get("/puerta", (req, res) => {
  res.json(estadoFabrica.puerta);
});

app.post("/puerta", (req, res) => {
  const { estado, ultimoAcceso } = req.body;
  if (estado) estadoFabrica.puerta.estado = estado;
  if (ultimoAcceso) estadoFabrica.puerta.ultimoAcceso = ultimoAcceso;
  res.json(estadoFabrica.puerta);
});

// --------------------------------------------------------------------------
// PRENSA
// --------------------------------------------------------------------------
app.get("/prensa", (req, res) => {
  res.json(estadoFabrica.prensa);
});

app.post("/prensa", (req, res) => {
  const { estado, ciclos, error } = req.body;
  if (estado !== undefined) estadoFabrica.prensa.estado = estado;
  if (ciclos !== undefined) estadoFabrica.prensa.ciclos = ciclos;
  if (error !== undefined) estadoFabrica.prensa.error = error;
  res.json(estadoFabrica.prensa);
});

// Atajo para sumar un ciclo (útil para llamar desde Unity tras cada bajada)
app.post("/prensa/ciclo", (req, res) => {
  estadoFabrica.prensa.ciclos += 1;
  res.json(estadoFabrica.prensa);
});

// --------------------------------------------------------------------------
// GENERADOR
// --------------------------------------------------------------------------
app.get("/generador", (req, res) => {
  res.json(estadoFabrica.generador);
});

app.post("/generador", (req, res) => {
  const { estado, nivelEnergia, consumo } = req.body;
  if (estado !== undefined) estadoFabrica.generador.estado = estado;
  if (nivelEnergia !== undefined) estadoFabrica.generador.nivelEnergia = nivelEnergia;
  if (consumo !== undefined) estadoFabrica.generador.consumo = consumo;
  res.json(estadoFabrica.generador);
});

// --------------------------------------------------------------------------
// ALARMA GENERAL
// --------------------------------------------------------------------------
app.post("/alarma", (req, res) => {
  const { alarma } = req.body;
  estadoFabrica.alarma = !!alarma;
  // Si se activa la alarma general, bloqueamos la puerta automáticamente
  if (estadoFabrica.alarma) {
    estadoFabrica.puerta.estado = "BLOQUEADA";
  }
  res.json({ alarma: estadoFabrica.alarma, puerta: estadoFabrica.puerta });
});

// --------------------------------------------------------------------------
// /mantenimiento -> mantiene compatibilidad con el script original
// "modo maquina.cs" (modomaquina.cs), que esperaba { estado: { mantenimiento } }
// --------------------------------------------------------------------------
app.get("/mantenimiento", (req, res) => {
  res.json({
    estado: {
      mantenimiento: estadoFabrica.prensa.estado === "MANTENIMIENTO" ? "activo" : "inactivo"
    }
  });
});

// --------------------------------------------------------------------------
// Arranque del servidor
// Render.com inyecta el puerto en la variable de entorno PORT.
// --------------------------------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API Fábrica Inteligente escuchando en el puerto ${PORT}`);
});
