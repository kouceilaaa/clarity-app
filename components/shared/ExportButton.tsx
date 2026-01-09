"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  exportSimplification,
  type ExportData,
} from "@/lib/services/export.service";
import {
  Download,
  FileText,
  FileJson,
  FileCode,
  Printer,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface ExportButtonProps {
  data: ExportData;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

type ExportFormat = "txt" | "md" | "json" | "html" | "pdf";

const formatIcons: Record<ExportFormat, React.ReactNode> = {
  txt: <FileText className="size-4" />,
  md: <FileCode className="size-4" />,
  json: <FileJson className="size-4" />,
  html: <FileCode className="size-4" />,
  pdf: <Printer className="size-4" />,
};

const formatLabels: Record<ExportFormat, string> = {
  txt: "Plain Text (.txt)",
  md: "Markdown (.md)",
  json: "JSON (.json)",
  html: "HTML (.html)",
  pdf: "Print to PDF",
};

/**
 * Export button with dropdown for multiple formats.
 */
export function ExportButton({
  data,
  className,
  variant = "outline",
  size = "sm",
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [activeFormat, setActiveFormat] = useState<ExportFormat | null>(null);

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      setIsExporting(true);
      setActiveFormat(format);

      try {
        const result = await exportSimplification(data, format);

        if (!result.success || !result.data) {
          toast.error(result.error ?? "Export failed");
          return;
        }

        if (format === "pdf") {
          // Open in new window for printing
          const printWindow = window.open("", "_blank");
          if (printWindow) {
            printWindow.document.write(result.data);
            printWindow.document.close();
            printWindow.focus();
            // Wait for content to load then print
            setTimeout(() => {
              printWindow.print();
            }, 250);
          } else {
            toast.error("Please allow pop-ups for PDF export");
          }
        } else {
          // Download as file
          downloadFile(result.data, result.filename!, result.mimeType!);
          toast.success(`Exported as ${format.toUpperCase()}`);
        }
      } catch {
        toast.error("Export failed");
      } finally {
        setIsExporting(false);
        setActiveFormat(null);
      }
    },
    [data]
  );

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant={variant}
              size={size}
              className={className}
              disabled={isExporting}
              aria-label="Export simplification"
            >
              {isExporting ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Download className="size-4 mr-2" />
              )}
              Export
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Export in multiple formats</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-48">
        {(["txt", "md", "json", "html"] as ExportFormat[]).map((format) => (
          <DropdownMenuItem
            key={format}
            onClick={() => handleExport(format)}
            disabled={isExporting}
          >
            {activeFormat === format ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
              <span className="mr-2">{formatIcons[format]}</span>
            )}
            {formatLabels[format]}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleExport("pdf")}
          disabled={isExporting}
        >
          {activeFormat === "pdf" ? (
            <Loader2 className="size-4 mr-2 animate-spin" />
          ) : (
            <span className="mr-2">{formatIcons.pdf}</span>
          )}
          {formatLabels.pdf}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Helper to trigger file download in browser
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default ExportButton;
