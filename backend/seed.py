"""
Script para inicializar la base de datos con tablas y datos estilo MEP.
Ejecutar: python seed.py
"""
from sqlalchemy import create_engine, text

DATABASE_URL = "sqlite:///./elearning.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


def create_tables(conn):
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT, last_name TEXT, country TEXT,
            language TEXT DEFAULT 'es', theme TEXT DEFAULT 'light',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """))
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL, description TEXT
        )
    """))
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS topics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject_id INTEGER REFERENCES subjects(id),
            name TEXT NOT NULL, description TEXT,
            order_index INTEGER DEFAULT 0
        )
    """))
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic_id INTEGER REFERENCES topics(id),
            context_text TEXT,
            question TEXT NOT NULL,
            option_a TEXT, option_b TEXT, option_c TEXT, option_d TEXT,
            correct TEXT, explanation TEXT,
            difficulty TEXT DEFAULT 'medium'
        )
    """))
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER REFERENCES users(id),
            question_id INTEGER REFERENCES questions(id),
            selected_answer TEXT, is_correct INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """))
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER REFERENCES users(id),
            topic_id INTEGER REFERENCES topics(id),
            completion_percentage REAL DEFAULT 0.0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, topic_id)
        )
    """))
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS reset_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER REFERENCES users(id),
            code TEXT NOT NULL, expires_at TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """))
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS exam_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER REFERENCES users(id),
            exam_type TEXT NOT NULL,
            total_questions INTEGER, correct_answers INTEGER,
            score REAL, time_used_seconds INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """))
    conn.commit()
    print("✅ Tablas creadas")


# ── Textos de contexto reutilizables (estilo MEP) ────────────────────────────
CTX_ABOLICION = """La abolición del ejército en Costa Rica es uno de los hitos más importantes de la historia contemporánea del país. El 1 de diciembre de 1948, José Figueres Ferrer, jefe de la Junta Fundadora de la Segunda República, tomó una decisión sin precedentes en América Latina: disolver las fuerzas armadas costarricenses. En un acto simbólico realizado en el Cuartel Bella Vista —hoy Museo Nacional—, Figueres entregó las llaves del cuartel al entonces ministro de Educación, declarando que la educación y la cultura serían las únicas armas del pueblo costarricense.

Esta decisión fue posteriormente consagrada en el artículo 12 de la Constitución Política de 1949, que establece: "Se proscribe el Ejército como institución permanente." Los recursos antes destinados al mantenimiento militar fueron redirigidos hacia la educación y la salud, pilares que han caracterizado el desarrollo social de Costa Rica en el siglo XX y XXI.

La abolición del ejército permitió que Costa Rica se consolidara como un estado de derecho, con énfasis en la diplomacia y la resolución pacífica de conflictos. En 1983, el presidente Luis Alberto Monge proclamó la neutralidad perpetua, activa y no armada de Costa Rica, reforzando esta vocación pacifista a nivel internacional."""

CTX_INDEPENDENCIA = """El proceso de independencia de Centroamérica fue un fenómeno político complejo que se desarrolló en el contexto de las guerras napoleónicas en Europa y los movimientos independentistas en América del Sur. El 15 de septiembre de 1821, las Provincias Unidas del Centro de América declararon su independencia del Imperio español mediante el Acta de Independencia firmada en Guatemala.

En Costa Rica, la noticia de la independencia llegó hasta el 13 de octubre de 1821, casi un mes después, debido a las dificultades de comunicación de la época. Este retraso generó un período de incertidumbre política en el que las principales ciudades —Cartago, San José, Alajuela y Heredia— debatieron si unirse a México, al Imperio Centroamericano o constituirse como nación independiente.

El conflicto culminó con la Batalla de Ochomogo el 5 de abril de 1823, en la que las fuerzas republicanas de San José y Alajuela derrotaron a las fuerzas imperialistas de Cartago y Heredia. Este triunfo consolidó la tendencia republicana y federal en Costa Rica, sentando las bases para el desarrollo institucional del país. San José fue proclamada capital en ese mismo año, desplazando a Cartago, que había sido el centro colonial."""

CTX_CAMPAÑA_NACIONAL = """La Campaña Nacional de 1856-1857 representa el episodio bélico más significativo en la historia de Costa Rica. El conflicto surgió cuando el filibustero norteamericano William Walker, quien había tomado control de Nicaragua, intentó expandir su dominio sobre toda Centroamérica con el objetivo de establecer estados esclavistas bajo influencia de los Estados del Sur de los Estados Unidos.

El presidente Juan Rafael Mora Porras organizó un ejército de voluntarios costarricenses —en su mayoría campesinos y artesanos sin experiencia militar— y los envió a combatir en territorio nicaragüense. La primera gran victoria ocurrió en la Hacienda Santa Rosa, Guanacaste, el 20 de marzo de 1856, donde las fuerzas costarricenses derrotaron rápidamente a los filibusteros en apenas 14 minutos de combate.

Posteriormente, en la Batalla de Rivas del 11 de abril de 1856, el ejército costarricense enfrentó una resistencia más organizada. Fue en este contexto que el tambor Juan Santamaría, originario de Alajuela, incendió el mesón donde se refugiaban los filibusteros, sacrificando su vida en el proceso. Su acto heroico permitió la victoria costarricense y lo convirtió en el héroe nacional por excelencia.

La campaña tuvo un alto costo humano: no tanto por las bajas en combate, sino por una epidemia de cólera que diezmó al ejército costarricense durante su regreso. Se estima que murieron más de diez mil personas entre soldados y civiles, en una población total que no superaba los cien mil habitantes."""

CTX_REGIONES_CR = """Costa Rica está organizada en seis regiones socioeconómicas, establecidas con el objetivo de facilitar la planificación y el desarrollo territorial equilibrado del país. Estas regiones agrupan cantones con características geográficas, económicas y culturales similares.

La Región Central concentra la mayor densidad poblacional y la actividad económica más diversificada del país. En ella se ubican las cuatro ciudades del Valle Central (San José, Alajuela, Cartago y Heredia) y alberga aproximadamente el 60% de la población nacional. Es el principal centro industrial, comercial y de servicios del país.

La Región Chorotega, ubicada en la provincia de Guanacaste, se caracteriza por su clima seco, la ganadería extensiva y el turismo de sol y playa. Enfrenta desafíos importantes en términos de abastecimiento de agua y desarrollo sostenible.

La Región Pacífico Central comprende parte de Puntarenas y se destaca por la pesca, la producción de aceite de palma y el turismo. La Región Brunca, en el sur del país, tiene una fuerte presencia indígena y basa su economía en la agricultura y la ganadería.

La Región Huetar Atlántica (también llamada Huetar Caribe) abarca la provincia de Limón. Es la principal productora de banano y piña del país, y tiene una rica diversidad cultural producto de la presencia afrocaribeña, indígena y mestiza. Finalmente, la Región Huetar Norte, fronteriza con Nicaragua, se dedica principalmente a la ganadería lechera y la producción de piña."""

CTX_PODERES = """El Estado costarricense se organiza bajo el principio de separación de poderes, establecido en la Constitución Política de 1949. Esta división busca evitar la concentración del poder en una sola persona o institución y garantizar el equilibrio democrático mediante mecanismos de control mutuo conocidos como "frenos y contrapesos."

El Poder Ejecutivo está encabezado por el Presidente de la República, quien es elegido cada cuatro años mediante voto popular directo y no puede ser reelecto de forma inmediata. El presidente es el jefe de Estado y de Gobierno, y tiene a su cargo la administración pública a través de los ministerios. Le asisten dos Vicepresidentes.

El Poder Legislativo recae en la Asamblea Legislativa, compuesta por 57 diputados elegidos también cada cuatro años. Sus funciones principales son crear, reformar y derogar leyes, aprobar el presupuesto nacional y ejercer control político sobre el Ejecutivo mediante interpelaciones a los ministros.

El Poder Judicial, cuyo máximo órgano es la Corte Suprema de Justicia, tiene como función administrar justicia de forma independiente. Está integrado por 22 magistrados elegidos por la Asamblea Legislativa por períodos de ocho años. Dentro del Poder Judicial funciona la Sala Constitucional (Sala IV), creada en 1989, encargada de velar por la supremacía de la Constitución y la tutela de los derechos fundamentales.

Existen además órganos con independencia funcional como el Tribunal Supremo de Elecciones (TSE), la Contraloría General de la República y la Defensoría de los Habitantes, que complementan el sistema de frenos y contrapesos."""

CTX_GUERRA_FRIA = """La Guerra Fría fue el período de tensión geopolítica, ideológica y militar que enfrentó a las dos superpotencias surgidas tras la Segunda Guerra Mundial: los Estados Unidos, representando el bloque capitalista occidental, y la Unión Soviética (URSS), encabezando el bloque comunista oriental. Aunque nunca hubo un enfrentamiento armado directo entre ambas potencias —de ahí el término "fría"—, el conflicto se manifestó en guerras por delegación, carreras armamentistas y espaciales, y una intensa pugna ideológica.

El período se inicia convencionalmente en 1947 con la Doctrina Truman y el Plan Marshall, y concluye en 1991 con la disolución de la URSS. Durante este tiempo, el mundo estuvo dividido en esferas de influencia: el bloque occidental agrupado en la OTAN (Organización del Tratado del Atlántico Norte) y el bloque oriental en el Pacto de Varsovia.

Algunos de los eventos más significativos de la Guerra Fría incluyeron el Bloqueo de Berlín (1948-49), la Guerra de Corea (1950-53), la Crisis de los Misiles de Cuba (1962)—considerada el momento de mayor peligro de guerra nuclear—, la Guerra de Vietnam (1955-75) y la invasión soviética de Afganistán (1979). La caída del Muro de Berlín el 9 de noviembre de 1989 simbolizó el colapso del bloque comunista europeo y anticipó el fin formal de la Guerra Fría."""

CTX_REV_INDUSTRIAL = """La Revolución Industrial fue un proceso de transformación económica, tecnológica y social que se inició en Gran Bretaña aproximadamente en la década de 1760 y se extendió progresivamente a Europa occidental, América del Norte y otras regiones del mundo a lo largo del siglo XIX. Representó el tránsito de una economía agraria y artesanal hacia una economía industrial basada en la producción mecanizada y el uso de combustibles fósiles.

Entre los factores que hicieron posible la Revolución Industrial en Inglaterra destacan: la disponibilidad de carbón y hierro, una clase mercantil con capital disponible para invertir, un sistema de patentes que incentivaba la innovación, y la existencia de colonias que proveían materias primas y mercados para los productos manufacturados.

Las invenciones clave de este período incluyeron la máquina de vapor perfeccionada por James Watt (1769), el telar mecánico, la locomotora de vapor y posteriormente el motor de combustión interna. Estas innovaciones transformaron radicalmente la producción textil, la minería, la metalurgia y el transporte.

Las consecuencias sociales fueron profundas: surgió el proletariado industrial urbano, las ciudades crecieron de forma acelerada y desordenada, y aparecieron nuevas formas de organización laboral como los sindicatos. También se intensificó la explotación colonial en busca de materias primas, lo que tuvo impactos duraderos en Asia, África y América Latina."""


def seed():
    with engine.connect() as conn:
        create_tables(conn)

        # ── Materia ───────────────────────────────────────────────────────────
        existing_subject = conn.execute(
            text("SELECT id FROM subjects WHERE name = 'Estudios Sociales'")
        ).fetchone()
        if existing_subject:
            subject_id = existing_subject[0]
            print(f"✅ Materia ya existe (id={subject_id})")
        else:
            result = conn.execute(text("""
                INSERT INTO subjects (name, description)
                VALUES ('Estudios Sociales',
                        'Historia, geografía, educación cívica y economía de Costa Rica y el mundo')
            """))
            subject_id = result.lastrowid
            conn.commit()
            print(f"✅ Materia creada (id={subject_id})")

        # ── Temas ─────────────────────────────────────────────────────────────
        topics_data = [
            ("Historia de Costa Rica", "Desde la colonia hasta la época contemporánea", 1),
            ("Geografía de Costa Rica", "Regiones, ríos, montañas y división territorial", 2),
            ("Educación Cívica",        "Instituciones, derechos y deberes ciudadanos", 3),
            ("Historia Universal",      "Grandes eventos y procesos históricos mundiales", 4),
        ]
        topic_ids = {}
        for name, desc, order in topics_data:
            existing = conn.execute(
                text("SELECT id FROM topics WHERE name = :name AND subject_id = :sid"),
                {"name": name, "sid": subject_id}
            ).fetchone()
            if existing:
                topic_ids[name] = existing[0]
                print(f"  ↳ Tema ya existe: {name}")
            else:
                result = conn.execute(
                    text("INSERT INTO topics (subject_id, name, description, order_index) VALUES (:sid, :name, :desc, :order)"),
                    {"sid": subject_id, "name": name, "desc": desc, "order": order}
                )
                topic_ids[name] = result.lastrowid
                print(f"  ✅ Tema creado: {name}")
        conn.commit()

        # ── Preguntas estilo MEP ──────────────────────────────────────────────
        # Formato: (topic_id, context_text, question, a, b, c, d, correct, explanation, difficulty)
        questions_data = [

            # ── HISTORIA DE COSTA RICA ────────────────────────────────────────
            (topic_ids["Historia de Costa Rica"], CTX_ABOLICION,
             "Según el texto, ¿en qué fecha se abolió el ejército en Costa Rica?",
             "15 de septiembre de 1821", "1 de diciembre de 1948",
             "7 de noviembre de 1949",  "5 de abril de 1823", "B",
             "El texto indica explícitamente que fue el 1 de diciembre de 1948 cuando Figueres disolvió las fuerzas armadas.", "easy"),

            (topic_ids["Historia de Costa Rica"], CTX_ABOLICION,
             "¿Qué artículo de la Constitución Política de 1949 consagró la abolición del ejército?",
             "Artículo 9", "Artículo 12", "Artículo 21", "Artículo 33", "B",
             "El texto señala que fue el artículo 12 el que establece la proscripción del ejército como institución permanente.", "medium"),

            (topic_ids["Historia de Costa Rica"], CTX_ABOLICION,
             "Según el texto, ¿qué hizo Figueres con los recursos antes destinados al ejército?",
             "Los depositó en el Banco Central", "Los destinó a obras de infraestructura vial",
             "Los redirigió hacia educación y salud", "Los entregó a las municipalidades", "C",
             "El texto explica que los recursos militares fueron redirigidos hacia la educación y la salud.", "easy"),

            (topic_ids["Historia de Costa Rica"], CTX_INDEPENDENCIA,
             "De acuerdo con el texto, ¿cuándo llegó la noticia de la independencia a Costa Rica?",
             "El 15 de septiembre de 1821", "El 1 de octubre de 1821",
             "El 13 de octubre de 1821",   "El 5 de abril de 1823", "C",
             "El texto indica que la noticia llegó el 13 de octubre de 1821, casi un mes después de la proclamación.", "easy"),

            (topic_ids["Historia de Costa Rica"], CTX_INDEPENDENCIA,
             "Según el texto, ¿qué conflicto consolidó la tendencia republicana en Costa Rica?",
             "La Batalla de Rivas",       "La Batalla de Santa Rosa",
             "La Batalla de Ochomogo",    "La Batalla de Sardinal", "C",
             "El texto señala que la Batalla de Ochomogo del 5 de abril de 1823 consolidó la tendencia republicana y federal.", "medium"),

            (topic_ids["Historia de Costa Rica"], CTX_CAMPAÑA_NACIONAL,
             "Según el texto, ¿cuál fue el objetivo principal de William Walker al invadir Centroamérica?",
             "Establecer una ruta interoceánica por Nicaragua",
             "Expandir su dominio y establecer estados esclavistas",
             "Anexar Centroamérica a los Estados Unidos del Norte",
             "Explotar los recursos naturales de la región", "B",
             "El texto indica que Walker intentaba establecer estados esclavistas bajo influencia de los Estados del Sur.", "medium"),

            (topic_ids["Historia de Costa Rica"], CTX_CAMPAÑA_NACIONAL,
             "De acuerdo con el texto, ¿qué hizo Juan Santamaría en la Batalla de Rivas?",
             "Lideró la carga de caballería costarricense",
             "Negoció la rendición de los filibusteros",
             "Incendió el mesón donde se refugiaban los filibusteros",
             "Organizó el ejército de voluntarios costarricenses", "C",
             "El texto describe que Juan Santamaría incendió el mesón donde se refugiaban los filibusteros, sacrificando su vida.", "easy"),

            (topic_ids["Historia de Costa Rica"], CTX_CAMPAÑA_NACIONAL,
             "Según el texto, ¿cuál fue la principal causa de muertes costarricenses durante la Campaña Nacional?",
             "Las bajas en combate directo contra los filibusteros",
             "Una epidemia de cólera durante el regreso",
             "El bombardeo de los puertos costarricenses",
             "Las enfermedades tropicales en Nicaragua", "B",
             "El texto explica que no fueron tanto las bajas en combate sino la epidemia de cólera la que diezmó al ejército.", "medium"),

            (topic_ids["Historia de Costa Rica"], None,
             "¿En qué año se proclamó Costa Rica como república independiente?",
             "1821", "1838", "1848", "1856", "C",
             "Costa Rica se proclamó república independiente en 1848 bajo la presidencia de José María Castro Madriz.", "medium"),

            (topic_ids["Historia de Costa Rica"], None,
             "¿Cuál fue el principal producto de exportación que transformó la economía costarricense en el siglo XIX?",
             "El banano", "El café", "El cacao", "La caña de azúcar", "B",
             "El café fue el motor económico de Costa Rica en el siglo XIX, generando riqueza y modernización del Estado.", "easy"),

            (topic_ids["Historia de Costa Rica"], None,
             "¿Quién fue el presidente de Costa Rica durante la Campaña Nacional de 1856?",
             "José Figueres Ferrer", "Rafael Ángel Calderón Guardia",
             "Juan Rafael Mora Porras", "Braulio Carrillo Colina", "C",
             "Juan Rafael Mora Porras organizó y lideró la defensa costarricense contra los filibusteros de Walker.", "medium"),

            (topic_ids["Historia de Costa Rica"], None,
             "¿En qué año se dictó la primera Constitución Política de Costa Rica que estuvo vigente por más tiempo?",
             "1844", "1859", "1871", "1917", "C",
             "La Constitución de 1871 fue la de mayor vigencia antes de la actual de 1949, rigiendo hasta 1917 y luego de 1920 a 1949.", "hard"),

            # ── GEOGRAFÍA DE COSTA RICA ───────────────────────────────────────
            (topic_ids["Geografía de Costa Rica"], CTX_REGIONES_CR,
             "Según el texto, ¿qué porcentaje aproximado de la población nacional concentra la Región Central?",
             "40%", "50%", "60%", "75%", "C",
             "El texto indica que la Región Central alberga aproximadamente el 60% de la población nacional.", "easy"),

            (topic_ids["Geografía de Costa Rica"], CTX_REGIONES_CR,
             "De acuerdo con el texto, ¿cuál es el principal desafío que enfrenta la Región Chorotega?",
             "La falta de infraestructura turística",
             "El abastecimiento de agua y el desarrollo sostenible",
             "La ausencia de actividad industrial",
             "La emigración masiva de su población", "B",
             "El texto señala que la Región Chorotega enfrenta desafíos en términos de abastecimiento de agua y desarrollo sostenible.", "medium"),

            (topic_ids["Geografía de Costa Rica"], CTX_REGIONES_CR,
             "Según el texto, ¿qué característica cultural distingue a la Región Huetar Atlántica?",
             "Predominio de población indígena exclusivamente",
             "Rica diversidad cultural por presencia afrocaribeña, indígena y mestiza",
             "Mayoría de población de origen europeo",
             "Comunidades chinas que llegaron a construir el ferrocarril", "B",
             "El texto describe una rica diversidad cultural producto de la presencia afrocaribeña, indígena y mestiza en el Caribe.", "medium"),

            (topic_ids["Geografía de Costa Rica"], None,
             "¿Cuál es el punto más alto de Costa Rica y de toda Centroamérica?",
             "Volcán Irazú (3.432 m)", "Volcán Barva (2.906 m)",
             "Cerro Chirripó (3.821 m)", "Cerro de la Muerte (3.491 m)", "C",
             "El Cerro Chirripó, con 3.821 metros de altitud, es el punto más alto de Costa Rica y de Centroamérica.", "easy"),

            (topic_ids["Geografía de Costa Rica"], None,
             "¿Cuántas provincias tiene Costa Rica y cuál fue la última en crearse?",
             "6 provincias, siendo Limón la última",
             "7 provincias, siendo Limón la última",
             "7 provincias, siendo Guanacaste la última",
             "8 provincias, siendo Puntarenas la última", "B",
             "Costa Rica tiene 7 provincias. Limón fue la última en crearse formalmente como provincia.", "medium"),

            (topic_ids["Geografía de Costa Rica"], None,
             "¿Con qué países limita Costa Rica según su ubicación geográfica?",
             "Guatemala al norte y Panamá al sur",
             "Nicaragua al norte y Panamá al sur",
             "Honduras al norte y Colombia al sur",
             "Nicaragua al norte y Ecuador al sur", "B",
             "Costa Rica limita al norte con Nicaragua y al sur con Panamá, además de tener costas en el Pacífico y el Caribe.", "easy"),

            (topic_ids["Geografía de Costa Rica"], None,
             "¿Cuáles son los dos océanos que bañan las costas de Costa Rica?",
             "Océano Atlántico y Mar Caribe",
             "Océano Pacífico y Océano Atlántico",
             "Océano Pacífico y Mar Caribe",
             "Mar Caribe y Golfo de México", "C",
             "Costa Rica tiene costas en el Océano Pacífico (al oeste) y en el Mar Caribe (al este).", "easy"),

            (topic_ids["Geografía de Costa Rica"], None,
             "¿En qué región socioeconómica se ubica la provincia de Guanacaste?",
             "Región Central", "Región Pacífico Central",
             "Región Chorotega", "Región Huetar Norte", "C",
             "La provincia de Guanacaste forma parte de la Región Chorotega, conocida por su clima seco y ganadería.", "easy"),
        ]

        questions_data += [
            # ── EDUCACIÓN CÍVICA ──────────────────────────────────────────────
            (topic_ids["Educación Cívica"], CTX_PODERES,
             "Según el texto, ¿cuántos magistrados integran la Corte Suprema de Justicia?",
             "15 magistrados", "18 magistrados",
             "22 magistrados", "25 magistrados", "C",
             "El texto indica que la Corte Suprema de Justicia está integrada por 22 magistrados.", "medium"),

            (topic_ids["Educación Cívica"], CTX_PODERES,
             "De acuerdo con el texto, ¿en qué año fue creada la Sala Constitucional (Sala IV)?",
             "1949", "1969", "1989", "1999", "C",
             "El texto señala que la Sala Constitucional fue creada en 1989 para velar por la supremacía constitucional.", "medium"),

            (topic_ids["Educación Cívica"], CTX_PODERES,
             "Según el texto, ¿cuál es la función principal de la Sala Constitucional?",
             "Juzgar a los funcionarios públicos por corrupción",
             "Velar por la supremacía de la Constitución y la tutela de derechos fundamentales",
             "Administrar el presupuesto nacional",
             "Organizar los procesos electorales del país", "B",
             "El texto establece que la Sala IV vela por la supremacía constitucional y la tutela de los derechos fundamentales.", "easy"),

            (topic_ids["Educación Cívica"], CTX_PODERES,
             "¿Qué mecanismo describe el texto para evitar la concentración del poder en Costa Rica?",
             "El sistema parlamentario de gobierno",
             "La descentralización administrativa municipal",
             "Los frenos y contrapesos entre los tres poderes",
             "La participación ciudadana mediante referéndum", "C",
             "El texto menciona los 'frenos y contrapesos' como el mecanismo de control mutuo entre los poderes del Estado.", "medium"),

            (topic_ids["Educación Cívica"], None,
             "¿Cuántos diputados conforman la Asamblea Legislativa de Costa Rica?",
             "42 diputados", "52 diputados", "57 diputados", "62 diputados", "C",
             "La Asamblea Legislativa de Costa Rica está compuesta por 57 diputados elegidos por períodos de 4 años.", "easy"),

            (topic_ids["Educación Cívica"], None,
             "¿Cada cuántos años se elige al Presidente de la República en Costa Rica?",
             "Cada 3 años", "Cada 4 años", "Cada 5 años", "Cada 6 años", "B",
             "El Presidente de Costa Rica es elegido cada 4 años mediante voto popular directo y no puede ser reelecto consecutivamente.", "easy"),

            (topic_ids["Educación Cívica"], None,
             "¿Cuál es la institución encargada de organizar y fiscalizar los procesos electorales en Costa Rica?",
             "La Asamblea Legislativa",
             "El Tribunal Supremo de Elecciones (TSE)",
             "La Corte Suprema de Justicia",
             "El Ministerio de Gobernación y Policía", "B",
             "El TSE es el organismo constitucional autónomo encargado de la materia electoral en Costa Rica.", "easy"),

            (topic_ids["Educación Cívica"], None,
             "¿En qué año entró en vigencia la actual Constitución Política de Costa Rica?",
             "1948", "1949", "1953", "1960", "B",
             "La Constitución Política de Costa Rica fue promulgada el 7 de noviembre de 1949 y sigue vigente.", "easy"),

            (topic_ids["Educación Cívica"], None,
             "¿Qué institución en Costa Rica se encarga de fiscalizar el uso de los fondos públicos?",
             "La Defensoría de los Habitantes",
             "El Ministerio de Hacienda",
             "La Contraloría General de la República",
             "El Banco Central de Costa Rica", "C",
             "La Contraloría General de la República es el órgano constitucional que fiscaliza la Hacienda Pública.", "medium"),

            (topic_ids["Educación Cívica"], None,
             "¿Qué institución en Costa Rica defiende los derechos e intereses de los habitantes frente a la administración pública?",
             "La Sala Constitucional",
             "El Tribunal Supremo de Elecciones",
             "La Procuraduría General de la República",
             "La Defensoría de los Habitantes", "D",
             "La Defensoría de los Habitantes es la institución que protege los derechos de los ciudadanos ante la Administración Pública.", "medium"),

            # ── HISTORIA UNIVERSAL ────────────────────────────────────────────
            (topic_ids["Historia Universal"], CTX_GUERRA_FRIA,
             "Según el texto, ¿qué evento se considera el de mayor peligro de guerra nuclear durante la Guerra Fría?",
             "El Bloqueo de Berlín (1948-49)",
             "La Guerra de Corea (1950-53)",
             "La Crisis de los Misiles de Cuba (1962)",
             "La invasión soviética de Afganistán (1979)", "C",
             "El texto indica que la Crisis de los Misiles de Cuba fue considerada el momento de mayor peligro de guerra nuclear.", "medium"),

            (topic_ids["Historia Universal"], CTX_GUERRA_FRIA,
             "De acuerdo con el texto, ¿por qué se denomina 'fría' a la Guerra Fría?",
             "Porque se desarrolló principalmente en regiones de clima frío",
             "Porque nunca hubo enfrentamiento armado directo entre las superpotencias",
             "Porque las negociaciones se realizaban en países nórdicos",
             "Porque la temperatura internacional era de indiferencia mutua", "B",
             "El texto explica que se llama 'fría' porque nunca hubo un enfrentamiento armado directo entre EE.UU. y la URSS.", "easy"),

            (topic_ids["Historia Universal"], CTX_GUERRA_FRIA,
             "Según el texto, ¿qué evento simbolizó el colapso del bloque comunista europeo?",
             "La disolución de la URSS en 1991",
             "La retirada soviética de Afganistán",
             "La caída del Muro de Berlín el 9 de noviembre de 1989",
             "La firma de los Acuerdos de Helsinki", "C",
             "El texto señala que la caída del Muro de Berlín simbolizó el colapso del bloque comunista europeo.", "easy"),

            (topic_ids["Historia Universal"], CTX_REV_INDUSTRIAL,
             "Según el texto, ¿en qué país se inició la Revolución Industrial?",
             "Francia", "Alemania", "Estados Unidos", "Gran Bretaña", "D",
             "El texto indica explícitamente que la Revolución Industrial se inició en Gran Bretaña.", "easy"),

            (topic_ids["Historia Universal"], CTX_REV_INDUSTRIAL,
             "De acuerdo con el texto, ¿cuál fue una consecuencia social de la Revolución Industrial?",
             "La desaparición de las ciudades y el retorno al campo",
             "El surgimiento del proletariado industrial urbano y los sindicatos",
             "La consolidación de la aristocracia como clase dominante",
             "La eliminación del trabajo infantil en las fábricas", "B",
             "El texto menciona el surgimiento del proletariado industrial, el crecimiento urbano y los sindicatos como consecuencias sociales.", "medium"),

            (topic_ids["Historia Universal"], None,
             "¿En qué año comenzó la Primera Guerra Mundial y cuál fue su detonante inmediato?",
             "1912 — la invasión alemana de Bélgica",
             "1914 — el asesinato del Archiduque Francisco Fernando",
             "1916 — el hundimiento del RMS Lusitania",
             "1918 — la Revolución Rusa", "B",
             "La Primera Guerra Mundial comenzó en 1914. El detonante fue el asesinato del Archiduque en Sarajevo.", "easy"),

            (topic_ids["Historia Universal"], None,
             "¿Qué organización internacional fue creada en 1945 para mantener la paz y la seguridad internacionales?",
             "La Liga de las Naciones",
             "La Organización del Tratado del Atlántico Norte (OTAN)",
             "La Organización de las Naciones Unidas (ONU)",
             "El Fondo Monetario Internacional (FMI)", "C",
             "La ONU fue fundada en 1945 tras la Segunda Guerra Mundial para preservar la paz internacional.", "easy"),

            (topic_ids["Historia Universal"], None,
             "¿Qué proceso histórico del siglo XIX transformó las relaciones de producción e impulsó la urbanización masiva en Europa?",
             "La Revolución Francesa",
             "La Revolución Industrial",
             "El Imperialismo europeo",
             "El Renacimiento cultural", "B",
             "La Revolución Industrial transformó los modos de producción artesanal a industrial, generando urbanización masiva.", "easy"),

            (topic_ids["Historia Universal"], None,
             "¿En qué año cayó el Muro de Berlín, marcando simbólicamente el fin de la Guerra Fría?",
             "1987", "1989", "1991", "1993", "B",
             "El Muro de Berlín cayó el 9 de noviembre de 1989, simbolizando el fin de la división de Europa.", "medium"),
        ]

        # ── Insertar preguntas ────────────────────────────────────────────────
        inserted = 0
        for q in questions_data:
            existing = conn.execute(
                text("SELECT id FROM questions WHERE question = :q AND topic_id = :tid"),
                {"q": q[2], "tid": q[0]}
            ).fetchone()
            if not existing:
                conn.execute(
                    text("""
                        INSERT INTO questions
                            (topic_id, context_text, question,
                             option_a, option_b, option_c, option_d,
                             correct, explanation, difficulty)
                        VALUES (:tid, :ctx, :q, :a, :b, :c, :d, :correct, :explanation, :difficulty)
                    """),
                    {
                        "tid": q[0], "ctx": q[1], "q": q[2],
                        "a": q[3], "b": q[4], "c": q[5], "d": q[6],
                        "correct": q[7], "explanation": q[8], "difficulty": q[9]
                    }
                )
                inserted += 1

        conn.commit()
        total = conn.execute(text("SELECT COUNT(*) FROM questions")).scalar()
        print(f"\n✅ Seed completado: {inserted} preguntas nuevas insertadas")
        print(f"   Total preguntas en BD: {total}")
        print(f"   Temas: {len(topic_ids)}")


if __name__ == "__main__":
    seed()
