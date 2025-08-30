import { useAuth, useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import CodeEditorComponent from "@/components/code-editor-component";
import LanguageSelector from "@/components/language-selector";
import {
  saveCode,
  shareCode,
  getSharedCode,
} from "@/lib/api";
import {
  Save,
  Download,
  Loader2,
  RotateCcw,
  Share2,
  MoreVertical
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCodeEditor } from "@/context/CodeEditorContext";
import CodeEditorSkeleton from "@/components/loaders/CodeEditorSkeleton";
import { toast } from "sonner";

const CodeEditor = () => {
  const { isSignedIn, getToken } = useAuth();
  const [searchParams] = useSearchParams();
  const clerk = useClerk();

  const {
    code,
    setCode,
    language,
    setLanguage,
    title,
    setTitle,
    isSaving,
    setIsSaving,
    isSharing,
    setIsSharing,
    resetCode
  } = useCodeEditor();

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [tempTitle, setTempTitle] = useState("");

  const sharedId = searchParams.get("shared");

  useEffect(() => {
    if (sharedId) {
      loadSharedCode(sharedId);
    }
  }, [sharedId]);

  const loadSharedCode = async (sharedId: string) => {
    try {
      const sharedCode = await getSharedCode(sharedId);
      setCode(sharedCode.code);
      setLanguage(sharedCode.language);
      setTitle(sharedCode.title);
      toast.success(
        "Shared code loaded",
        { description: `Loaded: ${sharedCode.title}` }
      );
    } catch {
      toast.error(
        "Error",
        { description: "Failed to load shared code" },
      );
    }
  };

  const handleSave = async () => {
    if (!isSignedIn) {
      toast.error(
        "Authentication required",
        { description: "To use this you need to signup" },
      );
      return false;
    }

    if (!title.trim()) {
      toast.error(
        "Error",
        { description: "Please enter a title for your code" },
      );
      return false;
    }

    setIsSaving(true);
    try {
      const token = await getToken();
      if (token) {
        await saveCode({ title, code, language }, token);
        toast.success(
          "Success",
          { description: "Code saved successfully!" }
        );
        return true;
      }
    } catch {
      toast.error(
        "Error",
        { description: "Failed to save code" },
      );
      return false;
    } finally {
      setIsSaving(false);
    }
    return false;
  };

  const handleShare = async () => {
    if (!isSignedIn) {
      toast.error(
        "Authentication required",
        { description: "To use this you need to signup" },
      );
      return;
    }
    setIsSharing(true);
    try {
      const token = await getToken();
      if (token) {
        const codeTitle = title.trim() || "Untitled";
        const savedCode = await saveCode(
          { title: codeTitle, code, language },
          token
        );
        const shareResult = await shareCode(savedCode.id, token);
        const shareUrl = `${window.location.origin}/?shared=${shareResult.sharedId}`;

        await navigator.clipboard.writeText(shareUrl);
        toast.success(
          "Code Shared Successfully",
          { description: "Share link copied to clipboard!" }
        );
      }
    } catch {
      toast.error(
        "Error",
        { description: "Failed to share code. Please try again." },
      );
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownload = () => {
    if (!isSignedIn) {
      toast.error(
        "Authentication required",
        { description: "To use this you need to signup" },
      );
      return;
    }

    const date = new Date().toISOString().split("T")[0];
    const fileName = `${title || date + "-code"}.${language}`;

    const blob = new Blob([code], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast.info(
      "Download Started",
      { description: "Your code file is being downloaded." }
    );
  };

  return (
    <div className="space-y-4">
      {!clerk.loaded ? (
        <CodeEditorSkeleton />
      ) : (
        <div className="mx-auto px-4 py-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6 lg:col-span-3">
              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex sm:items-center justify-between sm:gap-4">
                    <div className="flex items-center gap-3">
                      <LanguageSelector
                        value={language}
                        onChange={setLanguage}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="hidden sm:flex gap-2">
                        <Button
                          onClick={() => setShowSaveDialog(true)}
                          size="sm"
                          variant="outline"
                        >
                          <Save className="h-4 w-4 mr-2" /> Save
                        </Button>
                        <Button
                          onClick={handleShare}
                          disabled={isSharing}
                          size="sm"
                          variant="outline"
                        >
                          {isSharing ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Share2 className="h-4 w-4 mr-2" />
                          )}
                          Share
                        </Button>
                        <Button
                          onClick={handleDownload}
                          size="sm"
                          variant="outline"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button onClick={resetCode} size="sm" variant="outline">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                      {/* Mobile hamburger menu */}
                      <div className="sm:hidden flex">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setShowSaveDialog(true)}
                            >
                              <Save className="h-4 w-4 mr-2" /> Save
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleShare}>
                              <Share2 className="h-4 w-4 mr-2" /> Share
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDownload}>
                              <Download className="h-4 w-4 mr-2" /> Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={resetCode}>
                              <RotateCcw className="h-4 w-4 mr-2" /> Reset
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              <div className="relative">
                <CodeEditorComponent
                  value={code}
                  onChange={setCode}
                  language={language}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Save dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter a title for your code</DialogTitle>
            <DialogDescription>
              With the title you could identify your saved code snippet
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Insertion sort in java"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
          />
          <DialogFooter>
            <Button
              onClick={async () => {
                if (!tempTitle.trim()) {
                  toast.error(
                    "Title Missing",
                    { description: "Please enter a title before saving." },
                  );
                  return;
                }
                setTitle(tempTitle);

                const success = await handleSave();
                if (success) {
                  setShowSaveDialog(false);
                  setTempTitle("");
                }
              }}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CodeEditor;