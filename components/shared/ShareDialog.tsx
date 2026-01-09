"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createShareLink,
  getShareLinksForSimplification,
  regenerateShareLink,
} from "@/lib/actions/share.actions";
import {
  Share2,
  Copy,
  Check,
  Link2,
  Mail,
  Twitter,
  Facebook,
  Loader2,
  Eye,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ExistingLink {
  code: string;
  url: string;
  views: number;
  expiresAt: Date | null;
  createdAt: Date;
}

interface ShareDialogProps {
  simplificationId: string;
  className?: string;
  trigger?: React.ReactNode;
  onShareCreated?: (url: string) => void;
  /** Optional title for the share dialog */
  title?: string;
  /** Controlled open state */
  open?: boolean;
  /** Callback for open state changes */
  onOpenChange?: (open: boolean) => void;
}

type ExpirationOption = "1" | "7" | "30" | "never";

/**
 * Dialog for generating and sharing simplification links.
 * Supports both controlled and uncontrolled modes.
 */
export function ShareDialog({
  simplificationId,
  className,
  trigger,
  onShareCreated,
  title,
  open,
  onOpenChange,
}: ShareDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [existingLinks, setExistingLinks] = useState<ExistingLink[]>([]);
  const [expiration, setExpiration] = useState<ExpirationOption>("7");
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Use controlled or uncontrolled state
  const isOpen = open ?? internalOpen;
  const setIsOpen = onOpenChange ?? setInternalOpen;

  // Fetch existing share links when dialog opens
  useEffect(() => {
    async function fetchExistingLinks() {
      if (!isOpen) return;
      setIsLoadingExisting(true);
      try {
        const result = await getShareLinksForSimplification(simplificationId);
        if (result.success && result.data) {
          setExistingLinks(result.data);
          // If there's an existing link, use it
          if (result.data.length > 0) {
            setShareUrl(result.data[0].url);
          }
        }
      } catch {
        // Ignore errors for existing links
      } finally {
        setIsLoadingExisting(false);
      }
    }
    fetchExistingLinks();
  }, [isOpen, simplificationId]);

  const generateShareLink = useCallback(async () => {
    setIsLoading(true);
    try {
      const expiresInDays =
        expiration === "never" ? undefined : parseInt(expiration);
      const result = await createShareLink(simplificationId, { expiresInDays });

      if (result.success && result.data) {
        setShareUrl(result.data.url);
        onShareCreated?.(result.data.url);
        toast.success("Share link created!");
      } else {
        toast.error(result.error ?? "Failed to create share link");
      }
    } catch {
      toast.error("Failed to create share link");
    } finally {
      setIsLoading(false);
    }
  }, [simplificationId, expiration, onShareCreated]);

  const copyToClipboard = useCallback(async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  }, [shareUrl]);

  const shareViaEmail = useCallback(() => {
    if (!shareUrl) return;
    const subject = encodeURIComponent("Check out this simplified text");
    const body = encodeURIComponent(
      `I simplified some text and wanted to share it with you:\n\n${shareUrl}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }, [shareUrl]);

  const shareViaTwitter = useCallback(() => {
    if (!shareUrl) return;
    const text = encodeURIComponent(
      "Check out this simplified text I created with ClarityWeb!"
    );
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(
        shareUrl
      )}`
    );
  }, [shareUrl]);

  const shareViaFacebook = useCallback(() => {
    if (!shareUrl) return;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`
    );
  }, [shareUrl]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when closing
      setShareUrl(null);
      setExistingLinks([]);
      setCopied(false);
    }
  };

  const handleRegenerateLink = useCallback(async () => {
    setIsRegenerating(true);
    try {
      const expiresInDays =
        expiration === "never" ? undefined : parseInt(expiration);
      const result = await regenerateShareLink(simplificationId, {
        expiresInDays,
      });

      if (result.success && result.data) {
        setShareUrl(result.data.url);
        // Update existing links list
        const newLink: ExistingLink = {
          code: result.data.code,
          url: result.data.url,
          views: 0,
          expiresAt: result.data.expiresAt,
          createdAt: new Date(),
        };
        setExistingLinks([newLink]);
        onShareCreated?.(result.data.url);
        toast.success("New share link created!");
      } else {
        toast.error(result.error ?? "Failed to regenerate link");
      }
    } catch {
      toast.error("Failed to regenerate link");
    } finally {
      setIsRegenerating(false);
    }
  }, [simplificationId, expiration, onShareCreated]);

  const currentLink = existingLinks[0];

  const defaultTrigger = (
    <Button variant="outline" size="sm" className={className}>
      <Share2 className="size-4 mr-2" />
      Share
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="size-5" />
            {title ?? "Share Simplification"}
          </DialogTitle>
          <DialogDescription>
            Generate a shareable link for this simplified text.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {/* Loading existing links */}
          {isLoadingExisting && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Expiration Selection */}
          {!shareUrl && !isLoadingExisting && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="expiration">Link expires in</Label>
              <Select
                value={expiration}
                onValueChange={(value) =>
                  setExpiration(value as ExpirationOption)
                }
              >
                <SelectTrigger id="expiration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Generate Button */}
          {!shareUrl && !isLoadingExisting && (
            <Button onClick={generateShareLink} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Link2 className="size-4 mr-2" />
                  Generate Link
                </>
              )}
            </Button>
          )}

          {/* Share URL Display */}
          {shareUrl && (
            <>
              {/* View Count and Expiration Info */}
              {currentLink && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="gap-1">
                    <Eye className="size-3" />
                    {currentLink.views} view{currentLink.views !== 1 ? "s" : ""}
                  </Badge>
                  {currentLink.expiresAt && (
                    <Badge variant="outline" className="gap-1">
                      <Calendar className="size-3" />
                      Expires{" "}
                      {new Date(currentLink.expiresAt).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={copyToClipboard}
                  aria-label="Copy link"
                >
                  {copied ? (
                    <Check className="size-4 text-green-500" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
              </div>

              {/* Share Options */}
              <div className="flex flex-col gap-2">
                <Label>Share via</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareViaEmail}
                    className="flex-1"
                  >
                    <Mail className="size-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareViaTwitter}
                    className="flex-1"
                  >
                    <Twitter className="size-4 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareViaFacebook}
                    className="flex-1"
                  >
                    <Facebook className="size-4 mr-2" />
                    Facebook
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          {shareUrl && (
            <Button
              variant="outline"
              onClick={handleRegenerateLink}
              disabled={isRegenerating}
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="size-4 mr-2" />
                  Regenerate Link
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ShareDialog;
