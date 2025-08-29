import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css'
import CodeEditor from "./pages/CodeEditor";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { SignedIn } from "@clerk/clerk-react";

const App = () => {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<CodeEditor />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <SignedIn>
                <Dashboard />
              </SignedIn>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
