// ================================================================
// alabanza-notificaciones.gs  —  Google Apps Script
//
// INSTRUCCIONES DE INSTALACIÓN:
// 1. Ve a https://script.google.com
// 2. Crea un nuevo proyecto → pega este código
// 3. Archivo → Configuración del proyecto → activa "Mostrar archivo appsscript.json"
// 4. Abre appsscript.json y reemplaza con:
//    { "timeZone":"America/Caracas","dependencies":{},"exceptionLogging":"STACKDRIVER",
//      "runtimeVersion":"V8","oauthScopes":["https://www.googleapis.com/auth/firebase.messaging",
//      "https://www.googleapis.com/auth/script.external_request"] }
// 5. Guarda → Ejecuta "instalarTrigger" UNA VEZ para configurar el trigger cada hora
// 6. Autoriza los permisos cuando te lo pida
// ================================================================

var FIREBASE_DB   = 'https://asistentegrace-e750c-default-rtdb.firebaseio.com';
var FCM_PROJECT   = 'asistentegrace-e750c';
var FCM_ENDPOINT  = 'https://fcm.googleapis.com/v1/projects/' + FCM_PROJECT + '/messages:send';

// ── Programar trigger horario ──────────────────────────────────
function instalarTrigger() {
  // Elimina triggers previos para no duplicar
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  // Ejecuta cada hora
  ScriptApp.newTrigger('enviarNotificacionesPendientes')
    .timeBased()
    .everyHours(1)
    .create();
  Logger.log('✅ Trigger instalado — se ejecutará cada hora');
}

// ── Función principal — Apps Script la llama cada hora ─────────
function enviarNotificacionesPendientes() {
  var ahora  = new Date().getTime();
  var hoy    = Utilities.formatDate(new Date(), 'America/Caracas', 'yyyy-MM-dd');
  var hora   = new Date().getHours();

  // 1. Notificaciones manuales de Pra. Mary (notas de recordatorio)
  enviarNotasManual();

  // 2. Recordatorios automáticos del calendario
  enviarRecordatoriosCalendario(ahora, hora);

  // 3. Notificar nuevo devocional
  notificarDevocionalNuevo();
}

// ── Notas manuales de Pra. Mary ────────────────────────────────
function enviarNotasManual() {
  var resp = fetchDB('/alabanza/notasManual.json');
  if (!resp) return;

  var notas = JSON.parse(resp);
  if (!notas) return;

  Object.keys(notas).forEach(function(key) {
    var nota = notas[key];
    if (nota.enviado) return;

    // Obtener tokens de destinatarios
    var destinatarios = nota.destinatarios || []; // [] = todos
    var tokens = obtenerTokens(destinatarios);

    tokens.forEach(function(token) {
      enviarFCM(token, {
        title: '📋 ' + (nota.titulo || 'Nota de Pra. Mary'),
        body:  nota.mensaje || '',
        tag:   'nota-' + key
      });
    });

    // Marcar como enviado
    patchDB('/alabanza/notasManual/' + key + '/enviado.json', 'true');
    patchDB('/alabanza/notasManual/' + key + '/enviadoAt.json', '"' + new Date().toISOString() + '"');
  });
}

// ── Recordatorios automáticos del calendario ───────────────────
function enviarRecordatoriosCalendario(ahora, hora) {
  // Solo enviar entre 8am y 9am hora local
  if (hora < 8 || hora > 9) return;

  var hoy = Utilities.formatDate(new Date(), 'America/Caracas', 'yyyy-MM-dd');

  // Calendario de eventos
  var CALENDAR = {
    '2026-04-03': {t:'fri', wn:1}, '2026-04-05': {t:'sun', wn:1},
    '2026-04-08': {t:'wed', wn:1}, '2026-04-10': {t:'fri', wn:2},
    '2026-04-12': {t:'sun', wn:2}, '2026-04-15': {t:'wed', wn:2},
    '2026-04-17': {t:'fri', wn:3}, '2026-04-19': {t:'sun', wn:3},
    '2026-04-22': {t:'wed', wn:3}, '2026-04-24': {t:'fri', wn:4},
    '2026-04-26': {t:'sun', wn:4}, '2026-04-29': {t:'wed', wn:4},
    '2026-05-01': {t:'fri', wn:5}, '2026-05-03': {t:'sun', wn:5},
    '2026-05-06': {t:'wed', wn:5}, '2026-05-08': {t:'fri', wn:6},
    '2026-05-10': {t:'sun', wn:6}, '2026-05-13': {t:'wed', wn:6}
  };

  // Equipo por semana
  var SEMANAS = {
    1: {dir:'Veruzka', voces:['Zuisay','Ma Alex'], flot:'Joselyn', s3:'Isamar'},
    2: {dir:'Diana',   voces:['Joselyn','Gelimar'],flot:'Valeria', s3:'Veruzka'},
    3: {dir:'Isamar',  voces:['Valeria','Ma Alex'],flot:'Zuisay',  s3:'Diana'},
    4: {dir:'Veruzka', voces:['Zuisay','Gelimar'], flot:'Joselyn', s3:'Isamar'},
    5: {dir:'Diana',   voces:['Joselyn','Ma Alex'],flot:'Valeria', s3:'Veruzka'},
    6: {dir:'Isamar',  voces:['Valeria','Gelimar'],flot:'Zuisay',  s3:'Diana'}
  };

  // Mirar hoy y mañana
  var fechas = [hoy, getFechaMas(1), getFechaMas(2)];

  fechas.forEach(function(fecha) {
    var ev = CALENDAR[fecha];
    if (!ev) return;

    var diff = diasHasta(fecha);
    var diffLabel = diff === 0 ? 'HOY' : diff === 1 ? 'Mañana' : 'En 2 días';
    var s = SEMANAS[ev.wn];
    if (!s) return;

    var yaEnviado = fetchDB('/alabanza/recordatoriosEnviados/' + fecha + '.json');
    if (yaEnviado && JSON.parse(yaEnviado) === true) return;

    // Armar lista de quienes sirven
    var equipo = [s.dir].concat(s.voces).concat([s.flot, s.s3]);

    var titulo, cuerpo, tag;
    if (ev.t === 'sun') {
      titulo = '⛪ ' + diffLabel + ' — Servicio Dominical';
      cuerpo = 'Semana ' + ev.wn + ' · Directora: ' + s.dir;
      tag = 'sun-' + fecha;
    } else if (ev.t === 'wed') {
      titulo = '🎤 ' + diffLabel + ' — Servicio Miércoles';
      cuerpo = 'Semana ' + ev.wn + ' · Directora: ' + s.dir;
      tag = 'wed-' + fecha;
    } else {
      titulo = '🎸 ' + diffLabel + ' — Ensayo Viernes';
      cuerpo = 'Ensayo de la semana ' + ev.wn;
      tag = 'fri-' + fecha;
    }

    // Enviar solo a quienes participan
    var tokens = obtenerTokens(equipo);
    tokens.forEach(function(tokenInfo) {
      // Solo si este usuario está en el equipo
      if (equipo.indexOf(tokenInfo.user) >= 0) {
        enviarFCM(tokenInfo.token, { title: titulo, body: cuerpo, tag: tag });
      }
    });

    // Marcar fecha como notificada
    if (tokens.length > 0) {
      patchDB('/alabanza/recordatoriosEnviados/' + fecha + '.json', 'true');
    }
  });
}

// ── Notificar nuevo devocional ─────────────────────────────────
function notificarDevocionalNuevo() {
  var resp = fetchDB('/alabanza/devocional.json');
  if (!resp) return;
  var devo = JSON.parse(resp);
  if (!devo || !devo.updatedAt || !devo.text) return;

  // ¿Ya notificamos este devocional?
  var lastNotified = fetchDB('/alabanza/devocionalNotificado.json');
  var lastAt = lastNotified ? JSON.parse(lastNotified) : null;
  if (lastAt === devo.updatedAt) return;

  // Solo notificar si fue publicado en las últimas 2 horas
  var pub = new Date(devo.updatedAt).getTime();
  var ahora = new Date().getTime();
  if (ahora - pub > 2 * 60 * 60 * 1000) {
    // Ya pasaron más de 2 horas, igual guardar para no reintentar
    patchDB('/alabanza/devocionalNotificado.json', '"' + devo.updatedAt + '"');
    return;
  }

  // Enviar a todos
  var tokens = obtenerTokens([]);
  tokens.forEach(function(tokenInfo) {
    enviarFCM(tokenInfo.token, {
      title: '📖 Nuevo Devocional',
      body:  'Pra. Mary publicó el devocional de la semana',
      tag:   'devo-' + devo.updatedAt
    });
  });

  patchDB('/alabanza/devocionalNotificado.json', '"' + devo.updatedAt + '"');
}

// ── Obtener tokens FCM de Firebase ────────────────────────────
function obtenerTokens(usuariosFilter) {
  var resp = fetchDB('/alabanza/tokens.json');
  if (!resp) return [];
  var tokens = JSON.parse(resp);
  if (!tokens) return [];

  var result = [];
  Object.keys(tokens).forEach(function(userKey) {
    var user = userKey.replace(/_/g, ' ').replace('Pra  Mary', 'Pra. Mary');
    var token = tokens[userKey];
    if (!token) return;
    if (usuariosFilter.length === 0 || usuariosFilter.indexOf(user) >= 0) {
      result.push({ user: user, token: token });
    }
  });
  return result;
}

// ── Enviar mensaje FCM v1 ─────────────────────────────────────
function enviarFCM(token, notification) {
  var accessToken = ScriptApp.getOAuthToken();
  var payload = JSON.stringify({
    message: {
      token: token,
      notification: {
        title: notification.title || '♪ Alabanza · Grace',
        body:  notification.body  || ''
      },
      data: {
        tag: notification.tag || 'alabanza'
      },
      webpush: {
        notification: {
          icon: 'https://ejam3.github.io/Planificador-de-Min-De-Musica/icon-192.png',
          badge: 'https://ejam3.github.io/Planificador-de-Min-De-Musica/icon-192.png',
          vibrate: [200, 100, 200]
        },
        fcm_options: {
          link: 'https://ejam3.github.io/Planificador-de-Min-De-Musica/'
        }
      }
    }
  });

  try {
    var resp = UrlFetchApp.fetch(FCM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      payload: payload,
      muteHttpExceptions: true
    });
    var code = resp.getResponseCode();
    if (code !== 200) {
      Logger.log('FCM error ' + code + ': ' + resp.getContentText().substring(0, 200));
    }
  } catch(e) {
    Logger.log('FCM exception: ' + e.message);
  }
}

// ── Firebase REST helpers ──────────────────────────────────────
function fetchDB(path) {
  try {
    var r = UrlFetchApp.fetch(FIREBASE_DB + path, { muteHttpExceptions: true });
    return r.getResponseCode() === 200 ? r.getContentText() : null;
  } catch(e) { return null; }
}

function patchDB(path, jsonValue) {
  try {
    UrlFetchApp.fetch(FIREBASE_DB + path, {
      method: 'PUT',
      contentType: 'application/json',
      payload: jsonValue,
      muteHttpExceptions: true
    });
  } catch(e) {}
}

// ── Utilidades de fecha ────────────────────────────────────────
function getFechaMas(dias) {
  var d = new Date();
  d.setDate(d.getDate() + dias);
  return Utilities.formatDate(d, 'America/Caracas', 'yyyy-MM-dd');
}

function diasHasta(fechaStr) {
  var hoy  = new Date(); hoy.setHours(0,0,0,0);
  var meta = new Date(fechaStr + 'T00:00:00');
  return Math.round((meta - hoy) / 86400000);
}
