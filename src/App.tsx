import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { isLoggedIn } from "@/lib/auth";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Leads from "@/pages/Leads";
import ChatMessages from "@/pages/ChatMessages";
import Settings from "@/pages/Settings";
import Content from "@/pages/Content";
import Sidebar from "@/components/Sidebar";

function AdminLayout({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/leads" component={Leads} />
          <Route path="/chat" component={ChatMessages} />
          <Route path="/content" component={Content} />
          <Route path="/settings" component={Settings} />
          <Route>
            <div className="p-8 text-center text-gray-400">Page not found</div>
          </Route>
        </Switch>
      </main>
    </div>
  );
}

function AppInner() {
  const [authed, setAuthed] = useState(isLoggedIn());

  function handleLogin() { setAuthed(true); }
  function handleLogout() { setAuthed(false); }

  if (!authed) return <Login onLogin={handleLogin} />;
  return <AdminLayout onLogout={handleLogout} />;
}

export default function App() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <WouterRouter base={base}>
      <AppInner />
    </WouterRouter>
  );
}
