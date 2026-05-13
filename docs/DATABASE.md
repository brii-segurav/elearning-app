# Base de datos — Cognia Lab

## Motor: PostgreSQL

## Diagrama de relaciones

```
users ──────────────────────────────────────────────────────┐
  id, email, password, name, last_name, country,            │
  language, theme, created_at                               │
                                                            │
subjects                                                    │
  id, name, description                                     │
       │                                                    │
       └──► topics                                          │
              id, subject_id, name, description,            │
              order_index                                    │
                   │                                        │
                   └──► questions                           │
                          id, topic_id, question,           │
                          option_a/b/c/d, correct,          │
                          explanation, difficulty           │
                               │                            │
                               └──► attempts ◄──────────────┘
                                      id, user_id,
                                      question_id,
                                      selected_answer,
                                      is_correct,
                                      created_at

progress
  id, user_id, topic_id,
  completion_percentage, updated_at
  UNIQUE(user_id, topic_id)
```

## Tablas

### users
| Campo | Tipo | Descripción |
|---|---|---|
| id | SERIAL PK | Identificador único |
| email | VARCHAR UNIQUE | Correo del usuario |
| password | TEXT | Hash bcrypt |
| name | VARCHAR | Nombre |
| last_name | VARCHAR | Apellido |
| country | VARCHAR | País |
| language | VARCHAR(10) | 'es' o 'en' |
| theme | VARCHAR(10) | 'light' o 'dark' |
| created_at | TIMESTAMP | Fecha de registro |

### subjects
| Campo | Tipo | Descripción |
|---|---|---|
| id | SERIAL PK | Identificador |
| name | VARCHAR | Nombre de la materia |
| description | TEXT | Descripción |

### topics
| Campo | Tipo | Descripción |
|---|---|---|
| id | SERIAL PK | Identificador |
| subject_id | FK → subjects | Materia a la que pertenece |
| name | VARCHAR | Nombre del tema |
| description | TEXT | Descripción |
| order_index | INTEGER | Orden de aparición |

### questions
| Campo | Tipo | Descripción |
|---|---|---|
| id | SERIAL PK | Identificador |
| topic_id | FK → topics | Tema al que pertenece |
| question | TEXT | Enunciado de la pregunta |
| option_a/b/c/d | TEXT | Opciones de respuesta |
| correct | CHAR(1) | Respuesta correcta: A, B, C o D |
| explanation | TEXT | Explicación de la respuesta |
| difficulty | VARCHAR | easy / medium / hard |

### attempts
| Campo | Tipo | Descripción |
|---|---|---|
| id | SERIAL PK | Identificador |
| user_id | FK → users | Usuario que respondió |
| question_id | FK → questions | Pregunta respondida |
| selected_answer | CHAR(1) | Respuesta seleccionada |
| is_correct | BOOLEAN | Si fue correcta |
| created_at | TIMESTAMP | Fecha del intento |

### progress
| Campo | Tipo | Descripción |
|---|---|---|
| id | SERIAL PK | Identificador |
| user_id | FK → users | Usuario |
| topic_id | FK → topics | Tema |
| completion_percentage | FLOAT | % de aciertos |
| updated_at | TIMESTAMP | Última actualización |
| UNIQUE | (user_id, topic_id) | Un registro por usuario/tema |

## Lógica de progreso

El porcentaje se calcula así:

```
completion_percentage = (respuestas_correctas / total_preguntas_del_tema) * 100
```

Se actualiza automáticamente en cada `POST /attempt`.
