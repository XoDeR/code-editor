import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type CodeEditorContextType = {
  code: string;
  setCode: (val: string) => void;
  language: string;
  setLanguage: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  isSaving: boolean;
  setIsSaving: (val: boolean) => void;
  isSharing: boolean;
  setIsSharing: (val: boolean) => void;
  showSaveDialog: boolean;
  setShowSaveDialog: (val: boolean) => void;
  resetCode: () => void;
};

const CodeEditorContext = createContext<CodeEditorContextType | undefined>(undefined);

const DEFAULT_CODE: Record<string, string> = {
  javascript: `console.log("Hi, edit me!");`,
  python: `print("Hi, edit me!")`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hi, edit me!");
    }
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hi, edit me!" << endl;
    return 0;
}`,
  c: `#include <stdio.h>

int main() {
    printf("Hi, edit me!\\n");
    return 0;
}`,
  typescript: `console.log("Hi, edit me!" as string);`,
  go: `package main
import "fmt"

func main() {
    fmt.Println("Hi, edit me!")
}`,
  rust: `fn main() {
    println!("Hi, edit me!");
}`,
  php: `<?php
echo "Hi, edit me!";
?>`,
};

export const CodeEditorProvider = ({ children }: { children: ReactNode }) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Show default code when language changes or on init
  useEffect(() => {
    setCode(DEFAULT_CODE[language] || DEFAULT_CODE.javascript);
  }, [language]);
  const resetCode = () => {
    setCode(DEFAULT_CODE[language] || "");
  };

  return (
    <CodeEditorContext.Provider
      value={{
        code, setCode,
        language, setLanguage,
        title, setTitle,
        isSaving, setIsSaving,
        isSharing, setIsSharing,
        showSaveDialog, setShowSaveDialog,
        resetCode,
      }}
    >
      {children}
    </CodeEditorContext.Provider>
  );
};

export const useCodeEditor = () => {
  const ctx = useContext(CodeEditorContext);
  if (!ctx) {
    throw new Error("useCodeEditor must be used inside CodeEditorContext");
  }
  return ctx;
};
