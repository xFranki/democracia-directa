'use client';

import { useState } from 'react';
import { Shield, UserPlus, FileText, ThumbsUp, Lock, CheckCircle2, ArrowRight, Eye, RefreshCw, Users, Vote, Search, ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: '¿Pueden los administradores ver por quién he votado?',
    a: 'No. Si votas de forma anónima, ni los administradores ni nadie puede relacionar tu identidad con tu voto. Solo tú tienes el recibo. Lo que sí es público es que existe ese voto en la cadena — pero sin saber de quién es.'
  },
  {
    q: '¿Puedo cambiar mi voto una vez que lo he emitido?',
    a: 'No, y eso es una garantía, no un fallo. En unas elecciones reales tampoco puedes cambiar el voto una vez depositado. Que el voto sea definitivo es precisamente lo que le da validez. Si pudiera cambiarse, alguien podría presionarte para que lo hicieras.'
  },
  {
    q: '¿Qué pasa si cierran la plataforma? ¿Desaparecen mis votos?',
    a: 'No. La cadena de bloques es un registro independiente. Aunque la plataforma dejara de funcionar, todos los datos registrados pueden exportarse y verificarse por cualquier persona con los archivos de la cadena. Nada desaparece.'
  },
  {
    q: '¿Necesito saber de tecnología para usarlo?',
    a: 'En absoluto. Si sabes usar el correo electrónico, sabes usar esta plataforma. La tecnología funciona en segundo plano — tú solo lees, opinas y votas. Lo complejo lo hace el sistema por ti.'
  },
  {
    q: '¿Una propuesta aprobada aquí tiene validez legal?',
    a: 'Hoy por hoy, no de forma directa. Esta plataforma es una demostración de lo que la democracia directa puede ser. El objetivo es mostrar que la tecnología está lista — la validez legal es el siguiente paso, que depende de la voluntad política y de que la sociedad exija este modelo.'
  },
  {
    q: '¿Quién decide qué propuestas pasan la revisión?',
    a: 'Los moderadores solo comprueban que la propuesta cumpla las normas básicas: que no contenga discurso de odio, que sea comprensible y que no duplique una propuesta ya existente. No valoran si están de acuerdo políticamente. El contenido lo juzga la ciudadanía con su voto.'
  },
  {
    q: '¿Cuántos votos necesita una propuesta para ser aprobada?',
    a: 'Cada propuesta tiene un umbral mínimo de participación — actualmente 100 votos — para que sea considerada válida. Superado ese mínimo, gana la opción más votada. Esto evita que propuestas muy minoritarias se aprueben con dos votos.'
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-medium text-sm sm:text-base">{q}</span>
        <ChevronDown className={`w-4 h-4 text-white/40 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <p className="text-white/50 text-sm pb-5 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

export default function ComoFuncionaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Cabecera */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 text-chain-green text-sm font-medium mb-4">
          <Shield className="w-4 h-4" />
          Guía completa
        </div>
        <h1 className="text-5xl font-bold mb-6">¿Cómo funciona?</h1>
        <p className="text-white/50 text-xl max-w-2xl mx-auto leading-relaxed">
          Todo lo que necesitas saber para participar. Simple, seguro y transparente.
        </p>
      </div>

      {/* ─── SECCIÓN 1: Registro ─────────────────────────────────────────────── */}
      <section className="mb-24">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-8 h-8 rounded-full bg-chain-green/20 border border-chain-green/30 flex items-center justify-center text-chain-green font-bold text-sm shrink-0">1</span>
          <h2 className="text-3xl font-bold">Crea tu identidad ciudadana</h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-8">
          <div className="card text-center">
            <UserPlus className="w-8 h-8 text-chain-green mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Regístrate</h3>
            <p className="text-white/50 text-sm">Crea una cuenta con tu email. Solo necesitas un nombre de usuario y una contraseña.</p>
          </div>
          <div className="card text-center">
            <CheckCircle2 className="w-8 h-8 text-chain-blue mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Verifica tu email</h3>
            <p className="text-white/50 text-sm">Recibirás un mensaje de confirmación. Esto garantiza que cada persona tiene una sola cuenta.</p>
          </div>
          <div className="card text-center">
            <Shield className="w-8 h-8 text-chain-purple mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Obtén tu identidad</h3>
            <p className="text-white/50 text-sm">El sistema te asigna automáticamente una dirección única, como un DNI digital irrepetible.</p>
          </div>
        </div>

        <div className="card border-white/10 bg-white/3">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-chain-green shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm mb-1">Tu privacidad, tus reglas</p>
              <p className="text-white/50 text-sm">Puedes elegir tener un perfil público con tu nombre, o mantener el anonimato. En ambos casos, tus votos y propuestas quedan registrados con tu identificador único — nadie puede suplantar tu identidad, pero tú decides cuánto quieres mostrar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECCIÓN 2: Propuestas ───────────────────────────────────────────── */}
      <section className="mb-24">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-8 h-8 rounded-full bg-chain-blue/20 border border-chain-blue/30 flex items-center justify-center text-chain-blue font-bold text-sm shrink-0">2</span>
          <h2 className="text-3xl font-bold">Presenta una propuesta</h2>
        </div>

        <p className="text-white/50 mb-8 text-lg">Cualquier ciudadano verificado puede presentar una propuesta sobre cualquier tema que afecte a la sociedad española.</p>

        {/* Timeline de estados */}
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10 hidden sm:block" />
          <div className="space-y-4">
            {[
              { color: 'text-white/50 border-white/20 bg-white/5', dot: 'bg-white/20', label: 'Borrador', desc: 'Redactas tu propuesta. Solo tú la puedes ver. Puedes editarla antes de enviarla.' },
              { color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10', dot: 'bg-yellow-400', label: 'En revisión', desc: 'Un moderador la revisa para comprobar que cumple las normas básicas de convivencia. No se juzga el contenido político.' },
              { color: 'text-chain-green border-chain-green/30 bg-chain-green/10', dot: 'bg-chain-green', label: 'Activa', desc: 'La propuesta es pública. Los ciudadanos pueden leerla, comentarla y debatirla.' },
              { color: 'text-chain-blue border-chain-blue/30 bg-chain-blue/10', dot: 'bg-chain-blue', label: 'En votación', desc: 'El moderador abre el período de votación. Los ciudadanos tienen un tiempo para votar SÍ, NO o ABSTENCIÓN.' },
              { color: 'text-chain-green border-chain-green/30 bg-chain-green/10', dot: 'bg-chain-green', label: 'Aprobada', desc: 'Ha superado el umbral mínimo de votos y la mayoría ha votado SÍ. Queda registrada permanentemente en la cadena.' },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-5 sm:pl-12 relative">
                <div className={`w-3 h-3 rounded-full shrink-0 mt-1.5 hidden sm:block absolute left-3.5 ${step.dot}`} />
                <div className="flex items-start gap-4 flex-1">
                  <span className={`text-xs border rounded-full px-2.5 py-1 font-medium shrink-0 mt-0.5 ${step.color}`}>
                    {step.label}
                  </span>
                  <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECCIÓN 3: Votación ─────────────────────────────────────────────── */}
      <section className="mb-24">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-8 h-8 rounded-full bg-chain-purple/20 border border-chain-purple/30 flex items-center justify-center text-chain-purple font-bold text-sm shrink-0">3</span>
          <h2 className="text-3xl font-bold">Vota</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-chain-green/20 flex items-center justify-center shrink-0">
                <ThumbsUp className="w-4 h-4 text-chain-green" />
              </div>
              <div>
                <p className="font-medium text-sm">Un voto por persona</p>
                <p className="text-white/50 text-sm mt-0.5">Cada ciudadano puede votar una sola vez por propuesta. No hay forma de votar dos veces.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-chain-purple/20 flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4 text-chain-purple" />
              </div>
              <div>
                <p className="font-medium text-sm">Voto anónimo opcional</p>
                <p className="text-white/50 text-sm mt-0.5">Puedes votar públicamente o de forma anónima. Tú decides si tu nombre aparece junto a tu voto.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-chain-blue/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-chain-blue" />
              </div>
              <div>
                <p className="font-medium text-sm">Tres opciones</p>
                <p className="text-white/50 text-sm mt-0.5">Puedes votar <span className="text-chain-green font-medium">SÍ</span>, <span className="text-red-400 font-medium">NO</span> o <span className="text-white/50 font-medium">ABSTENCIÓN</span>. Ningún voto se pierde ni se ignora.</p>
              </div>
            </div>
          </div>

          <div className="card border-chain-blue/20 bg-chain-blue/5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-chain-blue" />
              <p className="font-semibold text-sm">Tu recibo de voto</p>
            </div>
            <p className="text-white/50 text-sm mb-4">Al votar recibes un código único, como un número de seguimiento. Con ese código puedes comprobar en cualquier momento que tu voto está registrado y no ha sido alterado.</p>
            <div className="font-mono text-xs text-chain-blue/70 bg-black/20 rounded-lg px-3 py-2 break-all">
              14b53129850709995a7effe3b582ea45...
            </div>
            <p className="text-white/30 text-xs mt-2">Ejemplo de recibo de voto</p>
          </div>
        </div>
      </section>

      {/* ─── SECCIÓN 4: Blockchain ───────────────────────────────────────────── */}
      <section className="mb-24">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold text-sm shrink-0">4</span>
          <h2 className="text-3xl font-bold">Por qué nadie puede hacer trampas</h2>
        </div>

        <p className="text-white/50 text-lg mb-8">Usamos una tecnología llamada <span className="text-white font-medium">cadena de bloques</span> (blockchain). Aquí va la explicación sin tecnicismos:</p>

        <div className="space-y-5 mb-8">
          <div className="card flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/20 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-brand-gold" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Cada acción genera una huella digital</h3>
              <p className="text-white/50 text-sm">Cuando se registra una propuesta o un voto, el sistema genera un código único que representa exactamente ese momento y ese contenido. Si alguien cambiara una sola letra, el código sería completamente diferente.</p>
            </div>
          </div>

          <div className="card flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-chain-blue/20 flex items-center justify-center shrink-0">
              <ArrowRight className="w-5 h-5 text-chain-blue" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Los bloques se encadenan entre sí</h3>
              <p className="text-white/50 text-sm">Imagina una cadena de eslabones donde cada eslabón lleva grabado el eslabón anterior. Si alguien intenta modificar uno, todos los que vienen después dejan de encajar. La manipulación es matemáticamente detectable.</p>
            </div>
          </div>

          <div className="card flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-chain-green/20 flex items-center justify-center shrink-0">
              <Search className="w-5 h-5 text-chain-green" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Todo es verificable por cualquiera</h3>
              <p className="text-white/50 text-sm">El <span className="text-white">Explorador de bloques</span> es público. Cualquier ciudadano puede ver cada propuesta y cada voto registrado, y comprobar que la cadena está intacta. No hay que fiarse de nadie: los datos hablan por sí solos.</p>
            </div>
          </div>

          <div className="card flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-chain-purple/20 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-chain-purple" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Lo que entra no puede salir</h3>
              <p className="text-white/50 text-sm">Una vez que un voto queda registrado, es permanente. No hay botón de "deshacer". Ni el administrador de la plataforma puede borrarlo o cambiarlo. Es como grabar en piedra, pero mejor.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECCIÓN 5: Los roles ────────────────────────────────────────────── */}
      <section className="mb-24">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/70 font-bold text-sm shrink-0">5</span>
          <h2 className="text-3xl font-bold">¿Quién hace qué?</h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-white/50" />
              <h3 className="font-semibold">Ciudadano</h3>
            </div>
            <ul className="space-y-2 text-sm text-white/50">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-chain-green shrink-0" /> Presentar propuestas</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-chain-green shrink-0" /> Votar propuestas activas</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-chain-green shrink-0" /> Comentar y debatir</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-chain-green shrink-0" /> Verificar cualquier voto</li>
            </ul>
          </div>

          <div className="card border-chain-blue/20">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-chain-blue" />
              <h3 className="font-semibold text-chain-blue">Moderador</h3>
            </div>
            <ul className="space-y-2 text-sm text-white/50">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-chain-blue shrink-0" /> Todo lo del ciudadano</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-chain-blue shrink-0" /> Revisar propuestas</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-chain-blue shrink-0" /> Abrir y cerrar votaciones</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-chain-blue shrink-0" /> Moderar comentarios</li>
            </ul>
          </div>

          <div className="card border-brand-gold/20">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-brand-gold" />
              <h3 className="font-semibold text-brand-gold">Administrador</h3>
            </div>
            <ul className="space-y-2 text-sm text-white/50">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" /> Todo lo del moderador</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" /> Gestionar usuarios</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" /> Asignar roles</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" /> Suspender cuentas</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─── SECCIÓN 6: FAQ ─────────────────────────────────────────────────── */}
      <section className="mb-24">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/70 font-bold text-sm shrink-0">6</span>
          <h2 className="text-3xl font-bold">Preguntas frecuentes</h2>
        </div>

        <div className="card divide-y divide-white/10 p-0 overflow-hidden">
          <div className="px-6">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

        <p className="text-white/30 text-sm text-center mt-6">
          ¿Tienes otra pregunta? Próximamente la comunidad podrá enviar sus dudas y quedarán publicadas aquí.
        </p>
      </section>

      {/* ─── CTA final ───────────────────────────────────────────────────────── */}
      <section className="card text-center border-chain-green/20 bg-chain-green/5 py-12">
        <Vote className="w-12 h-12 text-chain-green mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-3">¿Listo para participar?</h2>
        <p className="text-white/50 mb-8 max-w-md mx-auto">
          Tu voz cuenta. Cada propuesta, cada voto, queda registrado para siempre. Empieza hoy.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a href="/auth/registro" className="btn-primary px-8 py-3">
            Crear mi cuenta
          </a>
          <a href="/propuestas" className="btn-secondary px-8 py-3">
            Ver propuestas
          </a>
        </div>
      </section>

    </div>
  );
}
