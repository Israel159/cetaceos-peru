(() => {
  'use strict';

  const dateInput = document.querySelector('#reporte-fecha');
  if (dateInput) {
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    dateInput.max = localDate;
  }

  document.querySelectorAll('[data-geolocation]').forEach(button => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.geolocation);
      const status = document.getElementById('geo-status');
      if (!navigator.geolocation) {
        status.textContent = 'Tu navegador no ofrece geolocalización. Escribe la zona, puerto o playa.';
        return;
      }
      button.disabled = true;
      button.textContent = 'Obteniendo…';
      status.textContent = 'Solicitando tu ubicación. Revisa el permiso del navegador.';
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        input.value = `${lat}, ${lon}`;
        status.textContent = `Coordenadas agregadas (precisión aproximada: ${Math.round(position.coords.accuracy)} m).`;
        button.disabled = false;
        button.textContent = 'Actualizar ubicación';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }, error => {
        const messages = {
          1: 'No autorizaste el acceso a tu ubicación. Puedes escribir el lugar manualmente.',
          2: 'No fue posible determinar tu ubicación. Escribe un punto de referencia.',
          3: 'La solicitud tardó demasiado. Intenta nuevamente o escribe el lugar.'
        };
        status.textContent = messages[error.code] || 'No fue posible obtener la ubicación. Escríbela manualmente.';
        button.disabled = false;
        button.textContent = 'Usar mi ubicación';
      }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
    });
  });

  const fileInput = document.querySelector('#reporte-archivos');
  fileInput?.addEventListener('change', () => {
    const help = fileInput.nextElementSibling;
    const count = fileInput.files.length;
    help.textContent = count
      ? `${count} ${count === 1 ? 'archivo seleccionado' : 'archivos seleccionados'}. Recuerda adjuntarlo${count > 1 ? 's' : ''} en el correo.`
      : 'Selecciona una o más evidencias. Deberás adjuntarlas manualmente en el correo que se abrirá.';
  });

  function collectFields(form) {
    const lines = [];
    Array.from(form.elements).forEach(field => {
      if (!field.name || field.disabled || field.type === 'submit') return;
      if ((field.type === 'checkbox' || field.type === 'radio') && !field.checked) return;
      let value = field.value.trim();
      if (field.type === 'file') {
        value = [...field.files].map(file => file.name).join(', ');
      }
      if (value) lines.push(`${field.name}: ${value}`);
    });
    return lines;
  }

  document.querySelectorAll('[data-mail-form]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const status = form.querySelector('.form-status');
      if (!form.checkValidity()) {
        form.reportValidity();
        status.classList.add('visible');
        status.replaceChildren();
        const strong = document.createElement('strong');
        strong.textContent = 'Revisa los campos obligatorios';
        const message = document.createElement('p');
        message.className = 'form-error';
        message.textContent = 'Completa la información señalada antes de preparar el correo.';
        status.append(strong, message);
        return;
      }

      const isReport = form.dataset.mailForm === 'reporte';
      const subject = isReport
        ? `Nuevo avistamiento ciudadano — ${form.querySelector('#reporte-fecha').value}`
        : `Solicitud de acceso a datos — ${form.querySelector('#acceso-nombre').value}`;
      const introduction = isReport
        ? 'Hola, equipo de la Red:\n\nDeseo compartir el siguiente avistamiento para su revisión.\n\n'
        : 'Hola, equipo de la Red:\n\nDeseo solicitar acceso a los datos de la Red. A continuación presento mi proyecto.\n\n';
      const reminder = isReport
        ? '\n\nIMPORTANTE: Adjuntaré a este correo las fotos o videos indicados en el campo “Fotos o videos”.\n\nGracias.'
        : '\n\nQuedo atento/a a su evaluación y respuesta.\n\nGracias.';
      const body = introduction + collectFields(form).join('\n') + reminder;
      const mailto = `mailto:cetaceospe@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      status.replaceChildren();
      const strong = document.createElement('strong');
      strong.textContent = isReport ? '¡Gracias por tu registro! Tu borrador está listo.' : 'Tu solicitud está lista para enviar.';
      const message = document.createElement('p');
      message.textContent = isReport
        ? 'Se abrirá tu aplicación de correo. Adjunta las fotos o videos seleccionados y pulsa “Enviar” para que el equipo pueda revisar tu avistamiento.'
        : 'Se abrirá tu aplicación de correo. Revisa el borrador y pulsa “Enviar”; el equipo responderá al correo electrónico que indicaste.';
      const retry = document.createElement('a');
      retry.href = mailto;
      retry.textContent = 'Si el correo no se abrió, haz clic aquí.';
      retry.style.display = 'inline-block';
      retry.style.marginTop = '12px';
      status.append(strong, message, retry);
      status.classList.add('visible');
      status.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
      window.location.href = mailto;
    });
  });
})();
