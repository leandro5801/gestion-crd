# Backend-Extras Controllers

Custom Strapi controllers for the Pharmacovigilance Study Management System. These controllers extend the default REST API with domain-specific business logic.

## Installation Instructions

### 1. Copy Controllers to Strapi Backend

Copy all `.js` files from this folder to your Strapi project:

```bash
cp backend-extras/controllers/*.js /your-strapi-backend/src/extensions/*/controllers/
```

Or organize by collection type:
```bash
cp backend-extras/controllers/estudios-custom.js \
   /your-strapi-backend/src/api/estudio/controllers/
cp backend-extras/controllers/pacientes-custom.js \
   /your-strapi-backend/src/api/paciente/controllers/
cp backend-extras/controllers/eventos-adversos-custom.js \
   /your-strapi-backend/src/api/evento-adverso/controllers/
cp backend-extras/controllers/crds-custom.js \
   /your-strapi-backend/src/api/crd/controllers/
cp backend-extras/controllers/dashboard-custom.js \
   /your-strapi-backend/src/api/dashboard/controllers/
```

### 2. Register Routes in Strapi

In each API collection's `routes/[api-name].js`, add the custom controller routes:

#### For Estudios (Studies)
```javascript
// src/api/estudio/routes/estudio.js
module.exports = {
  routes: [
    // Default REST routes
    {
      method: 'GET',
      path: '/estudios',
      handler: 'estudio.find',
    },
    // Custom routes
    {
      method: 'GET',
      path: '/estudios/enriched',
      handler: 'estudios-custom.enriched',
    },
    {
      method: 'GET',
      path: '/estudios/by-site',
      handler: 'estudios-custom.bySite',
    },
    {
      method: 'PATCH',
      path: '/estudios/batch-update-status',
      handler: 'estudios-custom.batchUpdateStatus',
    },
  ],
}
```

#### For Pacientes (Patients)
```javascript
// src/api/paciente/routes/paciente.js
module.exports = {
  routes: [
    // Default REST routes
    {
      method: 'GET',
      path: '/pacientes',
      handler: 'paciente.find',
    },
    // Custom routes
    {
      method: 'GET',
      path: '/pacientes/profile/:id',
      handler: 'pacientes-custom.profile',
    },
    {
      method: 'GET',
      path: '/pacientes/by-study/:estudioId',
      handler: 'pacientes-custom.byStudy',
    },
    {
      method: 'PATCH',
      path: '/pacientes/:id/clinical-status',
      handler: 'pacientes-custom.updateClinicalStatus',
    },
    {
      method: 'GET',
      path: '/pacientes/:id/apps',
      handler: 'pacientes-custom.getApps',
    },
  ],
}
```

#### For Eventos Adversos (Adverse Events)
```javascript
// src/api/evento-adverso/routes/evento-adverso.js
module.exports = {
  routes: [
    // Default REST routes
    {
      method: 'GET',
      path: '/eventos-adversos',
      handler: 'evento-adverso.find',
    },
    // Custom routes
    {
      method: 'GET',
      path: '/eventos-adversos/sae',
      handler: 'eventos-adversos-custom.sae',
    },
    {
      method: 'GET',
      path: '/eventos-adversos/by-patient/:pacienteId',
      handler: 'eventos-adversos-custom.byPatient',
    },
    {
      method: 'GET',
      path: '/eventos-adversos/by-study/:estudioId/summary',
      handler: 'eventos-adversos-custom.studySummary',
    },
    {
      method: 'PATCH',
      path: '/eventos-adversos/:id/mark-reported',
      handler: 'eventos-adversos-custom.markReported',
    },
  ],
}
```

#### For CRDs (Case Report Forms)
```javascript
// src/api/crd/routes/crd.js
module.exports = {
  routes: [
    // Default REST routes
    {
      method: 'GET',
      path: '/crds',
      handler: 'crd.find',
    },
    // Custom routes
    {
      method: 'GET',
      path: '/crds/by-patient-study',
      handler: 'crds-custom.byPatientStudy',
    },
    {
      method: 'GET',
      path: '/crds/:id/progress',
      handler: 'crds-custom.progress',
    },
    {
      method: 'GET',
      path: '/crds/by-study/:estudioId',
      handler: 'crds-custom.byStudy',
    },
    {
      method: 'PATCH',
      path: '/crds/:id/status',
      handler: 'crds-custom.updateStatus',
    },
  ],
}
```

#### For Dashboard
```javascript
// src/api/dashboard/routes/dashboard.js
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/dashboard/stats',
      handler: 'dashboard-custom.stats',
    },
    {
      method: 'GET',
      path: '/dashboard/study/:estudioId',
      handler: 'dashboard-custom.studyDetail',
    },
    {
      method: 'GET',
      path: '/dashboard/activity',
      handler: 'dashboard-custom.activity',
    },
  ],
}
```

### 3. Restart Strapi Server

```bash
npm run develop
```

## API Endpoints Reference

### Studies
- `GET /api/estudios/enriched` - Get studies with patient counts
- `GET /api/estudios/by-site?sitioId=:id&status=:status` - Filter studies by site
- `PATCH /api/estudios/batch-update-status` - Bulk update study status

### Patients
- `GET /api/pacientes/profile/:id` - Get full patient profile with related data
- `GET /api/pacientes/by-study/:estudioId` - Get patients in a study
- `PATCH /api/pacientes/:id/clinical-status` - Update patient status
- `GET /api/pacientes/:id/apps` - Get patient APP types

### Adverse Events
- `GET /api/eventos-adversos/sae` - Get serious adverse events
- `GET /api/eventos-adversos/by-patient/:pacienteId` - Get events for patient
- `GET /api/eventos-adversos/by-study/:estudioId/summary` - Aggregated event stats
- `PATCH /api/eventos-adversos/:id/mark-reported` - Mark event as reported

### Case Report Forms
- `GET /api/crds/by-patient-study?pacienteId=:id&estudioId=:id` - Get CRDs
- `GET /api/crds/:id/progress` - Get CRD completion progress
- `GET /api/crds/by-study/:estudioId` - Get all CRDs for study
- `PATCH /api/crds/:id/status` - Update CRD status

### Dashboard
- `GET /api/dashboard/stats` - Global dashboard statistics
- `GET /api/dashboard/study/:estudioId` - Study-specific dashboard
- `GET /api/dashboard/activity?limit=10` - Recent activity feed

## Notes

- These controllers use Strapi v4 Document Service API
- All endpoints require proper authentication/authorization
- Consider adding role-based access control (RBAC) in middleware
- Pagination is recommended for large datasets
- Consider adding caching for expensive aggregation queries
