import { Editor } from "@monaco-editor/react";
import { useTheme } from "./theme-provider";
import { useCodeEditor } from "@/context/CodeEditorContext";
import { Card } from "./ui/card";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
  height?: string;
}

const CodeEditorComponent = ({
  value,
  onChange,
  language,
  height = "500px",
}: Props) => {

  const { theme } = useTheme();
  const codeEditorContext = useCodeEditor();

  // If there are no props => fallback to context
  const finalValue = value ?? codeEditorContext.code;
  const finalOnChange = onChange ?? codeEditorContext.setCode;
  const finalLanguage = language ?? codeEditorContext.language;

  const handleEditorChange = (val: string | undefined) => {
    finalOnChange(val || "");
  };

  return (
    <Card className="overflow-hidden">
      <Editor
        height={height}
        language={finalLanguage}
        value={finalValue}
        onChange={handleEditorChange}
        theme={theme === "dark" ? "vs-dark" : "light"}
        options={{
          minimap: { enabled: false },
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          fontFamily:
            "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
          fontLigatures: true,
          lineNumbers: "on",
          renderLineHighlight: "gutter",
          selectOnLineNumbers: true,
          smoothScrolling: true,
          cursorStyle: "line",
          cursorBlinking: "smooth",
          formatOnType: true,
          formatOnPaste: true,
          suggestOnTriggerCharacters: true,
        }}
      />
    </Card>
  );
}

export default CodeEditorComponent;