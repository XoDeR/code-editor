import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { getUserCodes, deleteCode, shareCode, updateCode, type Code } from "@/lib/api";
import { toast } from "sonner";

export function useCodeActions() {
  const { getToken } = useAuth();
  const [codes, setCodes] = useState<Code[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadCodes();
  }, []);

  const loadCodes = async () => {
    try {
      const token = await getToken();
      if (token) {
        const userCodes = await getUserCodes(token);
        setCodes(userCodes);
      }
    } catch {
      toast.error(
        "Error",
        { description: "Failed to load your codes" },
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(`delete-${id}`);
    try {
      const token = await getToken();
      if (token) {
        await deleteCode(id, token);
        setCodes(codes.filter((c) => c.id !== id));
        toast.success("Success", { description: "Code deleted successfully" });
      }
    } catch {
      toast.error("Error", { description: "Failed to delete code" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleShare = async (id: string) => {
    setActionLoading(`share-${id}`);
    try {
      const token = await getToken();
      if (token) {
        const result = await shareCode(id, token);
        const shareUrl = `${window.location.origin}/?shared=${result.sharedId}`;
        await navigator.clipboard.writeText(shareUrl);

        toast.success("Share link copied", { description: "Copied to clipboard" });
        setCodes(codes.map((c) => (c.id === id ? { ...c, sharedId: result.sharedId, isPublic: true } : c)));
      }
    } catch {
      toast.error("Error", { description: "Failed to share code" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdate = async (id: string, updated: Partial<Code>) => {
    setActionLoading(`update-${id}`);
    try {
      const token = await getToken();
      if (token) {
        const res = await updateCode(id, updated, token);

        if (res.count > 0) {
          setCodes((prev) =>
            prev.map((c) =>
              c.id === id
                ? { ...c, ...updated, updatedAt: new Date().toISOString() }
                : c
            )
          );
          toast.success(
            "Success",
            {
              description: "Code updated successfully"
            });
        } else {
          toast.info(
            "No changes",
            {
              description: "No code was updated on the server"
            });
        }
      }
    } catch {
      toast.error(
        "Error",
        {
          description: "Failed to update code"
        });
    } finally {
      setActionLoading(null);
    }
  };

  return {
    codes,
    loading,
    actionLoading,
    setCodes,
    loadCodes,
    handleDelete,
    handleShare,
    handleUpdate,
  };
}
