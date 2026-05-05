(function () {
  // ── Estilos ────────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #cq-fab {
      position: fixed; bottom: 24px; right: 16px; z-index: 9998;
      background: linear-gradient(135deg,#f59e0b,#f97316);
      border: none; cursor: pointer;
      box-shadow: 0 4px 18px rgba(245,158,11,0.45);
      display: flex; align-items: center; gap: 8px;
      padding: 10px 18px 10px 14px;
      border-radius: 50px;
      font-size: 13px; font-weight: 700; color: #1a0e00;
      font-family: 'DM Sans', sans-serif;
      letter-spacing: .1px;
      transition: transform .2s, box-shadow .2s;
    }
    #cq-fab:hover { transform: scale(1.05); box-shadow: 0 6px 24px rgba(245,158,11,0.6); }
    #cq-fab .fab-ico { font-size: 18px; line-height: 1; }
    #cq-fab .fab-txt { line-height: 1.2; text-align: left; }

    #cq-backdrop {
      display: none; position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.72); backdrop-filter: blur(3px);
      align-items: center; justify-content: center; padding: 16px;
    }
    #cq-backdrop.open { display: flex; }

    #cq-modal {
      background: #16162a; border: 1px solid #2a2a4a;
      border-radius: 22px; width: 100%; max-width: 480px;
      max-height: 90vh; overflow-y: auto; padding: 28px 22px 32px;
      box-shadow: 0 12px 60px rgba(0,0,0,0.8);
      font-family: 'DM Sans', sans-serif; color: #eef0fb;
      position: relative; box-sizing: border-box;
    }
    #cq-modal *, #cq-modal *::before, #cq-modal *::after { box-sizing: border-box; }

    #cq-close {
      position: absolute; top: 14px; right: 16px;
      background: none; border: none; color: #666;
      font-size: 20px; cursor: pointer; line-height: 1;
      transition: color .15s;
    }
    #cq-close:hover { color: #ccc; }

    .cq-header { text-align: center; margin-bottom: 24px; }
    .cq-header .ico { font-size: 28px; margin-bottom: 6px; }
    .cq-header h2 { font-size: 17px; font-weight: 700; color: #fff; margin: 0 0 4px; }
    .cq-header p { color: #777; font-size: 12.5px; margin: 0; line-height: 1.5; }

    .cq-q { margin-bottom: 22px; }
    .cq-label {
      color: #e0e0e0; font-size: 13.5px; font-weight: 600;
      display: block; margin-bottom: 10px;
    }
    .cq-label .opt { color: #666; font-weight: 400; font-size: 11.5px; }

    .cq-col { display: flex; flex-direction: column; gap: 7px; }
    .cq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
    .cq-row  { display: flex; gap: 8px; }
    .cq-pills { display: flex; flex-wrap: wrap; gap: 6px; }
    .cq-faces { display: flex; justify-content: space-between; gap: 5px; }

    .cq-card {
      display: flex; align-items: center; gap: 9px;
      background: #1e1e38; border: 1px solid #2e2e52;
      border-radius: 11px; padding: 10px 13px;
      cursor: pointer; transition: .15s;
      font-size: 13px; color: #ccc;
    }
    .cq-card input { display: none; }
    .cq-card:hover { border-color: #555; }
    .cq-card.sel { border-color: #f59e0b; background: #251d00; color: #f59e0b; }

    .cq-pill {
      display: inline-flex; align-items: center;
      background: #1e1e38; border: 1px solid #2e2e52;
      border-radius: 50px; padding: 6px 13px;
      cursor: pointer; font-size: 12px; color: #bbb; transition: .15s;
    }
    .cq-pill input { display: none; }
    .cq-pill.sel { border-color: #f59e0b; background: #251d00; color: #f59e0b; }

    .cq-face {
      flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;
      background: #1e1e38; border: 1px solid #2e2e52;
      border-radius: 13px; padding: 9px 4px 7px;
      cursor: pointer; transition: .15s;
    }
    .cq-face input { display: none; }
    .cq-face .emo { font-size: 22px; }
    .cq-face .lbl { color: #888; font-size: 10px; text-align: center; line-height: 1.2; }
    .cq-face.sel { border-color: #f59e0b; background: #251d00; }
    .cq-face.sel .lbl { color: #f59e0b; }

    .cq-btn {
      flex: 1; text-align: center;
      background: #1e1e38; border: 1px solid #2e2e52;
      border-radius: 11px; padding: 10px 5px;
      cursor: pointer; font-size: 12px; color: #ccc; transition: .15s;
    }
    .cq-btn input { display: none; }
    .cq-btn.sel { border-color: #f59e0b; background: #251d00; color: #f59e0b; }

    .cq-chkbox {
      width: 17px; height: 17px; border: 2px solid #444; border-radius: 5px;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; flex-shrink: 0; transition: .15s;
    }
    .cq-card.sel .cq-chkbox { border-color: #f59e0b; background: #f59e0b; color: #1a0e00; font-weight: 700; }

    .cq-range-wrap { padding: 0 2px; }
    .cq-range-wrap input[type=range] { width: 100%; accent-color: #f59e0b; cursor: pointer; height: 5px; }
    .cq-range-labels { display: flex; justify-content: space-between; align-items: center; margin-top: 7px; }
    .cq-range-labels .edge { color: #555; font-size: 11px; }
    .cq-range-val { color: #f59e0b; font-size: 12px; font-weight: 700; background: #2a1f00; padding: 2px 11px; border-radius: 20px; }

    .cq-textarea {
      width: 100%; background: #0e0e20; border: 1px solid #2e2e52;
      border-radius: 11px; padding: 10px 12px; color: #ddd; font-size: 13px;
      resize: none; outline: none; font-family: inherit; transition: .2s;
    }
    .cq-textarea:focus { border-color: #f59e0b; }

    .cq-submit {
      width: 100%; padding: 14px; margin-top: 4px;
      background: linear-gradient(135deg,#f59e0b,#f97316);
      border: none; border-radius: 12px;
      color: #1a0e00; font-size: 14px; font-weight: 700;
      cursor: pointer; letter-spacing: .2px;
      box-shadow: 0 4px 18px rgba(245,158,11,0.3);
      transition: .2s; font-family: inherit;
    }
    .cq-submit:hover { opacity: .9; }
    .cq-submit:disabled { opacity: .5; cursor: not-allowed; }

    #cq-gracias { display: none; text-align: center; padding: 16px 10px 8px; }
    #cq-gracias .g-ico { font-size: 50px; margin-bottom: 12px; }
    #cq-gracias h3 { color: #f59e0b; font-size: 18px; margin-bottom: 8px; }
    #cq-gracias p { color: #999; font-size: 13px; line-height: 1.6; }
  `;
  document.head.appendChild(style);

  // ── HTML del modal ─────────────────────────────────────────────────────────
  const html = `
  <button id="cq-fab">
    <span class="fab-ico">📋</span>
    <span class="fab-txt">¡Ayúdanos a mejorar!</span>
  </button>

  <div id="cq-backdrop">
    <div id="cq-modal">
      <button id="cq-close">✕</button>

      <div class="cq-header">
        <div class="ico">🎵</div>
        <h2>¿Cómo te ha ido con la herramienta?</h2>
        <p>Ministerio Musical · Grace Church<br><span style="font-size:11px;">Solo toma 2 minutos ✨</span></p>
      </div>

      <form id="cq-form">

        <!-- P1 -->
        <div class="cq-q">
          <span class="cq-label">1. ¿Qué tan seguido la usas?</span>
          <div class="cq-col" id="cqg1">
            <label class="cq-card"><input type="radio" name="cp1" value="Casi todos los días"> Casi todos los días</label>
            <label class="cq-card"><input type="radio" name="cp1" value="Unas cuantas veces a la semana"> Unas cuantas veces a la semana</label>
            <label class="cq-card"><input type="radio" name="cp1" value="Solo el día del servicio"> Solo el día del servicio</label>
            <label class="cq-card"><input type="radio" name="cp1" value="Casi nunca la uso"> Casi nunca la uso</label>
          </div>
        </div>

        <!-- P2 -->
        <div class="cq-q">
          <span class="cq-label">2. ¿Qué parte usas más?</span>
          <div class="cq-grid" id="cqg2">
            <label class="cq-card"><input type="radio" name="cp2" value="La página principal"> 🏠 La página principal</label>
            <label class="cq-card"><input type="radio" name="cp2" value="El calendario"> 📅 El calendario</label>
            <label class="cq-card"><input type="radio" name="cp2" value="Las canciones"> 🎵 Las canciones</label>
            <label class="cq-card"><input type="radio" name="cp2" value="Proponer canciones"> 💡 Proponer canciones</label>
            <label class="cq-card"><input type="radio" name="cp2" value="Adorar 2026"> ✨ Adorar 2026</label>
            <label class="cq-card"><input type="radio" name="cp2" value="El tablero general"> 🛠 El tablero general</label>
          </div>
        </div>

        <!-- P3 Caritas -->
        <div class="cq-q">
          <span class="cq-label">3. ¿Qué tan fácil es usarla?</span>
          <div class="cq-faces" id="cqg3">
            <label class="cq-face"><input type="radio" name="cp3" value="Muy difícil"><span class="emo">😣</span><span class="lbl">Muy difícil</span></label>
            <label class="cq-face"><input type="radio" name="cp3" value="Difícil"><span class="emo">😕</span><span class="lbl">Difícil</span></label>
            <label class="cq-face"><input type="radio" name="cp3" value="Regular"><span class="emo">😐</span><span class="lbl">Regular</span></label>
            <label class="cq-face"><input type="radio" name="cp3" value="Fácil"><span class="emo">🙂</span><span class="lbl">Fácil</span></label>
            <label class="cq-face"><input type="radio" name="cp3" value="Muy fácil"><span class="emo">😄</span><span class="lbl">Muy fácil</span></label>
          </div>
        </div>

        <!-- P4 Rango -->
        <div class="cq-q">
          <span class="cq-label">4. ¿Qué tanto te ha ayudado a organizarte mejor?</span>
          <div class="cq-range-wrap">
            <input type="range" id="cqp4r" name="cp4" min="1" max="5" value="3" step="1">
            <div class="cq-range-labels">
              <span class="edge">Para nada</span>
              <span class="cq-range-val" id="cqp4lbl">Más o menos</span>
              <span class="edge">Muchísimo</span>
            </div>
          </div>
        </div>

        <!-- P5 -->
        <div class="cq-q">
          <span class="cq-label">5. ¿Algo que no funciona bien o no entiendes cómo usar?</span>
          <div class="cq-pills" id="cqg5">
            <label class="cq-pill"><input type="radio" name="cp5" value="El calendario"> El calendario</label>
            <label class="cq-pill"><input type="radio" name="cp5" value="Agregar canciones"> Agregar canciones</label>
            <label class="cq-pill"><input type="radio" name="cp5" value="La sección Adorar"> La sección Adorar</label>
            <label class="cq-pill"><input type="radio" name="cp5" value="El tablero"> El tablero</label>
            <label class="cq-pill"><input type="radio" name="cp5" value="Todo funciona bien"> Todo funciona bien</label>
          </div>
        </div>

        <!-- P6 -->
        <div class="cq-q">
          <span class="cq-label">6. ¿La recomendarías a otro ministerio de música?</span>
          <div class="cq-row" id="cqg6">
            <label class="cq-btn"><input type="radio" name="cp6" value="Sí, claro"> 👍 Sí, claro</label>
            <label class="cq-btn"><input type="radio" name="cp6" value="No la recomendaría"> 👎 No</label>
            <label class="cq-btn"><input type="radio" name="cp6" value="No sé"> 🤔 No sé</label>
          </div>
        </div>

        <!-- P7 Checkbox -->
        <div class="cq-q">
          <span class="cq-label">7. ¿Has tenido alguno de estos problemas?
            <span class="opt">(puedes marcar varios)</span>
          </span>
          <div class="cq-col" id="cqg7">
            <label class="cq-card" data-val="Carga lenta o tarda en abrir" data-checked="false">
              <span class="cq-chkbox"></span><input type="checkbox" name="cp7" value="Carga lenta o tarda en abrir"> 🐢 Carga lenta o tarda en abrir
            </label>
            <label class="cq-card" data-val="Muestra errores o falla de repente" data-checked="false">
              <span class="cq-chkbox"></span><input type="checkbox" name="cp7" value="Muestra errores o falla de repente"> ❌ Muestra errores o falla de repente
            </label>
            <label class="cq-card" data-val="No carga bien sin buena señal" data-checked="false">
              <span class="cq-chkbox"></span><input type="checkbox" name="cp7" value="No carga bien sin buena señal"> 📵 No carga bien sin buena señal
            </label>
            <label class="cq-card" data-val="Se pierden datos que ya había guardado" data-checked="false">
              <span class="cq-chkbox"></span><input type="checkbox" name="cp7" value="Se pierden datos que ya había guardado"> 💨 Se pierden datos que ya había guardado
            </label>
            <label class="cq-card" data-val="Todo ha funcionado bien" data-checked="false">
              <span class="cq-chkbox"></span><input type="checkbox" name="cp7" value="Todo ha funcionado bien"> ✅ Todo ha funcionado bien
            </label>
          </div>
        </div>

        <!-- P8 -->
        <div class="cq-q" style="margin-bottom:24px;">
          <span class="cq-label">8. ¿Qué le cambiarías o agregarías? <span class="opt">(opcional)</span></span>
          <textarea class="cq-textarea" name="cp8" rows="3" placeholder="Escribe aquí tu idea o comentario..."></textarea>
        </div>

        <button type="button" class="cq-submit" id="cq-btn-enviar">Listo, enviar 🙌</button>
      </form>

      <div id="cq-gracias">
        <div class="g-ico">🙏</div>
        <h3>¡Gracias por tu tiempo!</h3>
        <p>Tu opinión nos ayuda a seguir mejorando<br>para que el ministerio funcione mejor.</p>
      </div>
    </div>
  </div>`;

  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  document.body.appendChild(wrap);

  // ── Lógica ─────────────────────────────────────────────────────────────────
  const backdrop = document.getElementById('cq-backdrop');
  document.getElementById('cq-fab').addEventListener('click', () => backdrop.classList.add('open'));
  document.getElementById('cq-close').addEventListener('click', () => backdrop.classList.remove('open'));
  backdrop.addEventListener('click', e => { if (e.target === backdrop) backdrop.classList.remove('open'); });

  // Selección radio cards
  function bindRadioCards(gid, cls) {
    document.querySelectorAll('#' + gid + ' .' + cls).forEach(lbl => {
      lbl.addEventListener('click', () => {
        document.querySelectorAll('#' + gid + ' .' + cls).forEach(l => l.classList.remove('sel'));
        lbl.classList.add('sel');
        lbl.querySelector('input').checked = true;
      });
    });
  }
  bindRadioCards('cqg1', 'cq-card');
  bindRadioCards('cqg2', 'cq-card');
  bindRadioCards('cqg3', 'cq-face');
  bindRadioCards('cqg5', 'cq-pill');
  bindRadioCards('cqg6', 'cq-btn');

  // Checkboxes P7 — preventDefault evita el doble toggle que causa el label nativo
  document.querySelectorAll('#cqg7 .cq-card').forEach(lbl => {
    lbl.addEventListener('click', (e) => {
      e.preventDefault();
      const isOn = lbl.dataset.checked === 'true';
      const val  = lbl.dataset.val;
      const box  = lbl.querySelector('.cq-chkbox');
      const inp  = lbl.querySelector('input');
      if (val === 'Todo ha funcionado bien' && !isOn) {
        document.querySelectorAll('#cqg7 .cq-card').forEach(l => {
          if (l !== lbl) {
            l.dataset.checked = 'false'; l.classList.remove('sel');
            l.querySelector('.cq-chkbox').textContent = '';
            l.querySelector('input').checked = false;
          }
        });
      }
      if (val !== 'Todo ha funcionado bien' && !isOn) {
        const nada = document.querySelector('#cqg7 [data-val="Todo ha funcionado bien"]');
        if (nada && nada.dataset.checked === 'true') {
          nada.dataset.checked = 'false'; nada.classList.remove('sel');
          nada.querySelector('.cq-chkbox').textContent = '';
          nada.querySelector('input').checked = false;
        }
      }
      lbl.dataset.checked = isOn ? 'false' : 'true';
      lbl.classList.toggle('sel', !isOn);
      box.textContent = isOn ? '' : '✓';
      inp.checked = !isOn;
    });
  });

  // Rango P4
  const rangeTextos = { '1':'Para nada','2':'Muy poco','3':'Más o menos','4':'Bastante','5':'Muchísimo' };
  document.getElementById('cqp4r').addEventListener('input', function() {
    document.getElementById('cqp4lbl').textContent = rangeTextos[this.value];
  });

  // Enviar
  document.getElementById('cq-btn-enviar').addEventListener('click', () => {
    const p1 = document.querySelector('input[name=cp1]:checked');
    const p3 = document.querySelector('input[name=cp3]:checked');
    if (!p1) { alert('Por favor responde la pregunta 1'); return; }
    if (!p3) { alert('Por favor responde la pregunta 3 (caritas)'); return; }

    const p2 = document.querySelector('input[name=cp2]:checked');
    const p4 = document.getElementById('cqp4r').value;
    const p5 = document.querySelector('input[name=cp5]:checked');
    const p6 = document.querySelector('input[name=cp6]:checked');
    const p7 = Array.from(document.querySelectorAll('input[name=cp7]:checked')).map(i => i.value);
    const p8 = document.querySelector('textarea[name=cp8]').value.trim();

    const data = {
      fechaEnvio      : new Date().toISOString(),
      p1_frecuencia   : p1.value,
      p2_seccion      : p2  ? p2.value : 'Sin respuesta',
      p3_facilidad    : p3.value,
      p4_ayuda        : rangeTextos[p4],
      p5_confuso      : p5  ? p5.value : 'Sin respuesta',
      p6_recomendaria : p6  ? p6.value : 'Sin respuesta',
      p7_problemas    : p7.length > 0 ? p7.join(', ') : 'Ninguno marcado',
      p8_sugerencia   : p8 || 'Sin sugerencia',
    };

    const btn = document.getElementById('cq-btn-enviar');
    btn.textContent = 'Guardando...';
    btn.disabled = true;

    // Usa la instancia de Firebase ya inicializada en la app
    const db = firebase.database();
    db.ref('cuestionario_ministerio').push(data)
      .then(() => {
        document.getElementById('cq-form').style.display = 'none';
        document.getElementById('cq-gracias').style.display = 'block';
      })
      .catch(err => {
        btn.textContent = 'Listo, enviar 🙌';
        btn.disabled = false;
        alert('Hubo un problema. Intenta de nuevo.\n' + err.message);
      });
  });
})();
