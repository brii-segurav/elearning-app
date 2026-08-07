"""
Agrega preguntas adicionales estilo MEP para llegar a >50 y poder hacer simulacros.
Ejecutar: python seed_extra.py
"""
from sqlalchemy import create_engine, text

DATABASE_URL = "sqlite:///./elearning.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

CTX_CAFE = """El café fue el producto que transformó radicalmente la economía y la sociedad costarricense durante el siglo XIX. Su cultivo se inició en el Valle Central a principios del siglo XIX y su exportación comenzó en 1832, cuando el primer cargamento salió hacia Chile. El éxito del café generó una clase de productores rurales relativamente próspera, diferente al modelo de plantación esclavista que predominaba en otras regiones de América Latina.

Los beneficiadores y exportadores de café acumularon el capital suficiente para financiar obras de modernización del Estado costarricense: el Teatro Nacional, inaugurado en 1897 y financiado con un impuesto al café, es el símbolo más visible de esta bonanza. También se construyeron caminos, edificios públicos y se impulsó la educación pública gratuita y obligatoria, establecida por el presidente Mauro Fernández en 1886.

El ferrocarril al Atlántico, concluido en 1890 bajo la dirección del ingeniero norteamericano Minor Keith, fue otra consecuencia del auge cafetalero. Esta obra conectó el Valle Central con el puerto de Limón, facilitando la exportación del grano. Sin embargo, el contrato con Keith también implicó la concesión de tierras que daría origen a la United Fruit Company y al enclave bananero en el Caribe costarricense."""

CTX_BANANO = """La industria bananera en Costa Rica surgió a finales del siglo XIX como consecuencia directa de la construcción del ferrocarril al Atlántico. Minor Keith, el constructor del ferrocarril, comenzó a sembrar banano en las tierras concedidas para financiar la obra y comercializarlo en los mercados de Estados Unidos. En 1899 fundó la United Fruit Company (UFCo), también conocida popularmente como "el pulpo" por su enorme influencia sobre los países centroamericanos.

La UFCo operó en Costa Rica como un Estado dentro del Estado: controlaba tierras, puertos, ferrocarriles, empresas telegráficas y tiendas. Sus trabajadores, en su mayoría afrocaribeños provenientes de Jamaica, vivían en campamentos y eran pagados con cupones válidos solo en las tiendas de la compañía. Las condiciones laborales eran precarias y las enfermedades tropicales, especialmente la malaria y el "mal de Panamá" (un hongo que afectaba las plantas), diezmaban tanto a los trabajadores como a las plantaciones.

En la década de 1930, una huelga masiva de trabajadores bananeros en el Caribe costarricense marcó un hito en la historia del movimiento obrero nacional. El Partido Comunista de Costa Rica, fundado en 1931 por Manuel Mora Valverde, tuvo un papel protagónico en la organización de esta huelga, que logró algunas mejoras en las condiciones laborales."""

CTX_CONSTITUCION_49 = """La Constitución Política de Costa Rica de 1949 es el texto jurídico fundamental que rige la vida institucional del país. Fue redactada por una Asamblea Constituyente de 45 diputados, convocada tras la Guerra Civil de 1948, y entró en vigor el 8 de noviembre de 1949. Esta Constitución derogó la de 1871 y estableció el marco del Estado Social de Derecho costarricense.

Entre sus disposiciones más importantes destacan: la abolición del ejército (artículo 12), el sufragio universal incluyendo a las mujeres por primera vez en la historia electoral costarricense, la autonomía universitaria, la creación del Tribunal Supremo de Elecciones como organismo independiente, y la garantía de derechos sociales como la educación y la salud.

El título V de la Constitución, denominado "Derechos y Garantías Sociales", reconoce los derechos laborales, el derecho a la huelga, la seguridad social y la protección de la familia. Estos derechos reflejan la influencia de la Constitución de México de 1917 y la doctrina social de la Iglesia Católica, así como las reformas sociales impulsadas por el gobierno de Rafael Ángel Calderón Guardia entre 1940 y 1944, que incluyeron el Código de Trabajo y la Caja Costarricense de Seguro Social."""

CTX_ONU = """La Organización de las Naciones Unidas (ONU) fue fundada el 24 de octubre de 1945, cuando entró en vigor su Carta fundacional tras ser ratificada por los cinco miembros permanentes del Consejo de Seguridad y la mayoría de los demás signatarios. Surgió como respuesta a los horrores de la Segunda Guerra Mundial y con el propósito de reemplazar a la deficiente Liga de las Naciones, que había fracasado en prevenir el conflicto.

La Carta de las Naciones Unidas establece como propósitos principales: mantener la paz y la seguridad internacionales, fomentar relaciones de amistad entre las naciones, lograr la cooperación internacional en la solución de problemas económicos, sociales, culturales y humanitarios, y ser el centro que armonice los esfuerzos de las naciones.

Los principales órganos de la ONU son: la Asamblea General, donde todos los Estados miembros tienen representación igualitaria; el Consejo de Seguridad, compuesto por 15 miembros (5 permanentes con derecho a veto: Estados Unidos, Rusia, China, Francia y Reino Unido); la Secretaría General; el Consejo Económico y Social (ECOSOC); y la Corte Internacional de Justicia, con sede en La Haya, Países Bajos.

En 1948, la ONU aprobó la Declaración Universal de los Derechos Humanos, documento que proclama los derechos fundamentales de todos los seres humanos sin distinción alguna."""

CTX_DERECHOS_HUMANOS = """Los derechos humanos son el conjunto de prerrogativas inherentes a la naturaleza de la persona, cuya realización efectiva resulta indispensable para el desarrollo integral del individuo que vive en una sociedad jurídicamente organizada. Se fundamentan en la dignidad humana y se caracterizan por ser universales, inalienables, indivisibles e interdependientes.

El sistema internacional de protección de los derechos humanos tiene como piedra angular la Declaración Universal de los Derechos Humanos, aprobada por la Asamblea General de la ONU el 10 de diciembre de 1948. A nivel regional, el sistema interamericano de derechos humanos está integrado por la Comisión Interamericana de Derechos Humanos y la Corte Interamericana de Derechos Humanos, con sede en San José, Costa Rica desde 1979.

Los derechos humanos se clasifican en tres generaciones: los derechos civiles y políticos (primera generación), que incluyen el derecho a la vida, la libertad, la igualdad ante la ley y la participación política; los derechos económicos, sociales y culturales (segunda generación), como el derecho al trabajo, la educación, la salud y la vivienda; y los derechos de solidaridad o colectivos (tercera generación), entre los que se encuentran el derecho al desarrollo, la paz y un medio ambiente sano."""

CTX_SEGUNDA_GUERRA = """La Segunda Guerra Mundial (1939-1945) fue el conflicto bélico más devastador de la historia de la humanidad, con un saldo estimado de entre 70 y 85 millones de muertos, incluyendo tanto combatientes como civiles. Se desarrolló en múltiples teatros de operaciones en Europa, África, Asia y el Pacífico, e involucró a la mayoría de las naciones del mundo agrupadas en dos bandos: los Aliados (liderados por Reino Unido, Francia, la URSS y Estados Unidos) y las Potencias del Eje (Alemania, Italia y Japón).

El conflicto comenzó el 1 de septiembre de 1939 con la invasión alemana de Polonia, lo que provocó las declaraciones de guerra de Francia y Reino Unido contra Alemania. La ideología nazi del Tercer Reich, liderado por Adolf Hitler, propugnaba la superioridad racial aria y condujo al Holocausto: el exterminio sistemático de aproximadamente seis millones de judíos europeos, además de romaníes, personas con discapacidad, homosexuales y opositores políticos.

El punto de inflexión de la guerra en Europa fue la Batalla de Stalingrado (1942-1943), donde el ejército soviético derrotó al alemán en uno de los combates más cruentos de la historia. En el Pacífico, la guerra concluyó con los bombardeos atómicos estadounidenses sobre Hiroshima (6 de agosto de 1945) y Nagasaki (9 de agosto de 1945), que llevaron a la rendición de Japón. La guerra en Europa había concluido el 8 de mayo de 1945 con la rendición incondicional de Alemania."""


def seed_extra():
    with engine.connect() as conn:
        # Obtener IDs de temas
        topics = conn.execute(text("SELECT id, name FROM topics")).fetchall()
        topic_ids = {row[1]: row[0] for row in topics}

        if not topic_ids:
            print("❌ No hay temas en la BD. Corre seed.py primero.")
            return

        questions_data = [
            # ── HISTORIA DE COSTA RICA ────────────────────────────────────────
            (topic_ids["Historia de Costa Rica"], CTX_CAFE,
             "Según el texto, ¿en qué año salió el primer cargamento de café costarricense al exterior?",
             "1821", "1832", "1848", "1856", "B",
             "El texto indica que la exportación comenzó en 1832, cuando el primer cargamento salió hacia Chile.", "easy"),

            (topic_ids["Historia de Costa Rica"], CTX_CAFE,
             "De acuerdo con el texto, ¿qué obra emblemática fue financiada con un impuesto al café?",
             "El Banco Nacional", "La Universidad de Costa Rica",
             "El Teatro Nacional", "El ferrocarril al Pacífico", "C",
             "El texto señala que el Teatro Nacional, inaugurado en 1897, fue financiado con un impuesto al café.", "easy"),

            (topic_ids["Historia de Costa Rica"], CTX_CAFE,
             "Según el texto, ¿quién estableció la educación pública gratuita y obligatoria en Costa Rica?",
             "José Figueres Ferrer", "Mauro Fernández",
             "Minor Keith", "Juan Rafael Mora Porras", "B",
             "El texto atribuye la educación pública gratuita y obligatoria al presidente Mauro Fernández en 1886.", "medium"),

            (topic_ids["Historia de Costa Rica"], CTX_BANANO,
             "Según el texto, ¿qué apodo tenía la United Fruit Company entre los centroamericanos?",
             "La banana republic", "El pulpo",
             "La compañía amarilla", "El gran trust", "B",
             "El texto indica que la UFCo era conocida como 'el pulpo' por su enorme influencia sobre los países centroamericanos.", "easy"),

            (topic_ids["Historia de Costa Rica"], CTX_BANANO,
             "De acuerdo con el texto, ¿cuál fue el origen de la mayoría de los trabajadores bananeros en el Caribe costarricense?",
             "Colombia", "Panamá", "Jamaica", "Nicaragua", "C",
             "El texto indica que los trabajadores eran en su mayoría afrocaribeños provenientes de Jamaica.", "medium"),

            (topic_ids["Historia de Costa Rica"], CTX_BANANO,
             "Según el texto, ¿quién fundó el Partido Comunista de Costa Rica y tuvo un papel protagónico en la huelga bananera?",
             "José Figueres Ferrer", "Rafael Ángel Calderón Guardia",
             "Manuel Mora Valverde", "Otilio Ulate Blanco", "C",
             "El texto señala que Manuel Mora Valverde fundó el Partido Comunista en 1931 y lideró la organización de la huelga.", "medium"),

            (topic_ids["Historia de Costa Rica"], CTX_CONSTITUCION_49,
             "Según el texto, ¿cuántos diputados integraron la Asamblea Constituyente que redactó la Constitución de 1949?",
             "30 diputados", "45 diputados", "57 diputados", "63 diputados", "B",
             "El texto indica que la Asamblea Constituyente estuvo compuesta por 45 diputados.", "medium"),

            (topic_ids["Historia de Costa Rica"], CTX_CONSTITUCION_49,
             "De acuerdo con el texto, ¿cuál fue un avance histórico de la Constitución de 1949 en materia electoral?",
             "El voto obligatorio para todos los ciudadanos",
             "El sufragio universal incluyendo a las mujeres por primera vez",
             "La reelección presidencial inmediata",
             "La representación proporcional en la Asamblea", "B",
             "El texto destaca que la Constitución de 1949 otorgó el voto a las mujeres por primera vez en la historia electoral costarricense.", "easy"),

            (topic_ids["Historia de Costa Rica"], CTX_CONSTITUCION_49,
             "Según el texto, ¿qué reformas previas influyeron en el contenido social de la Constitución de 1949?",
             "Las reformas liberales de Braulio Carrillo",
             "El Código de Trabajo y la CCSS impulsados por Calderón Guardia",
             "Las reformas educativas de Mauro Fernández",
             "El Tratado de Límites con Panamá", "B",
             "El texto indica que el Código de Trabajo y la CCSS de Calderón Guardia (1940-1944) influyeron en los derechos sociales de la Constitución.", "hard"),

            # ── GEOGRAFÍA DE COSTA RICA ───────────────────────────────────────
            (topic_ids["Geografía de Costa Rica"], None,
             "¿Cuál es la principal cuenca hidrográfica de Costa Rica por volumen de agua?",
             "Cuenca del río Tempisque", "Cuenca del río Reventazón",
             "Cuenca del río Grande de Térraba", "Cuenca del río Sixaola", "C",
             "El río Grande de Térraba tiene la cuenca hidrográfica más extensa y de mayor caudal en Costa Rica.", "hard"),

            (topic_ids["Geografía de Costa Rica"], None,
             "¿Qué tipo de clima predomina en la Región Chorotega (Guanacaste)?",
             "Clima tropical húmedo", "Clima tropical seco",
             "Clima de montaña", "Clima ecuatorial", "B",
             "Guanacaste tiene un clima tropical seco con una marcada estación seca que puede durar hasta 6 meses.", "medium"),

            (topic_ids["Geografía de Costa Rica"], None,
             "¿Cuál es el principal puerto del Caribe costarricense?",
             "Puerto Caldera", "Puerto Quepos",
             "Puerto Limón", "Puerto Golfito", "C",
             "Puerto Limón es el principal puerto en el Caribe costarricense y el más importante para el comercio exterior.", "easy"),

            # ── EDUCACIÓN CÍVICA ──────────────────────────────────────────────
            (topic_ids["Educación Cívica"], CTX_DERECHOS_HUMANOS,
             "Según el texto, ¿cuándo fue aprobada la Declaración Universal de los Derechos Humanos?",
             "24 de octubre de 1945", "10 de diciembre de 1948",
             "1 de enero de 1949",    "25 de junio de 1945", "B",
             "El texto indica que la Declaración fue aprobada el 10 de diciembre de 1948 por la Asamblea General de la ONU.", "easy"),

            (topic_ids["Educación Cívica"], CTX_DERECHOS_HUMANOS,
             "Según el texto, ¿dónde tiene su sede la Corte Interamericana de Derechos Humanos?",
             "Washington D.C., Estados Unidos", "Ginebra, Suiza",
             "San José, Costa Rica",            "Buenos Aires, Argentina", "C",
             "El texto señala que la Corte Interamericana de Derechos Humanos tiene sede en San José, Costa Rica desde 1979.", "medium"),

            (topic_ids["Educación Cívica"], CTX_DERECHOS_HUMANOS,
             "De acuerdo con el texto, ¿cómo se clasifican los derechos humanos en cuanto a generaciones?",
             "Derechos individuales, colectivos y universales",
             "Derechos civiles, económicos y ambientales",
             "Derechos de primera, segunda y tercera generación",
             "Derechos naturales, positivos y sociales", "C",
             "El texto clasifica los derechos humanos en tres generaciones: civiles/políticos, económicos/sociales/culturales, y solidaridad.", "medium"),

            (topic_ids["Educación Cívica"], None,
             "¿Qué institución costarricense se encarga de defender los derechos de los trabajadores y velar por el cumplimiento de la legislación laboral?",
             "La Defensoría de los Habitantes",
             "La Caja Costarricense de Seguro Social",
             "El Ministerio de Trabajo y Seguridad Social",
             "La Procuraduría General de la República", "C",
             "El Ministerio de Trabajo y Seguridad Social es la institución encargada de velar por el cumplimiento de la legislación laboral.", "medium"),

            (topic_ids["Educación Cívica"], None,
             "¿Qué principio constitucional establece que ninguna persona puede ser juzgada dos veces por el mismo delito?",
             "Principio de legalidad", "Principio de inocencia",
             "Non bis in idem",        "Debido proceso", "C",
             "El principio 'non bis in idem' prohíbe que una persona sea juzgada o sancionada dos veces por el mismo hecho.", "hard"),

            (topic_ids["Educación Cívica"], None,
             "¿Cuál es el mecanismo de democracia directa mediante el cual los ciudadanos pueden aprobar o rechazar una ley?",
             "La interpelación", "El referéndum",
             "El plebiscito",    "La iniciativa popular", "B",
             "El referéndum es el mecanismo por el cual los ciudadanos votan directamente para aprobar o rechazar una norma jurídica.", "medium"),

            # ── HISTORIA UNIVERSAL ────────────────────────────────────────────
            (topic_ids["Historia Universal"], CTX_ONU,
             "Según el texto, ¿cuáles son los cinco miembros permanentes del Consejo de Seguridad de la ONU?",
             "EE.UU., Rusia, China, Francia y Alemania",
             "EE.UU., Rusia, China, Francia y Reino Unido",
             "EE.UU., Rusia, China, Brasil y Reino Unido",
             "EE.UU., Rusia, Japón, Francia y Reino Unido", "B",
             "El texto indica que los 5 miembros permanentes con derecho a veto son EE.UU., Rusia, China, Francia y Reino Unido.", "medium"),

            (topic_ids["Historia Universal"], CTX_ONU,
             "De acuerdo con el texto, ¿dónde tiene su sede la Corte Internacional de Justicia?",
             "Ginebra, Suiza", "Bruselas, Bélgica",
             "Nueva York, EE.UU.", "La Haya, Países Bajos", "D",
             "El texto señala que la Corte Internacional de Justicia tiene su sede en La Haya, Países Bajos.", "easy"),

            (topic_ids["Historia Universal"], CTX_SEGUNDA_GUERRA,
             "Según el texto, ¿cuándo comenzó la Segunda Guerra Mundial?",
             "1 de septiembre de 1939", "3 de septiembre de 1939",
             "1 de enero de 1940",      "7 de diciembre de 1941", "A",
             "El texto indica que el conflicto comenzó el 1 de septiembre de 1939 con la invasión alemana de Polonia.", "easy"),

            (topic_ids["Historia Universal"], CTX_SEGUNDA_GUERRA,
             "De acuerdo con el texto, ¿qué batalla marcó el punto de inflexión de la guerra en Europa?",
             "La Batalla de Normandía", "La Batalla de las Ardenas",
             "La Batalla de Stalingrado", "La Batalla de El Alamein", "C",
             "El texto señala que la Batalla de Stalingrado (1942-1943) fue el punto de inflexión donde el ejército soviético derrotó al alemán.", "medium"),

            (topic_ids["Historia Universal"], CTX_SEGUNDA_GUERRA,
             "Según el texto, ¿qué evento llevó a la rendición de Japón en la Segunda Guerra Mundial?",
             "La invasión soviética de Manchuria",
             "La Batalla de Midway",
             "Los bombardeos atómicos sobre Hiroshima y Nagasaki",
             "El bloqueo naval estadounidense del archipiélago japonés", "C",
             "El texto indica que los bombardeos atómicos sobre Hiroshima y Nagasaki llevaron a la rendición de Japón.", "easy"),

            (topic_ids["Historia Universal"], None,
             "¿Qué sistema político caracterizó a los regímenes totalitarios europeos de entreguerras como el nazismo y el fascismo?",
             "Partido único, ultranacionalismo y culto al líder",
             "Sistema multipartidista con restricciones civiles",
             "Monarquía constitucional con poderes ampliados",
             "Democracia popular de partido comunista", "A",
             "El nazismo y el fascismo se caracterizaron por el partido único, el ultranacionalismo exacerbado y el culto a la figura del líder.", "medium"),

            (topic_ids["Historia Universal"], None,
             "¿Cuál fue el principal acuerdo de paz que puso fin a la Primera Guerra Mundial en 1919?",
             "Tratado de Versalles", "Tratado de Westfalia",
             "Acuerdos de Locarno",  "Tratado de Viena", "A",
             "El Tratado de Versalles (1919) puso fin oficialmente a la Primera Guerra Mundial e impuso duras condiciones a Alemania.", "medium"),
        ]

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
        print(f"✅ {inserted} preguntas adicionales insertadas")
        print(f"   Total en BD: {total}")


if __name__ == "__main__":
    seed_extra()
