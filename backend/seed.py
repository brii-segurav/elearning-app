"""
Script para cargar datos iniciales de Estudios Sociales en la base de datos.
Ejecutar una sola vez: python seed.py
"""
from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://postgres:2026@localhost/elearning"
engine = create_engine(DATABASE_URL)

def seed():
    with engine.connect() as conn:

        # ── Asegurar columnas necesarias ──────────────────────────────────────
        conn.execute(text("""
            ALTER TABLE topics ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0
        """))
        conn.execute(text("""
            ALTER TABLE subjects ADD COLUMN IF NOT EXISTS description TEXT
        """))
        conn.execute(text("""
            ALTER TABLE questions ADD COLUMN IF NOT EXISTS option_a TEXT
        """))
        conn.execute(text("""
            ALTER TABLE questions ADD COLUMN IF NOT EXISTS option_b TEXT
        """))
        conn.execute(text("""
            ALTER TABLE questions ADD COLUMN IF NOT EXISTS option_c TEXT
        """))
        conn.execute(text("""
            ALTER TABLE questions ADD COLUMN IF NOT EXISTS option_d TEXT
        """))
        conn.execute(text("""
            ALTER TABLE questions ADD COLUMN IF NOT EXISTS correct CHAR(1)
        """))
        conn.execute(text("""
            ALTER TABLE questions ADD COLUMN IF NOT EXISTS difficulty VARCHAR(10) DEFAULT 'medium'
        """))
        conn.execute(text("""
            ALTER TABLE progress ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()
        """))
        conn.execute(text("""
            ALTER TABLE progress ADD CONSTRAINT IF NOT EXISTS progress_user_topic_unique UNIQUE (user_id, topic_id)
        """))
        conn.commit()

        # ── Materia ───────────────────────────────────────────────────────────
        existing_subject = conn.execute(
            text("SELECT id FROM subjects WHERE name = 'Estudios Sociales'")
        ).fetchone()

        if existing_subject:
            subject_id = existing_subject[0]
            print(f"✅ Materia ya existe (id={subject_id})")
        else:
            result = conn.execute(
                text("""
                    INSERT INTO subjects (name, description)
                    VALUES ('Estudios Sociales', 'Historia, geografía, educación cívica y economía de Costa Rica y el mundo')
                    RETURNING id
                """)
            )
            subject_id = result.fetchone()[0]
            conn.commit()
            print(f"✅ Materia creada (id={subject_id})")

        # ── Temas ─────────────────────────────────────────────────────────────
        topics_data = [
            ("Historia de Costa Rica", "Desde la colonia hasta la época contemporánea", 1),
            ("Geografía de Costa Rica", "Regiones, ríos, montañas y división territorial", 2),
            ("Educación Cívica", "Instituciones, derechos y deberes ciudadanos", 3),
            ("Historia Universal", "Grandes eventos y procesos históricos mundiales", 4),
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
                    text("""
                        INSERT INTO topics (subject_id, name, description, order_index)
                        VALUES (:sid, :name, :desc, :order)
                        RETURNING id
                    """),
                    {"sid": subject_id, "name": name, "desc": desc, "order": order}
                )
                topic_ids[name] = result.fetchone()[0]
                print(f"  ✅ Tema creado: {name}")

        conn.commit()

        # ── Preguntas ─────────────────────────────────────────────────────────
        questions_data = [
            # Historia de Costa Rica
            (
                topic_ids["Historia de Costa Rica"],
                "¿En qué año se abolió el ejército en Costa Rica?",
                "1948", "1949", "1950", "1821",
                "B",
                "El 1 de diciembre de 1948, José Figueres Ferrer abolió el ejército y lo estableció en la Constitución de 1949.",
                "easy"
            ),
            (
                topic_ids["Historia de Costa Rica"],
                "¿Quién fue el presidente que abolió el ejército en Costa Rica?",
                "Rafael Ángel Calderón Guardia", "Otilio Ulate Blanco",
                "José Figueres Ferrer", "Mario Echandi Jiménez",
                "C",
                "José Figueres Ferrer, conocido como 'Don Pepe', fue quien tomó la decisión histórica de abolir el ejército.",
                "easy"
            ),
            (
                topic_ids["Historia de Costa Rica"],
                "¿En qué año se independizó Costa Rica de España?",
                "1821", "1838", "1848", "1856",
                "A",
                "Costa Rica se independizó el 15 de septiembre de 1821, junto con el resto de Centroamérica.",
                "easy"
            ),
            (
                topic_ids["Historia de Costa Rica"],
                "¿Cuál fue la batalla que consolidó la independencia centroamericana frente a los filibusteros?",
                "Batalla de Rivas", "Batalla de Santa Rosa",
                "Batalla de Sardinal", "Batalla de La Trinidad",
                "B",
                "La Batalla de Santa Rosa (1856) fue la primera victoria costarricense contra las fuerzas de William Walker.",
                "medium"
            ),
            (
                topic_ids["Historia de Costa Rica"],
                "¿Quién fue Juan Santamaría?",
                "Un político del siglo XIX", "El héroe nacional que incendió el mesón en Rivas",
                "Un general del ejército costarricense", "El primer presidente de Costa Rica",
                "B",
                "Juan Santamaría fue el soldado raso que incendió el mesón donde se refugiaban los filibusteros en Rivas, Nicaragua, en 1856.",
                "easy"
            ),
            (
                topic_ids["Historia de Costa Rica"],
                "¿Cuál fue la primera Constitución Política de Costa Rica como república independiente?",
                "Constitución de 1821", "Constitución de 1844",
                "Constitución de 1871", "Constitución de 1949",
                "C",
                "La Constitución de 1871 fue la que rigió por más tiempo en Costa Rica antes de la actual de 1949.",
                "hard"
            ),
            (
                topic_ids["Historia de Costa Rica"],
                "¿En qué año se proclamó Costa Rica como república independiente?",
                "1821", "1838", "1848", "1856",
                "C",
                "Costa Rica se proclamó república independiente en 1848, bajo la presidencia de José María Castro Madriz.",
                "medium"
            ),
            (
                topic_ids["Historia de Costa Rica"],
                "¿Cuál fue el principal producto de exportación que impulsó la economía costarricense en el siglo XIX?",
                "El banano", "El café",
                "El cacao", "La caña de azúcar",
                "B",
                "El café fue el producto que transformó la economía costarricense en el siglo XIX, generando riqueza y modernización.",
                "easy"
            ),

            # Geografía de Costa Rica
            (
                topic_ids["Geografía de Costa Rica"],
                "¿Cuántas regiones socioeconómicas tiene Costa Rica?",
                "4", "5", "6", "7",
                "C",
                "Costa Rica está dividida en 6 regiones socioeconómicas: Central, Chorotega, Pacífico Central, Brunca, Huetar Atlántica y Huetar Norte.",
                "medium"
            ),
            (
                topic_ids["Geografía de Costa Rica"],
                "¿Cuál es el volcán más alto de Costa Rica?",
                "Volcán Irazú", "Volcán Turrialba",
                "Volcán Poás", "Cerro Chirripó",
                "D",
                "El Cerro Chirripó, con 3.821 metros, es el punto más alto de Costa Rica y de toda Centroamérica.",
                "easy"
            ),
            (
                topic_ids["Geografía de Costa Rica"],
                "¿Cuál es el río más largo de Costa Rica?",
                "Río Tempisque", "Río Reventazón",
                "Río General", "Río Río Grande de Térraba",
                "D",
                "El Río Grande de Térraba (también llamado Río Térraba o Río Sierpe) es el más largo de Costa Rica.",
                "hard"
            ),
            (
                topic_ids["Geografía de Costa Rica"],
                "¿Con qué países limita Costa Rica?",
                "Nicaragua y Panamá", "Honduras y Nicaragua",
                "Panamá y Colombia", "Nicaragua y Honduras",
                "A",
                "Costa Rica limita al norte con Nicaragua y al sur con Panamá.",
                "easy"
            ),
            (
                topic_ids["Geografía de Costa Rica"],
                "¿Cuál es la capital de Costa Rica?",
                "Cartago", "Heredia",
                "San José", "Alajuela",
                "C",
                "San José es la capital y ciudad más grande de Costa Rica desde 1823.",
                "easy"
            ),
            (
                topic_ids["Geografía de Costa Rica"],
                "¿Cuántas provincias tiene Costa Rica?",
                "5", "6", "7", "8",
                "C",
                "Costa Rica tiene 7 provincias: San José, Alajuela, Cartago, Heredia, Guanacaste, Puntarenas y Limón.",
                "easy"
            ),

            # Educación Cívica
            (
                topic_ids["Educación Cívica"],
                "¿Cuántos poderes tiene el Estado costarricense?",
                "2", "3", "4", "5",
                "B",
                "El Estado costarricense tiene 3 poderes: Ejecutivo, Legislativo y Judicial.",
                "easy"
            ),
            (
                topic_ids["Educación Cívica"],
                "¿Cuántos diputados tiene la Asamblea Legislativa de Costa Rica?",
                "42", "52", "57", "62",
                "C",
                "La Asamblea Legislativa de Costa Rica está compuesta por 57 diputados.",
                "medium"
            ),
            (
                topic_ids["Educación Cívica"],
                "¿Cada cuántos años se elige al Presidente de Costa Rica?",
                "4 años", "5 años",
                "6 años", "3 años",
                "A",
                "El Presidente de Costa Rica se elige cada 4 años y no puede ser reelecto de forma consecutiva.",
                "easy"
            ),
            (
                topic_ids["Educación Cívica"],
                "¿Cuál institución es la encargada de organizar las elecciones en Costa Rica?",
                "La Asamblea Legislativa", "El Tribunal Supremo de Elecciones",
                "La Corte Suprema de Justicia", "El Ministerio de Gobernación",
                "B",
                "El Tribunal Supremo de Elecciones (TSE) es el organismo autónomo encargado de organizar y fiscalizar los procesos electorales.",
                "easy"
            ),
            (
                topic_ids["Educación Cívica"],
                "¿En qué año se promulgó la Constitución Política vigente de Costa Rica?",
                "1948", "1949", "1950", "1821",
                "B",
                "La Constitución Política de Costa Rica fue promulgada el 7 de noviembre de 1949 y sigue vigente.",
                "easy"
            ),
            (
                topic_ids["Educación Cívica"],
                "¿Cuál es la función principal del Poder Judicial?",
                "Crear leyes", "Ejecutar el presupuesto nacional",
                "Administrar justicia", "Organizar elecciones",
                "C",
                "El Poder Judicial tiene como función principal administrar justicia de manera independiente.",
                "easy"
            ),

            # Historia Universal
            (
                topic_ids["Historia Universal"],
                "¿En qué año comenzó la Primera Guerra Mundial?",
                "1912", "1914", "1916", "1918",
                "B",
                "La Primera Guerra Mundial comenzó en 1914 con el asesinato del Archiduque Francisco Fernando.",
                "easy"
            ),
            (
                topic_ids["Historia Universal"],
                "¿Cuál fue el sistema económico que se opuso al capitalismo durante la Guerra Fría?",
                "Feudalismo", "Mercantilismo",
                "Comunismo", "Fascismo",
                "C",
                "El comunismo, representado principalmente por la URSS, fue el sistema que se opuso al capitalismo durante la Guerra Fría.",
                "easy"
            ),
            (
                topic_ids["Historia Universal"],
                "¿En qué año cayó el Muro de Berlín?",
                "1987", "1989", "1991", "1993",
                "B",
                "El Muro de Berlín cayó el 9 de noviembre de 1989, marcando el fin de la Guerra Fría.",
                "medium"
            ),
            (
                topic_ids["Historia Universal"],
                "¿Qué organización internacional se creó después de la Segunda Guerra Mundial para mantener la paz?",
                "La Liga de las Naciones", "La OTAN",
                "La ONU", "El Banco Mundial",
                "C",
                "La Organización de las Naciones Unidas (ONU) fue fundada en 1945 para mantener la paz y seguridad internacional.",
                "easy"
            ),
            (
                topic_ids["Historia Universal"],
                "¿Cuál fue la revolución que transformó la producción industrial en el siglo XVIII?",
                "La Revolución Francesa", "La Revolución Industrial",
                "La Revolución Americana", "La Revolución Rusa",
                "B",
                "La Revolución Industrial, iniciada en Inglaterra en el siglo XVIII, transformó los métodos de producción y la sociedad.",
                "easy"
            ),
        ]

        inserted = 0
        for q in questions_data:
            existing = conn.execute(
                text("SELECT id FROM questions WHERE question = :q AND topic_id = :tid"),
                {"q": q[1], "tid": q[0]}
            ).fetchone()

            if not existing:
                conn.execute(
                    text("""
                        INSERT INTO questions
                        (topic_id, question, option_a, option_b, option_c, option_d, correct, explanation, difficulty)
                        VALUES (:tid, :q, :a, :b, :c, :d, :correct, :explanation, :difficulty)
                    """),
                    {
                        "tid": q[0], "q": q[1],
                        "a": q[2], "b": q[3], "c": q[4], "d": q[5],
                        "correct": q[6], "explanation": q[7], "difficulty": q[8]
                    }
                )
                inserted += 1

        conn.commit()
        print(f"\n✅ Seed completado: {inserted} preguntas insertadas")
        print(f"   Temas: {len(topic_ids)}")
        print(f"   Total preguntas en BD: {len(questions_data)}")


if __name__ == "__main__":
    seed()
