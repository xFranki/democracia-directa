'use client';

import Link from 'next/link';
import {
  ScrollText, CheckCircle2, Clock, Target, Rocket,
  Users, Globe, Lock, Zap, ArrowRight, Github,
} from 'lucide-react';

const FASE1 = [
  'Registro seguro con doble factor de autenticación (2FA)',
  'Perfil público/privado con control total de privacidad',
  'Creación y exploración de propuestas por categoría y territorio',
  'Sistema de votación (a favor / en contra / abstención) con registro en blockchain',
  'Cada voto genera un hash criptográfico — una huella digital única, verificable e irreversible, que garantiza que ningún voto puede ser alterado ni eliminado una vez emitido',
  'La plataforma utiliza una cadena de bloques propia: cada propuesta y cada voto queda encadenado al anterior mediante matemáticas, de forma que manipular un dato obligaría a recalcular toda la cadena',
  'Comentarios, reacciones y propuestas guardadas',
  'Panel de moderación y panel de administración',
  'Explorador de bloques: cualquier ciudadano puede verificar en tiempo real que la cadena es íntegra y que no ha sido manipulada',
];

const FASE2 = [
  { title: 'Notificaciones', desc: 'Avisos cuando una propuesta que sigues cambia de estado, cuando alguien comenta o cuando tu voto queda registrado.' },
  { title: 'Red ciudadana', desc: 'Un espacio de conversación entre usuarios para comentar a título personal, más allá de los votos y los comentarios en propuestas. No es el objetivo principal de la plataforma ni pretende serlo — no queremos construir otro Twitter — pero sí un lugar donde los ciudadanos puedan hablarse directamente sin algoritmos ni intermediarios.' },
  { title: 'Canales de comunidad', desc: 'Presencia en Discord y Telegram para quienes prefieran organizarse fuera de la plataforma.' },
  { title: 'Seguir usuarios', desc: 'Construir red entre ciudadanos sin feed manipulado.' },
  { title: 'Estadísticas públicas', desc: 'Datos abiertos sobre participación por territorio, categoría y fecha.' },
];

const FASE3 = [
  { title: 'API pública', desc: 'Cualquier persona, medio o investigador puede consultar los datos de la plataforma libremente.' },
  { title: 'Exportación de datos', desc: 'Descarga en CSV/JSON de cualquier propuesta o resultado de votación.' },
  { title: 'Identidad verificada opcional', desc: 'Para quien quiera acreditar que es ciudadano español real, sin obligar a nadie ni comprometer la privacidad de quienes prefieran el anonimato.' },
  { title: 'Colaboración abierta', desc: 'Estamos abiertos a colaborar con cualquier asociación, plataforma o colectivo civil que comparta los principios de democracia real y participación ciudadana, sin distinción ideológica.' },
];

const FASE4 = [
  { title: 'App móvil', desc: 'iOS y Android para que participar sea tan fácil como mirar el móvil.' },
  { title: 'Blockchain descentralizada', desc: 'Migración a una cadena pública para que ningún servidor, ni el nuestro, pueda alterar los datos. El registro pasaría a ser propiedad de todos.' },
  { title: 'Federación', desc: 'Que otras organizaciones puedan montar su propia instancia conectada a la red, sin depender de una plataforma central.' },
  { title: 'Puente con lo institucional', desc: 'Mecanismo para trasladar propuestas con respaldo ciudadano suficiente a los canales oficiales, haciendo visible la voluntad popular aunque el sistema no esté obligado a escucharla todavía.' },
];

export default function ManifiestoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Cabecera */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 text-chain-green text-sm font-medium mb-4">
          <ScrollText className="w-4 h-4" />
          Manifiesto
        </div>
        <h1 className="text-5xl font-bold mb-6">Por qué existe esto</h1>
        <p className="text-white/50 text-xl max-w-2xl mx-auto leading-relaxed">
          La historia, las razones y el camino de Democracia Directa.
        </p>
      </div>

      {/* ─── PRESENTACIÓN ─────────────────────────────────────────────────────── */}
      <section className="mb-24">
        <div className="flex items-center gap-3 mb-10">
          <span className="w-8 h-8 rounded-full bg-chain-green/20 border border-chain-green/30 flex items-center justify-center text-chain-green font-bold text-sm shrink-0">I</span>
          <h2 className="text-3xl font-bold">Presentación del proyecto</h2>
        </div>

        <div className="space-y-6 text-white/70 leading-relaxed text-lg">
          <p>
            Las democracias mal llamadas liberales han fallado, los estados nos han fallado. Prometieron democracia y solo obtuvimos más elitismo y separación de clases.
            Este proyecto, esta plataforma nace del deseo y la ilusión de que la democracia funcione, que sea el método de gobierno correcto, pretendemos añadir la tecnología en este proceso.
            Las alternativas me parecen desoladoras en el "primer mundo" en pleno siglo XXI.
          </p>

          <p>
            Yo personalmente, solo soy un ciudadano normal y corriente. Llevo sin votar desde 2019, bajo mi criterio el voto no sirve para nada, solo para legitimar el régimen partidocrático en el que vivimos,
            dando poder a partidos políticos votando una vez cada 4 años. Pregúntate: ¿qué puedes votar? Solo nombres. ¿Puedes influir realmente en algo? No. Para colmo, cuando algún político promete algo
            y al ser elegido no lo cumple, no tiene ninguna repercusión directa ni inmediata. Puede que baje su intención de voto, pero hasta las próximas elecciones eso les da igual.
          </p>

          <div className="card border-red-500/20 bg-red-500/5 py-5 px-6">
            <p className="text-white font-bold text-xl text-center">ESTOY EN CONTRA DEL RÉGIMEN DEL 78.</p>
          </div>

          <p>
            Una frase que me gusta mucho es: <em className="text-white">yo discuto ideas, no ideologías.</em> Con esto quiero decir que el espíritu del proyecto es crear, debatir y enriquecer la sociedad.
            No lo que hacen con nosotros: enfrentarnos, izquierdas contra derechas, ricos contra pobres, comunistas y capitalistas. Todo el mundo tiene ideas en su cabeza que pueden ser aceptadas
            por cualquier persona de cualquier bando político.
          </p>
        </div>
      </section>

      {/* ─── ORIGEN ───────────────────────────────────────────────────────────── */}
      <section className="mb-24">
        <div className="flex items-center gap-3 mb-10">
          <span className="w-8 h-8 rounded-full bg-chain-blue/20 border border-chain-blue/30 flex items-center justify-center text-chain-blue font-bold text-sm shrink-0">II</span>
          <h2 className="text-3xl font-bold">De dónde venimos</h2>
        </div>

        <div className="space-y-6 text-white/70 leading-relaxed text-lg">
          <p>
            Con todo esto quiero hacer mención a mi puerta de entrada a este proyecto. En su día conocí en redes a{' '}
            <span className="text-white font-semibold">Rubén Gisbert</span>, por aquel entonces fundador y presidente de la Junta Democrática de España — antes de hacerse viral,
            cuando aún predicaba en el desierto. A través de él descubrí el pensamiento de <span className="text-white font-semibold">Antonio García-Trevijano</span>.
          </p>

          <div className="card border-chain-blue/20 bg-chain-blue/5">
            <p className="text-white/70 leading-relaxed">
              En 1974, en plena dictadura franquista, García-Trevijano fundó la{' '}
              <a href="https://www.juntademocratica.com" target="_blank" rel="noopener noreferrer" className="text-chain-blue hover:text-white transition-colors font-semibold">
                Junta Democrática de España
              </a>{' '}
              con un objetivo claro: romper con el régimen, no pactar con él. Reclamaba lo que ningún partido se atrevía a exigir en voz alta — una democracia formal real,
              con separación de poderes, elección directa de representantes y soberanía ciudadana plena. Pero la llamada Transición no fue una ruptura: fue una <strong className="text-white">transacción</strong>.
              Franquistas y opositores se repartieron el poder, legalizaron los partidos a cambio de no tocar las estructuras del régimen, y en 1978 firmaron una Constitución que blindó ese acuerdo.
              La Junta Democrática se disolvió traicionada. Cincuenta años después, el diagnóstico de García-Trevijano sigue siendo el mismo: en España no ha habido democracia, ha habido partidocracia.
              Los partidos mandan, los ciudadanos votan cada cuatro años una lista que no eligieron, y el poder nunca rinde cuentas. La organización sigue viva hoy bajo la presidencia de{' '}
              <strong className="text-white">Antonio Alfaro Díaz</strong>, continuando esa misma lucha.
            </p>
          </div>

          <p>
            Este proyecto nace de ese legado, y de la convicción de que la tecnología puede hacer por fin lo que la política no quiso hacer entonces.
          </p>

          <div className="card border-white/10 bg-white/3 space-y-4">
            <p className="text-white/70">
              La Junta Democrática propone elegir mejor a los representantes — distritos uninominales, mandato revocable, separación de poderes. Es un paso enorme y necesario.
              Pero sigue siendo representación: alguien que habla en tu nombre, alguien que puede fallar, alguien que puede traicionar.
            </p>
            <p className="text-white font-semibold text-xl">Nosotros proponemos saltarse ese intermediario.</p>
            <p className="text-white/70">
              No elegir a alguien que vote por ti. Votar tú. Directamente. Sobre cada propuesta que afecte a tu vida. Y que ese voto quede grabado en una cadena criptográfica
              que ningún partido, ningún gobierno y ningún servidor puede alterar.
            </p>
            <p className="text-white/70">
              La tecnología que en 1974 no existía hoy está disponible para cualquier ciudadano con un móvil.
              García-Trevijano tenía razón en el diagnóstico. Nosotros queremos ir un paso más allá en la solución.
            </p>
          </div>

          <div className="card border-white/10 bg-white/3 space-y-4">
            <p className="text-white/70">
              Cuánta gente conoces que tenga tiempo de llamar a su diputado, ir a una reunión de partido o redactar una carta a su representante.
              La mayoría trabaja, cuida a su familia, llega cansada a casa. El sistema actual está diseñado para quienes tienen tiempo y contactos — y eso excluye a la mayoría.
            </p>
            <p className="text-white/70">
              Con esta plataforma, participar en democracia es tan sencillo como mirar el móvil cinco minutos. Lees una propuesta en el autobús, votas desde el sofá,
              propones una idea a medianoche cuando por fin tienes un momento. Sin citas, sin intermediarios, sin necesidad de pertenecer a ningún partido.
            </p>
            <p className="text-white font-semibold">
              La democracia no debería ser un privilegio de quien tiene agenda libre. Debería ser de todos, a cualquier hora, desde cualquier lugar.
            </p>
            <p className="text-white/70">
              Y en el futuro, imaginamos que representantes de comunidades, asociaciones o colectivos puedan tener presencia dentro de la plataforma — no para hablar en tu nombre,
              sino para escuchar directamente lo que la ciudadanía propone y vota. El puente entre la voluntad popular y quienes tienen responsabilidad de actuar.
            </p>
          </div>

          <p>
            Y esta es mi aportación, mi granito de arena. Desde las elecciones de mi tierra, Andalucía, del 17 de mayo de 2026, después de leer a mil personas en redes hablando de
            "quien no vota no tiene derecho a opinar" decidí empezar el proyecto. Esas palabras han llegado hasta mi propia familia — sin reprochar nada, pero con la idea de que quien
            no vota después no puede quejarse. Hay personas que sirven para dar la cara en redes y mover a otras personas, y contactaré con algunos perfiles que admiro por su valentía y coraje.
            Pero no todos servimos para eso. La tecnología pone al alcance de todos un abanico de posibilidades enorme, y me permite a mí, una persona normal,
            tener la capacidad de crear un proyecto como este.
          </p>
        </div>
      </section>

      {/* ─── ROADMAP ──────────────────────────────────────────────────────────── */}
      <section className="mb-24">
        <div className="flex items-center gap-3 mb-10">
          <span className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold text-sm shrink-0">III</span>
          <h2 className="text-3xl font-bold">Hoja de ruta</h2>
        </div>

        <p className="text-white/50 text-lg mb-12">
          El proyecto es honesto sobre lo que existe hoy y lo que viene mañana. Sin promesas vacías.
        </p>

        {/* Fase 1 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-chain-green" />
              <h3 className="text-xl font-bold">Fase 1 — Fundamentos</h3>
            </div>
            <span className="text-xs bg-chain-green/20 text-chain-green border border-chain-green/30 rounded-full px-2.5 py-1 font-medium">Completada</span>
          </div>
          <div className="card border-chain-green/20">
            <ul className="space-y-3">
              {FASE1.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                  <CheckCircle2 className="w-4 h-4 text-chain-green shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Fase 2 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-chain-blue" />
              <h3 className="text-xl font-bold">Fase 2 — Comunidad</h3>
            </div>
            <span className="text-xs bg-chain-blue/20 text-chain-blue border border-chain-blue/30 rounded-full px-2.5 py-1 font-medium">Próximos meses</span>
          </div>
          <div className="card border-chain-blue/20 space-y-5">
            {FASE2.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <ArrowRight className="w-4 h-4 text-chain-blue shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-white mb-0.5">{item.title}</p>
                  <p className="text-sm text-white/50">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fase 3 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-chain-purple" />
              <h3 className="text-xl font-bold">Fase 3 — Transparencia total</h3>
            </div>
            <span className="text-xs bg-chain-purple/20 text-chain-purple border border-chain-purple/30 rounded-full px-2.5 py-1 font-medium">Medio plazo</span>
          </div>
          <div className="card border-chain-purple/20 space-y-5">
            {FASE3.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <ArrowRight className="w-4 h-4 text-chain-purple shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-white mb-0.5">{item.title}</p>
                  <p className="text-sm text-white/50">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fase 4 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-brand-gold" />
              <h3 className="text-xl font-bold">Fase 4 — Visión</h3>
            </div>
            <span className="text-xs bg-brand-gold/20 text-brand-gold border border-brand-gold/30 rounded-full px-2.5 py-1 font-medium">Largo plazo</span>
          </div>
          <div className="card border-brand-gold/20 space-y-5">
            {FASE4.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <ArrowRight className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-white mb-0.5">{item.title}</p>
                  <p className="text-sm text-white/50">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRINCIPIOS ───────────────────────────────────────────────────────── */}
      <section className="mb-24">
        <div className="flex items-center gap-3 mb-10">
          <span className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/70 font-bold text-sm shrink-0">IV</span>
          <h2 className="text-3xl font-bold">Lo que nunca cambiará</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div className="card flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-chain-green/20 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-chain-green" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Sin partido, sin ideología</h3>
              <p className="text-white/50 text-sm">Esta plataforma no tiene color político. Discutimos ideas, no ideologías.</p>
            </div>
          </div>
          <div className="card flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-chain-blue/20 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5 text-chain-blue" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Transparencia total</h3>
              <p className="text-white/50 text-sm">Todo lo que ocurre en la plataforma es verificable por cualquier ciudadano en cualquier momento.</p>
            </div>
          </div>
          <div className="card flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/20 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-brand-gold" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Sin subvenciones del Estado</h3>
              <p className="text-white/50 text-sm">No aceptamos financiación pública ni de partidos. La independencia no se negocia.</p>
            </div>
          </div>
          <div className="card flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-chain-purple/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-chain-purple" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">La tecnología al servicio del ciudadano</h3>
              <p className="text-white/50 text-sm">La blockchain no es un fin, es el medio para garantizar que ningún poder pueda falsificar la voluntad popular.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA final ────────────────────────────────────────────────────────── */}
      <section className="card text-center border-chain-green/20 bg-chain-green/5 py-12">
        <ScrollText className="w-12 h-12 text-chain-green mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-3">Forma parte de esto</h2>
        <p className="text-white/50 mb-8 max-w-md mx-auto">
          No hace falta ser político, ni experto, ni famoso. Solo hace falta querer participar.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/auth/registro" className="btn-primary px-8 py-3">
            Unirme ahora
          </Link>
          <Link href="/propuestas" className="btn-secondary px-8 py-3">
            Ver propuestas
          </Link>
          <a
            href="https://github.com/xFranki/democracia-directa"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary px-8 py-3 flex items-center gap-2"
          >
            <Github className="w-4 h-4" />
            Código abierto
          </a>
        </div>
      </section>

    </div>
  );
}
