ENDPOINT /api/me/data-scope

Archivos:
- controller.js -> copiar en src/api/me/controllers/me.js
- routes.js -> copiar en src/api/me/routes/me.js

El endpoint debe quedar disponible como:
GET /api/me/data-scope

El usuario debe llegar en ctx.state.user, por lo que la ruta debe ejecutarse
con el middleware de autenticación de users-permissions de Strapi.

CONTROLADOR

El handler es:
me.dataScope

La relación principal esperada es:
usuario médico-investigador -> pacientes
paciente -> estudio
paciente -> sitioClinico

Si el modelo usa nombres distintos, ajustar en controller.js:
- user.pacientes
- user.estudios
- user.sitiosClinicos
- patient.estudio
- patient.sitioClinico

Si el médico no tiene relación directa con pacientes, añadir en Strapi una
relación many-to-many o one-to-many entre plugin::users-permissions.user y
api::paciente.paciente, con el nombre pacientes. Sin esa relación el backend
no puede determinar qué pacientes ha tratado cada médico.

IMPORTANTE: este endpoint solo entrega el alcance al frontend. Para seguridad
real, también hay que crear policies/controllers para aplicar pacienteIds,
estudioIds y sitioClinicoIds en las consultas de cada content-type y rechazar
mutaciones del rol medico-investigador si debe ser solo lectura.

Para roles administrativos, el controlador devuelve el catálogo completo.
Los UID api::estudio.estudio, api::sitio-clinico.sitio-clinico y
api::paciente.paciente deben coincidir con los UIDs reales del proyecto.
