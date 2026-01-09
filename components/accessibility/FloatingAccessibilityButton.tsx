"use client";

import { useState } from "react";
import { Accessibility } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessibilityPanel } from "./AccessibilityPanel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function FloatingAccessibilityButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="icon"
              className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => setOpen(true)}
              aria-label="Open accessibility settings"
            >
              <Accessibility className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Accessibility Settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AccessibilityPanel
        open={open}
        onOpenChange={setOpen}
        triggerButton={null}
      />
    </>
  );
}
