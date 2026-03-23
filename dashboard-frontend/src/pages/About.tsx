import { ShieldCheck, Globe, Cpu, ExternalLink, Mail } from "lucide-react";

// Logo fiel à imagem enviada: Fundo escuro, cor #6366f1 (Indigo/Blue) e detalhes precisos
const SolveCodeLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Brackets (Parênteses retos) com cantos levemente arredondados como na foto */}
    <path
      d="M38 30H28V70H38"
      stroke="#6366f1"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M62 30H72V70H62"
      stroke="#6366f1"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Linha vertical central */}
    <path
      d="M50 35V65"
      stroke="#6366f1"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Os 3 círculos (nós) da conexão central */}
    <circle cx="50" cy="35" r="3.5" fill="#6366f1" />
    <circle cx="50" cy="50" r="3.5" fill="#6366f1" />
    <circle cx="50" cy="65" r="3.5" fill="#6366f1" />
  </svg>
);

export const About = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in zoom-in duration-700">
      {/* Card Principal */}
      <div className="">
        {/* Decorativo de Fundo conforme a imagem */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10" />

        <div className="p-12 text-center">
          {/* Logo da SolveCode - Fundo escuro profundo e ícone azul vibrante */}
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-[#020617] border border-white/5 mb-8 shadow-2xl group hover:scale-105 transition-transform duration-500">
            <SolveCodeLogo className="w-16 h-16" />
          </div>
          <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">
            Our official Product ツ
          </h2>
          <h1 className="text-purple-500 text-[15px] font-black uppercase tracking-widest leading-none">
            obsidian{" "}
            <span className="text-white font-bold text-[15px] tracking-tight">
              analytics
            </span>
          </h1>{" "}
          <br />
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto mb-12">
            This software is the exclusive intellectual property of{" "}
            <strong>SolveCode. </strong>
            Developed with a focus on high performance, data security, and
            timely analysis.
          </p>
          {/* Grid de Especificações */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="p-6 bg-white/2 border border-white/5 rounded-2xl">
              <Cpu className="text-indigo-500 mx-auto mb-3" size={24} />
              <h4 className="text-white font-bold text-sm">Version</h4>
              <p className="text-gray-500 text-xs mt-1">v1.0.0</p>
            </div>
            <div className="p-6 bg-white/2 border border-white/5 rounded-2xl">
              <ShieldCheck className="text-green-500 mx-auto mb-3" size={24} />
              <h4 className="text-white font-bold text-sm">Security</h4>
              <p className="text-gray-500 text-xs mt-1">AES-256 Encrypted</p>
            </div>
            <div className="p-6 bg-white/2 border border-white/5 rounded-2xl">
              <Globe className="text-blue-500 mx-auto mb-3" size={24} />
              <h4 className="text-white font-bold text-sm">Region</h4>
              <p className="text-gray-500 text-xs mt-1">WorldWide</p>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5">
            <p className="text-xs text-gray-600 mb-6">
              © {new Date().getFullYear()} SolveCode Web Solutions. All rights
              reserved.
            </p>

            <div className="flex justify-center gap-4">
              <a
                href="https://solvecode-b6u1.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1C1C26] hover:bg-[#252533] border border-white/5 rounded-xl text-xs font-bold text-white transition-all"
              >
                Website <ExternalLink size={14} />
              </a>
              <a
                href="mailto:solvecodeorg@gmail.com"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1C1C26] hover:bg-[#252533] border border-white/5 rounded-xl text-xs font-bold text-white transition-all"
              >
                Support <Mail size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footerzinho externo */}
      <p className="text-center mt-8 text-gray-600 text-[10px] uppercase tracking-widest font-bold">
        Built by developers for developers
      </p>
    </div>
  );
};

export default About;
