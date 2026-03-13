'use client';
import StationList from '@/components/organisms/station-list';
import MapWrapper from '@/components/organisms/map-wrapper';
import { eventBus } from '@/lib/event-bus';

export default function Home() {
  return (
    <>
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-primary/20 bg-background-light dark:bg-background-dark flex items-center justify-between px-6 z-20 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <span className="material-symbols-outlined text-background-dark font-bold">local_gas_station</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">GasoFind</h1>
          </div>
          <div className="hidden md:flex items-center gap-1 bg-slate-200/50 dark:bg-primary/10 rounded-lg px-3 py-1.5 border border-slate-300 dark:border-primary/20">
            <span className="material-symbols-outlined text-slate-500 dark:text-primary/70 text-sm">location_on</span>
            <span className="text-sm font-medium">Medellín, Colombia</span>
          </div>
        </div>
        <div className="flex-1 max-w-md px-8">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
            <input className="w-full bg-slate-100 dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400" placeholder="Search for cities or stations..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => eventBus.emit('RESET_VIEW')}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-background-dark px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-sm">my_location</span>
            <span>My Location</span>
          </button>
          <div className="h-8 w-px bg-slate-200 dark:bg-primary/20 mx-1"></div>
          <button className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-primary/30">
            <img className="h-full w-full object-cover" alt="User profile avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs3OvCSxeSoMSWSJ4p5XmyKPXupB5p8FdKOVMN62i4jK9_XxhkcnmqmNLrvqCjbRwDiYnw2W9hkdI2Sw6CnHFjy82bRB26sn7nbJh3KvxGWYX52M4akdbZFYToZJuxRMV64k7narOc0nN9ByN41ibwcFtlpN7smIBzQcyTaE7vm1vd2AtXwlOPuScU0q6Yb8yQqS4OmUnruO_Uby6OdXZU0jo_zUlEMAq7bxLH14rC_UrXBdC2wui8hyf932Enx9RaPCrVRv5PJeg" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar: Nearby Stations */}
        <aside className="w-full md:w-96 border-r border-primary/20 bg-white dark:bg-background-dark flex flex-col z-10 shadow-xl shrink-0 h-[50vh] md:h-full">
          <StationList />
        </aside>

        {/* Main Content Area: Map */}
        <section className="flex-1 relative bg-slate-200 dark:bg-slate-900 overflow-hidden h-[50vh] md:h-full">
          <MapWrapper />
        </section>
      </main>

      {/* Bottom Mobile Nav (Visible only on mobile/tablet) */}
      <nav className="md:hidden h-16 border-t border-primary/20 bg-background-light dark:bg-background-dark flex items-center justify-around z-20 shrink-0">
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined">explore</span>
          <span className="text-[10px] font-bold">Map</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-500">
          <span className="material-symbols-outlined">format_list_bulleted</span>
          <span className="text-[10px] font-bold">List</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-500">
          <span className="material-symbols-outlined">favorite</span>
          <span className="text-[10px] font-bold">Favorites</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-500">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </nav>
    </>
  );
}
