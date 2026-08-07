# Mi Guía Personal — Cognia Lab
## Todo lo que necesito saber sobre mi proyecto

---

# PARTE 1 — ¿QUÉ ES EL PROYECTO Y CÓMO FUNCIONA?

Cognia Lab es una aplicación web de dos partes que se comunican entre sí:

- **El Frontend** es lo que vos ves en el navegador — las páginas, botones, colores, formularios.
- **El Backend** es el servidor invisible que corre en tu computadora — guarda los datos, verifica contraseñas, hace cálculos.

Cuando vos escribís tu correo y contraseña en el login, el frontend manda esa información al backend. El backend revisa si existe ese usuario, verifica la contraseña, y si todo está bien, manda de vuelta un "token" (como un pase de entrada). El frontend guarda ese token y lo usa en cada petición siguiente para demostrar que sos vos.

---

# PARTE 2 — TECNOLOGÍAS USADAS Y POR QUÉ

## Frontend: React + Vite

**React** es una librería de JavaScript hecha por Meta (Facebook) para construir interfaces de usuario. La idea principal es dividir la pantalla en "componentes" — piezas reutilizables. Por ejemplo, el botón de "Iniciar sesión" es un componente, la barra de navegación es otro.

**Vite** es la herramienta que "construye" el proyecto — convierte el código moderno de React en algo que el navegador puede entender. También tiene un servidor de desarrollo con recarga automática (cuando guardás un archivo, la página se actualiza sola).

Comandos que se usan:
```
npm install    → instala todas las dependencias (node_modules/)
npm run dev    → arranca el servidor de desarrollo en localhost:5173
npm run build  → construye la versión final para publicar
```

## Backend: FastAPI (Python)

**FastAPI** es un framework de Python para crear APIs web. Una API es básicamente un menú de "servicios" que el frontend puede pedir. Por ejemplo: "dame las preguntas del tema 3" o "guarda este intento de respuesta".

FastAPI es muy rápido y genera automáticamente una documentación interactiva en `/docs` donde podés probar cada endpoint sin necesidad del frontend.

Comandos que se usan:
```
python -m uvicorn main:app --reload   → arranca el servidor en 127.0.0.1:8000
python seed.py                        → crea las tablas y carga datos iniciales
python seed_extra.py                  → agrega más preguntas estilo MEP
```

## Base de datos: SQLite

**SQLite** es una base de datos que vive en un solo archivo (`elearning.db`). No necesita instalar nada extra, no necesita un servidor separado — simplemente existe como archivo en la carpeta del backend. Es perfecta para proyectos pequeños y demos.

La alternativa más grande sería PostgreSQL o MySQL, pero SQLite es suficiente para este proyecto.

---

# PARTE 3 — ESTRUCTURA DE ARCHIVOS EXPLICADA UNO POR UNO

## BACKEND

### `backend/main.py` — El punto de entrada

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
```
Estas líneas importan las herramientas que vamos a usar. `asynccontextmanager` permite ejecutar código cuando el servidor arranca.

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield
```
Esto le dice a FastAPI: "cuando el servidor arranque, ejecutá `create_tables()` primero". El `yield` significa "ahora sí, seguí funcionando normalmente". Es como una puerta de entrada que hace limpieza antes de abrir.

```python
app.add_middleware(CORSMiddleware, allow_origins=["*"], ...)
```
**CORS** (Cross-Origin Resource Sharing) es una regla de seguridad del navegador que bloquea peticiones de un origen diferente. Como el frontend corre en `localhost:5173` y el backend en `localhost:8000`, son "orígenes diferentes". Con `allow_origins=["*"]` le decimos "aceptá peticiones de cualquier origen". En producción esto se debería restringir.

```python
app.include_router(auth.router)
app.include_router(questions.router)
# etc...
```
Cada "router" es un grupo de endpoints. Los registramos aquí para que FastAPI los conozca.

---

### `backend/database.py` — La conexión a SQLite

```python
DATABASE_URL = "sqlite:///./elearning.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
```
`DATABASE_URL` le dice a SQLAlchemy dónde está el archivo de base de datos. Los `///` son parte del formato de URL para SQLite. `check_same_thread: False` es necesario porque FastAPI usa múltiples hilos y SQLite por defecto no lo permite.

```python
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```
Una "sesión" es una conexión temporal a la base de datos. `autocommit=False` significa que los cambios no se guardan automáticamente — hay que llamar `conn.commit()` explícitamente.

---

### `backend/auth/security.py` — Contraseñas y tokens

```python
import bcrypt
```
**bcrypt** es un algoritmo de hash para contraseñas. Un hash es una transformación de una sola vía — podés convertir "micontraseña" a un código como `$2b$12$xyz...abc`, pero no podés hacer el camino inverso. Así, aunque alguien robe la base de datos, no sabe las contraseñas reales.

```python
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")
```
`gensalt()` genera un valor aleatorio único para cada hash (esto evita que dos usuarios con la misma contraseña tengan el mismo hash). `encode("utf-8")` convierte el texto a bytes porque bcrypt trabaja con bytes.

```python
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )
```
No "desciframos" la contraseña. Hasheamos la que el usuario escribe y comparamos con la que está guardada. Si coinciden, la contraseña es correcta.

```python
SECRET_KEY = "cognia-lab-secret-key-2025..."
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 horas
```
El **JWT** (JSON Web Token) es como un carnet digital. Cuando el usuario hace login, el servidor le da un JWT firmado con una clave secreta. En cada petición siguiente, el usuario manda ese JWT y el servidor verifica que la firma sea válida — sin necesidad de consultar la base de datos.

```python
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
```
Creamos el token con los datos del usuario (`sub` = su ID) y una fecha de expiración. `jwt.encode` lo firma con la clave secreta.

---

### `backend/routes/auth.py` — Login, registro, recuperación

**Registro:**
```python
@router.post("/register")
def register(user: UserRegister):
    hashed = hash_password(user.password)
    # ... verifica que el email no exista
    # ... inserta en la tabla users
```
Recibe los datos del formulario, hashea la contraseña, verifica que el email no esté registrado, y lo guarda.

**Login:**
```python
@router.post("/login")
def login(user: UserLogin):
    # ... busca el usuario por email
    # ... verifica la contraseña
    token = create_access_token({"sub": str(result[0]), "email": result[1]})
    return {"token": token, "user": {...}}
```
Busca el usuario, verifica la contraseña con bcrypt, y si todo está bien crea y devuelve el JWT.

**Recuperación de contraseña:**
El proceso tiene 3 pasos:
1. Usuario pide reset → se genera código de 6 dígitos → se guarda en tabla `reset_codes` con fecha de expiración de 15 min → se envía por Gmail
2. Usuario ingresa el código → se verifica que sea correcto y no haya expirado
3. Se actualiza la contraseña con el nuevo hash

```python
def send_reset_email(to_email: str, code: str):
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(GMAIL_USER, GMAIL_PASSWORD)
        server.sendmail(GMAIL_USER, to_email, msg.as_string())
```
`SMTP_SSL` abre una conexión segura con el servidor de Gmail en el puerto 465. `GMAIL_PASSWORD` es la "contraseña de aplicación" — no la contraseña normal de Gmail, sino una que Google genera especialmente para apps de terceros.

---

### `backend/routes/questions.py` — Preguntas, quiz y simulacro

```python
@router.get("/quiz/{topic_id}")
def get_quiz(topic_id: int):
    # ... obtiene todas las preguntas del tema
    sample = random.sample(result, min(10, len(result)))
    return {"questions": [...], "time_limit_sec": 180, "type": "quiz"}
```
`random.sample` selecciona 10 preguntas al azar sin repetir. `min(10, len(result))` evita error si hay menos de 10 preguntas.

```python
@router.get("/simulacro")
def get_simulacro():
    result = conn.execute(text("""
        SELECT ... FROM questions ORDER BY RANDOM() LIMIT 50
    """))
```
`ORDER BY RANDOM()` es una función de SQLite que ordena los resultados de forma aleatoria. `LIMIT 50` toma solo 50. Así cada simulacro tiene preguntas diferentes.

**Importante:** las preguntas NO incluyen la respuesta correcta ni la explicación. Esas solo se envían cuando el usuario responde (endpoint `/attempt`), para evitar que alguien las lea del código del navegador.

---

### `backend/routes/cogi.py` — El tutor IA

```python
import httpx
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.1-8b-instant"
```
**Groq** es un servicio de IA gratuito (tiene tier gratis muy generoso). Usa el modelo **Llama 3.1** de Meta, que es open-source. `httpx` es una librería de Python para hacer peticiones HTTP (como `fetch` en JavaScript).

```python
SYSTEM_PROMPT = """Eres Cogi, un tutor educativo simpático...
Tu especialidad es Estudios Sociales del bachillerato costarricense..."""
```
El "system prompt" es la personalidad y las instrucciones que le damos a la IA. Le decimos quién es, cómo debe hablar, y en qué temas debe especializarse. La IA siempre respeta estas instrucciones.

```python
full_messages = [{"role": "system", "content": SYSTEM_PROMPT}] + messages
```
Cada mensaje tiene un "role": `system` (instrucciones), `user` (lo que escribe el estudiante) o `assistant` (lo que responde la IA). Mandamos todo el historial de la conversación en cada petición para que Cogi "recuerde" el contexto.

---

### `backend/seed.py` y `seed_extra.py` — Los datos

Estos scripts crean las tablas y cargan las preguntas. Se corren una sola vez.

Las preguntas están en formato **estilo MEP** — tienen un texto de contexto largo (como los que aparecen en las pruebas reales del bachillerato) y luego 1-4 preguntas basadas en ese texto. Esto simula exactamente cómo son las pruebas de comprensión lectora del examen.

Las preguntas cubren:
- Historia de Costa Rica (independencia, campaña nacional, café, banano, constitución)
- Geografía (regiones, provincias, ríos, clima)
- Educación Cívica (poderes del Estado, derechos humanos, instituciones)
- Historia Universal (guerras mundiales, revolución industrial, guerra fría, ONU)

---

## BASE DE DATOS — TABLAS EXPLICADAS

### Tabla `users`
```sql
id          → número único del usuario (lo asigna la BD automáticamente)
email       → correo electrónico (único, no puede repetirse)
password    → contraseña hasheada con bcrypt (NUNCA la contraseña real)
name        → nombre
last_name   → apellido
country     → país
language    → 'es' o 'en'
theme       → 'light' o 'dark'
created_at  → fecha de creación
```

### Tabla `subjects`
```sql
id          → número único
name        → nombre de la materia (ej: "Estudios Sociales")
description → descripción
```

### Tabla `topics`
```sql
id          → número único
subject_id  → a qué materia pertenece (clave foránea → subjects.id)
name        → nombre del tema (ej: "Historia de Costa Rica")
description → descripción
order_index → orden de aparición
```

### Tabla `questions`
```sql
id           → número único
topic_id     → a qué tema pertenece (clave foránea → topics.id)
context_text → el texto largo de contexto (estilo MEP, puede ser NULL)
question     → la pregunta
option_a     → opción A
option_b     → opción B
option_c     → opción C
option_d     → opción D
correct      → letra de la respuesta correcta ('A', 'B', 'C' o 'D')
explanation  → por qué esa es la respuesta correcta
difficulty   → 'easy', 'medium' o 'hard'
```

### Tabla `attempts`
```sql
id              → número único
user_id         → qué usuario respondió (clave foránea → users.id)
question_id     → qué pregunta respondió (clave foránea → questions.id)
selected_answer → qué opción eligió ('A', 'B', 'C' o 'D')
is_correct      → 1 si acertó, 0 si falló
created_at      → cuándo respondió
```

### Tabla `progress`
```sql
id                    → número único
user_id               → usuario
topic_id              → tema
completion_percentage → porcentaje de aciertos en ese tema (0.0 a 100.0)
updated_at            → última actualización
UNIQUE(user_id, topic_id) → cada usuario solo tiene un registro por tema
```
Cada vez que el usuario responde una pregunta, se recalcula este porcentaje automáticamente.

### Tabla `exam_results`
```sql
id                 → número único
user_id            → usuario
exam_type          → 'quiz' o 'simulacro'
total_questions    → cuántas preguntas tenía
correct_answers    → cuántas acertó
score              → nota de 0 a 100
time_used_seconds  → cuántos segundos tardó
created_at         → cuándo lo hizo
```

### Tabla `reset_codes`
```sql
id         → número único
user_id    → a qué usuario le corresponde
code       → el código de 6 dígitos generado aleatoriamente
expires_at → fecha y hora en que expira (15 minutos después de crearse)
created_at → cuándo se creó
```

---

## FRONTEND — ARCHIVOS EXPLICADOS

### `src/main.jsx` — El arranque de React

```jsx
ReactDOM.createRoot(document.getElementById("root")).render(...)
```
`document.getElementById("root")` busca el `<div id="root">` en `index.html` y React toma control de todo lo que hay adentro. Es el punto de entrada de la app.

```jsx
<LangProvider>
  <App />
</LangProvider>
```
`LangProvider` es el contexto de idioma. Al envolver toda la app con él, cualquier componente adentro puede acceder al idioma actual.

### `src/i18n.jsx` — El sistema de idiomas

```jsx
const dict = {
  es: { hello: "Hola", subjects: "Materias", ... },
  en: { hello: "Hello", subjects: "Subjects", ... }
}
```
Un diccionario simple con todas las palabras de la app en español e inglés.

```jsx
export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const u = JSON.parse(localStorage.getItem("user")) || {}
    return u.language || "es"
  })
  // ...
}
```
`LangProvider` guarda el idioma en un estado de React. Cuando el usuario cambia el idioma en "Mi cuenta" y guarda, se llama `applyLang()` que dispara un evento, `LangProvider` lo escucha y actualiza el idioma, y toda la app se re-renderiza con el nuevo idioma.

```jsx
export const useT = () => useContext(LangCtx).t
```
`useT` es el hook que se usa en cada componente: `const t = useT()` y luego `t("hello")` devuelve "Hola" o "Hello" según el idioma.

### `src/services/api.js` — El cliente HTTP

```javascript
function getToken() {
  return localStorage.getItem("token") || ""
}

export const api = {
  get: async (path) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    return res.json()
  },
  post: async (path, body) => { ... }
}
```
Todas las peticiones al backend pasan por aquí. El token JWT se agrega automáticamente en el header `Authorization: Bearer <token>`. Así el backend sabe quién hace cada petición.

`localStorage` es un almacenamiento del navegador que persiste aunque cierres la pestaña. Ahí guardamos el token y los datos del usuario.

### `src/components/Icon.jsx` — Los íconos

```jsx
export default function Icon({ id, size = 20, style = {} }) {
  return (
    <svg width={size} height={size} style={...}>
      <use href={`/icons.svg#icon-${id}`} />
    </svg>
  )
}
```
En lugar de poner el SVG completo cada vez, usamos un "sprite" — un solo archivo `public/icons.svg` con todos los íconos definidos como `<symbol>`. Luego `<use href="#icon-book">` los referencia. Esto es más eficiente que tener los SVGs repetidos.

### `src/components/SearchBar.jsx` — El buscador

```javascript
timerRef.current = setTimeout(async () => {
  const data = await api.get(`/search?q=${query}`)
  setResults(data.results)
}, 200)
```
**Debounce** — espera 200ms después de que el usuario deja de escribir antes de hacer la búsqueda. Sin esto, haría una petición por cada tecla presionada (demasiadas peticiones).

Los resultados se agrupan por tipo (materias, temas, preguntas) y se muestran en un dropdown. Al hacer click navega directamente a la página correspondiente.

### `src/components/Cogi.jsx` — El chatbot

Cogi tiene tres partes:
1. **El botón flotante** — siempre visible en la esquina inferior derecha, hace un "wiggle" cada 8 segundos para llamar la atención
2. **El corgi SVG** — dibujado completamente con código SVG, sin imágenes externas
3. **El chat** — mantiene el historial de mensajes y los manda al backend

```jsx
const handleSend = async () => {
  const newMessages = [...messages, { role: "user", content: text }]
  setMessages(newMessages)
  const data = await api.post("/cogi", { messages: newMessages, lang })
  setMessages(prev => [...prev, { role: "assistant", content: data.reply }])
}
```
Se manda todo el historial de la conversación en cada petición. Así Groq tiene contexto de lo que se habló antes y Cogi puede "recordar" la conversación.

### `src/pages/Dashboard.jsx` — El panel principal

El Dashboard tiene 4 secciones (pestañas):
- **Materias** — muestra las materias disponibles y las stats del usuario
- **Progreso** — muestra el avance por tema con barras de progreso
- **Noticias** — información del proyecto
- **Mi cuenta** — editar perfil, cambiar idioma y tema

```jsx
const [section, setSection] = useState("subjects")
// ...
{section === "subjects" && <SubjectsSection />}
{section === "progress" && <ProgressSection />}
```
Solo se renderiza la sección activa. `useState` guarda cuál es.

### `src/pages/Questions.jsx` — Los quizzes

```jsx
const [timeLeft, setTimeLeft] = useState(isQuiz ? 180 : null)

useEffect(() => {
  if (!isQuiz || finished || timeUp) return
  const id = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) { setTimeUp(true); setFinished(true); return 0 }
      return prev - 1
    })
  }, 1000)
  return () => clearInterval(id)
}, [isQuiz, finished, timeUp, timeLeft])
```
`setInterval` ejecuta la función cada 1000ms (1 segundo). Descuenta el tiempo. Cuando llega a 0, bloquea el quiz. El `return () => clearInterval(id)` limpia el intervalo cuando el componente se desmonta (para evitar memory leaks).

```jsx
const isQuiz = searchParams.get("mode") === "quiz"
```
La URL `/questions/1?mode=quiz` activa el modo quiz. Sin ese parámetro es práctica libre sin tiempo.

### `src/pages/Simulacro.jsx` — El examen

El simulacro tiene 3 fases:
1. **intro** — pantalla de instrucciones antes de empezar
2. **exam** — el examen en sí con cronómetro y panel de navegación
3. **results** — resultados detallados con revisión de cada respuesta

El panel de navegación lateral muestra los 50 números. Verde = respondida, gris = sin responder. Podés saltar entre preguntas libremente.

### `src/pages/Flashcards.jsx` — Las tarjetas de estudio

Las flashcards tienen modo de volteo:
- **Frente** — muestra la pregunta y las 4 opciones como pistas
- **Atrás** — muestra la respuesta correcta con explicación

```jsx
const handleFlip = async () => {
  if (!flipped && !card.reveal) {
    const data = await api.post("/attempt", { ... selected_answer: "A" })
    // guarda la respuesta correcta en card.reveal
  }
  setFlipped(f => !f)
}
```
La primera vez que volteas, manda una petición al backend para obtener la respuesta correcta (ya que el frontend no la tiene por seguridad). Después la guarda en el estado para no volver a pedirla.

---

# PARTE 4 — FLUJO COMPLETO DE UNA SESIÓN DE ESTUDIO

1. El usuario entra a `localhost:5173` → ve la Landing page
2. Hace click en "Empezar gratis" → va a `/register` → crea su cuenta
3. El frontend manda `POST /register` con los datos → backend hashea la contraseña y la guarda
4. El usuario va a `/login` → ingresa email y contraseña
5. El frontend manda `POST /login` → backend verifica la contraseña con bcrypt
6. Si es correcta, el backend genera un JWT y lo devuelve
7. El frontend guarda el JWT en `localStorage` y lleva al usuario a `/dashboard`
8. El Dashboard carga las materias con `GET /subjects`
9. El usuario hace click en "Estudios Sociales" → va a `/topics/1`
10. Carga los temas con `GET /topics/1` y el progreso con `GET /progress/{userId}`
11. Hace click en "Quiz 3 min" → va a `/questions/1?mode=quiz`
12. El frontend pide `GET /quiz/1` → backend devuelve 10 preguntas aleatorias (sin respuestas)
13. El cronómetro de 3 minutos empieza
14. Cuando el usuario elige una opción, el frontend manda `POST /attempt` con su respuesta
15. El backend verifica si es correcta, actualiza el progreso, y devuelve la respuesta correcta + explicación
16. Al terminar, se muestra la pantalla de resultados con la nota
17. El progreso del tema se actualiza en la base de datos

---

# PARTE 5 — ¿DE DÓNDE SALIÓ LA INFORMACIÓN?

**Las preguntas** están basadas en el programa oficial del MEP de Costa Rica para Estudios Sociales de bachillerato. Los temas son los que aparecen en los exámenes reales: historia costarricense, geografía, educación cívica e historia universal.

**Los textos de contexto** siguen el formato real de las pruebas del MEP — textos largos de comprensión lectora con 1-4 preguntas sobre ese texto. Este formato es exactamente como aparece en el examen real de bachillerato.

**Las tecnologías** fueron elegidas por estas razones:
- **React** → el framework de frontend más popular del mundo, ampliamente usado en la industria
- **FastAPI** → uno de los frameworks Python más modernos y rápidos, con documentación automática
- **SQLite** → perfecto para proyectos que no necesitan escalar a miles de usuarios simultáneos
- **Groq** → servicio gratuito de IA, no requiere tarjeta de crédito
- **bcrypt** → el estándar de la industria para hashear contraseñas
- **JWT** → el método más común para autenticación en APIs modernas

---

# PARTE 6 — COMANDOS PARA CORRER EL PROYECTO

**Siempre que quieras usar el proyecto:**

```
Terminal 1 (Backend):
cd elearning-app/backend
python -m uvicorn main:app --reload

Terminal 2 (Frontend):
cd elearning-app/frontend
npm run dev
```

**Solo la primera vez:**
```
cd backend
python -m pip install fastapi uvicorn sqlalchemy bcrypt python-jose[cryptography] httpx
python seed.py
python seed_extra.py
```

**URLs:**
- App: http://localhost:5173
- API: http://127.0.0.1:8000
- Documentación API: http://127.0.0.1:8000/docs

---

# PARTE 7 — GLOSARIO DE TÉRMINOS TÉCNICOS

| Término | Qué significa |
|---------|---------------|
| **API** | Menú de servicios que ofrece el backend. El frontend le "pide" cosas. |
| **JWT** | Token digital que prueba que estás autenticado. Como un carnet. |
| **Hash** | Transformación de una contraseña a un código irreversible. |
| **bcrypt** | Algoritmo que hashea contraseñas de forma segura. |
| **CORS** | Regla del navegador que controla qué orígenes pueden hacer peticiones. |
| **useState** | Hook de React para guardar datos que cambian en el tiempo. |
| **useEffect** | Hook de React para ejecutar código cuando algo cambia. |
| **localStorage** | Almacenamiento del navegador que persiste al cerrar la pestaña. |
| **endpoint** | Una URL específica del backend que hace algo (ej: `/login`). |
| **router** | Grupo de endpoints relacionados en FastAPI. |
| **hook** | Función especial de React que da acceso a características del framework. |
| **Context** | Forma de compartir datos entre componentes sin pasar props. |
| **debounce** | Técnica para esperar X tiempo antes de ejecutar una función. |
| **sprite SVG** | Archivo con múltiples íconos SVG que se referencian por ID. |
| **SMTP** | Protocolo para enviar correos electrónicos. |
| **Groq** | Servicio de IA en la nube que usa modelos de lenguaje. |
| **Llama** | Modelo de IA de Meta (creadores de Facebook), open-source. |
| **clave foránea** | Referencia en una tabla a un registro de otra tabla. |
| **seed** | Script que carga datos iniciales en la base de datos. |
| **vite** | Herramienta de construcción para proyectos JavaScript modernos. |
| **responsive** | Diseño que se adapta a diferentes tamaños de pantalla. |
