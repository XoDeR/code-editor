import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css'
import CodeEditor from "./pages/CodeEditor";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { SignedIn } from "@clerk/clerk-react";
import { Navbar } from "./components/navbar";
import { CodeEditorProvider } from "./context/CodeEditorContext";

const App = () => {
  return (
    <>
      <Toaster
        toastOptions={{
          unstyled: true,
          classNames: {
            toast: "rounded-md p-4 shadow-lg border",
            error: "bg-red-500 text-white",
            success: "bg-green-500 text-white",
            warning: "bg-yellow-500 text-black",
            info: "bg-blue-500 text-white",
            title: "font-bold",
            description: "text-sm opacity-80"
          }
        }}
      />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navbar />
          <CodeEditorProvider>
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
          </CodeEditorProvider>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
