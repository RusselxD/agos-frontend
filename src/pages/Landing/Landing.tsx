import { Link } from "react-router-dom";
import { Activity, Waves, Bell, Zap, Shield, ChevronRight, ChevronDown, Server, Smartphone, Cpu, Cloud, Database } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#0A0F1C] relative text-slate-300 font-sans selection:bg-blue-500/30">
      {/* High-Tech Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25"></div>
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-500/10 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full filter blur-[120px] animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#0A0F1C]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 relative z-10">
              <div className="relative flex items-center justify-center w-10 h-10 bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                 <img src="/agos.svg" alt="AGOS Logo" className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">AGOS</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden sm:block">Features</a>
              <a href="#architecture" className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden sm:block">Architecture</a>
              <Link to="/public" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Public Dashboard</Link>
              <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
              {isAuthenticated ? (
                <Link to="/admin" className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] active:scale-95 border border-blue-500/50">
                  Admin Dashboard
                </Link>
              ) : (
                <Link to="/auth/login" className="text-sm font-semibold bg-white/5 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg hover:bg-white/10 transition-all border border-white/10 hover:border-white/20 active:scale-95">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 md:pt-32 md:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-500/10 text-blue-400 text-xs sm:text-sm font-semibold mb-6 sm:mb-8 border border-blue-500/20 backdrop-blur-md">
              <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-blue-500"></span>
              </span>
              SYSTEM LIVE & MONITORING
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 sm:mb-8 leading-[1.1]">
              Multi-Modal Drainage<br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 drop-shadow-sm">
                {" "}Waterway Monitoring System.
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl lg:text-2xl text-slate-400 mb-8 sm:mb-12 leading-relaxed font-light">
              AGOS automatically detects blockages and water level conditions through computer vision and IoT sensor integration, fusing collected data with real-time weather information to generate risk-based alert tiers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/public" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] border border-blue-500 hover:-translate-y-1">
                <Activity className="w-5 h-5" />
                Open Dashboard
              </Link>
              <a href="#architecture" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 text-white border border-white/10 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1 backdrop-blur-sm">
                <Server className="w-5 h-5" />
                View Architecture
              </a>
            </div>
          </div>
        </div>

        {/* System Architecture Diagram Section */}
        <div id="architecture" className="py-16 sm:py-24 lg:py-32 relative z-10 border-t border-white/5 bg-[#0A0F1C]/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-3 sm:mb-4">The AGOS Pipeline</h2>
              <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">A seamless flow from edge hardware to end-user mobile devices, ensuring real-time reliability when seconds matter.</p>
            </div>

            {/* Diagram */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
              {/* Edge Layer */}
              <div className="flex-1 bg-[#111827]/60 border border-white/5 p-6 sm:p-8 rounded-3xl w-full text-center hover:border-blue-500/30 transition-all duration-300 group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Cpu className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">1. Edge Hardware</h3>
                <p className="text-slate-400 text-xs sm:text-sm mb-4">IoT devices deployed at waterways.</p>
                <div className="flex flex-col gap-3 text-left">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                    <Waves className="w-5 h-5 text-blue-400 shrink-0" />
                    <span className="text-slate-300 text-xs sm:text-sm font-medium">Ultrasonic Distance Sensor</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-400 shrink-0" />
                    <span className="text-slate-300 text-xs sm:text-sm font-medium">Raspberry Pi & IR-Cut Camera</span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex text-slate-700">
                <ChevronRight className="w-10 h-10" />
              </div>
              <div className="flex lg:hidden text-slate-700 my-[-10px] sm:my-0">
                <ChevronDown className="w-8 h-8" />
              </div>

              {/* Backend Layer */}
              <div className="flex-1 bg-[#111827]/60 border border-white/5 p-6 sm:p-8 rounded-3xl w-full text-center hover:border-cyan-500/30 transition-all duration-300 relative group">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)] whitespace-nowrap">FastAPI & PostgreSQL</div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 border border-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Cloud className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">2. Cloud Processing</h3>
                <p className="text-slate-400 text-xs sm:text-sm mb-4">Real-time fusion & AI analysis.</p>
                <div className="flex flex-col gap-3 text-left">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                    <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span className="text-slate-300 text-xs sm:text-sm font-medium">ML Blockage Inference</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                    <Database className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span className="text-slate-300 text-xs sm:text-sm font-medium">WebSocket & Fusion Engine</span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex text-slate-700">
                <ChevronRight className="w-10 h-10" />
              </div>
              <div className="flex lg:hidden text-slate-700 my-[-10px] sm:my-0">
                <ChevronDown className="w-8 h-8" />
              </div>

              {/* Client Layer */}
              <div className="flex-1 bg-[#111827]/60 border border-white/5 p-6 sm:p-8 rounded-3xl w-full text-center hover:border-emerald-500/30 transition-all duration-300 group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">3. Actionable UX</h3>
                <p className="text-slate-400 text-xs sm:text-sm mb-4">Interfaces for LGU admins, responders, & residents.</p>
                <div className="flex flex-col gap-3 text-left">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                    <Activity className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-slate-300 text-xs sm:text-sm font-medium">Web Dashboard & Public Page</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                    <Bell className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-slate-300 text-xs sm:text-sm font-medium">Mobile App for Field Personnel</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Bento Grid */}
        <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative z-10 border-t border-white/5">
          <div className="mb-12 sm:mb-16 md:text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-slate-300 text-xs font-bold mb-4 border border-white/10 uppercase tracking-widest">
              Core Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">Engineered for Resilience.</h2>
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl md:mx-auto">A comprehensive system empowering LGU administrators, mobilizing field personnel, and informing barangay residents with real-time waterway infrastructure status.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Feature 1 */}
            <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-[#111827] to-[#0A0F1C] border border-white/5 rounded-3xl p-6 sm:p-8 lg:p-10 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(37,99,235,0.1)] transition-all duration-500 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 hidden sm:block">
                <Bell className="w-64 h-64 text-blue-400" />
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 shadow-[inset_0_0_15px_rgba(37,99,235,0.2)]">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Field Personnel Notifications</h3>
              <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-md leading-relaxed">
                Notifies field personnel through a dedicated mobile application with instant alerts via VAPID Web Push and an Android-powered SMS Gateway for critical risk tiers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="col-span-1 bg-gradient-to-br from-[#111827] to-[#0A0F1C] border border-white/5 rounded-3xl p-6 sm:p-8 lg:p-10 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all duration-500 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 shadow-[inset_0_0_15px_rgba(6,182,212,0.2)]">
                <Waves className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Ultrasonic Telemetry</h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                High-frequency, precision distance sensor tracking provides reliable water level data, broadcast in real-time to the dashboard via a WebSocket connection.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="col-span-1 bg-gradient-to-br from-[#111827] to-[#0A0F1C] border border-white/5 rounded-3xl p-6 sm:p-8 lg:p-10 hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-all duration-500 group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 shadow-[inset_0_0_15px_rgba(245,158,11,0.2)]">
                <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Vision AI Fusion</h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Advanced machine learning models process live RTSP camera feeds to identify trash and debris. Captured frames are uploaded to Cloudinary for logging.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-indigo-900/40 to-[#0A0F1C] border border-indigo-500/20 rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-500">
               <div className="absolute -right-10 -bottom-10 opacity-10 transform group-hover:scale-110 transition-transform duration-700 hidden sm:block">
                 <Activity className="w-64 h-64 text-indigo-400" />
               </div>
               <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] sm:text-xs font-bold tracking-wide mb-4 sm:mb-6 border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                  POWERED BY GROQ
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 sm:mb-4 drop-shadow-md">Predictive Analysis Engine</h3>
                <p className="text-slate-300 max-w-lg mb-6 sm:mb-8 text-sm sm:text-base md:text-lg leading-relaxed">
                  AGOS fuses live sensor data, computer vision results, and OpenMeteo weather forecasts to calculate risk scores. Daily summaries are analyzed by the Groq LLM via SSE streaming to provide predictive text analysis.
                </p>
                <Link to="/public" className="inline-flex items-center text-sm sm:text-base font-bold text-indigo-300 hover:text-white transition-colors group/link">
                  Explore Live Data <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 transform group-hover/link:translate-x-1 transition-transform" />
                </Link>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0A0F1C] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 bg-white/5 rounded-lg border border-white/10">
              <img src="/agos.svg" alt="AGOS Logo" className="w-5 h-5 object-contain" />
            </div>
            <span className="font-bold text-white text-lg">AGOS</span>
          </div>
          <p className="text-sm font-medium text-slate-500">
            © {new Date().getFullYear()} AGOS
          </p>
        </div>
      </footer>
    </div>
  );
}