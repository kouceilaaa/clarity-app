"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface CardHoverProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  asButton?: boolean;
  noPadding?: boolean;
}

/**
 * Enhanced Card component with hover effects and consistent styling.
 * Used for history items, feature cards, etc.
 */
export const CardHover = forwardRef<HTMLDivElement, CardHoverProps>(
  (
    { className, children, asButton = false, noPadding = false, ...props },
    ref
  ) => {
    // Note: asButton prop influences styling but doesn't change the element type
    // due to ref forwarding constraints with Card component
    return (
      <Card
        ref={ref}
        className={cn(
          "card-hover border-border/50 hover:border-border transition-all duration-200",
          asButton && "cursor-pointer text-left w-full",
          className
        )}
        {...props}
      >
        {noPadding ? (
          children
        ) : (
          <CardContent className="p-4 sm:p-6">{children}</CardContent>
        )}
      </Card>
    );
  }
);

CardHover.displayName = "CardHover";
