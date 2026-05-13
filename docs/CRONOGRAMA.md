# Cronograma de finalización — Cognia Lab

## Estado actual: ~78% del MVP

---

## Funcionalidades pendientes

| Funcionalidad | Prioridad | Estimado |
|---|---|---|
| JWT para autenticación stateless | Alta | 1 día |
| Rutas protegidas con middleware | Alta | 0.5 días |
| Simulacros cronometrados | Alta | 2 días |
| Pantalla de resultados de simulacro | Alta | 1 día |
| Más materias (Matemática, Español) | Media | 3 días |
| Búsqueda de preguntas | Media | 1 día |
| Perfil de usuario editable | Media | 1 día |
| Despliegue en producción (Railway/Render) | Alta | 1 día |
| Tutor IA con LLM | Baja | 5+ días |
| Recomendaciones personalizadas | Baja | 3+ días |

---

## Semana 1 (completar MVP al 100%)

| Día | Tarea |
|---|---|
| Lunes | Implementar JWT + rutas protegidas |
| Martes | Simulacros: selección aleatoria de N preguntas + temporizador |
| Miércoles | Pantalla de resultados del simulacro + historial |
| Jueves | Agregar contenido: Matemática básica |
| Viernes | Pruebas end-to-end + corrección de bugs |

## Semana 2 (pulido y despliegue)

| Día | Tarea |
|---|---|
| Lunes | Perfil de usuario editable |
| Martes | Responsive design completo + accesibilidad |
| Miércoles | Despliegue backend en Railway |
| Jueves | Despliegue frontend en Vercel |
| Viernes | Pruebas en producción + documentación final |

## Semana 3+ (IA y escalabilidad)

- Integración OpenAI API para explicaciones
- Sistema RAG con contenido del MEP
- Tutor conversacional
- Recomendaciones adaptativas

---

## Criterios de "done" para el 100%

- [ ] Flujo completo: registro → login → materia → tema → preguntas → progreso
- [ ] JWT implementado
- [ ] Simulacro completo con temporizador
- [ ] Al menos 3 materias con contenido
- [ ] Desplegado en producción
- [ ] README completo
