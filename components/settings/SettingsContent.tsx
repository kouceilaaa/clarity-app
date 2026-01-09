"use client";

import {
  Settings,
  Moon,
  Sun,
  Contrast,
  Type,
  Volume2,
  Palette,
} from "lucide-react";
import {
  useAppDispatch,
  useAppSelector,
  setTheme,
  toggleDyslexiaMode,
  setFontSize,
  setSpeechRate,
  selectTheme,
  selectDyslexiaMode,
  selectFontSize,
  selectSpeechRate,
} from "@/lib/stores";
import type { UserPreferences } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Theme = UserPreferences["theme"];

const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: "normal", label: "Light", icon: <Sun className="h-4 w-4" /> },
  { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
  {
    value: "high-contrast",
    label: "High Contrast",
    icon: <Contrast className="h-4 w-4" />,
  },
  { value: "cream", label: "Cream", icon: <Palette className="h-4 w-4" /> },
];

const fontSizeOptions: { value: number; label: string }[] = [
  { value: 14, label: "Small (14px)" },
  { value: 16, label: "Medium (16px)" },
  { value: 18, label: "Large (18px)" },
  { value: 20, label: "Extra Large (20px)" },
  { value: 24, label: "Huge (24px)" },
];

export function SettingsContent() {
  const dispatch = useAppDispatch();

  const theme = useAppSelector(selectTheme);
  const dyslexiaMode = useAppSelector(selectDyslexiaMode);
  const fontSize = useAppSelector(selectFontSize);
  const speechRate = useAppSelector(selectSpeechRate);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Customize your reading experience
        </p>
      </div>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how ClarityWeb looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => dispatch(setTheme(t.value))}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                    theme === t.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {t.icon}
                  <span className="text-sm">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Font Size */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Font Size</Label>
              <span className="text-sm text-muted-foreground">
                {fontSize}px
              </span>
            </div>
            <Slider
              value={[fontSize]}
              onValueChange={([value]) => dispatch(setFontSize(value))}
              min={12}
              max={32}
              step={2}
            />
            <div className="flex flex-wrap gap-2">
              {fontSizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => dispatch(setFontSize(option.value))}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    fontSize === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Dyslexia Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Dyslexia-Friendly Font
              </Label>
              <p className="text-sm text-muted-foreground">
                Use OpenDyslexic font for easier reading
              </p>
            </div>
            <Switch
              checked={dyslexiaMode}
              onCheckedChange={() => dispatch(toggleDyslexiaMode())}
            />
          </div>
        </CardContent>
      </Card>

      {/* Text-to-Speech Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Text-to-Speech
          </CardTitle>
          <CardDescription>Configure voice reading speed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* TTS Speed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Reading Speed</Label>
              <span className="text-sm text-muted-foreground">
                {speechRate}x
              </span>
            </div>
            <Slider
              value={[speechRate]}
              onValueChange={([value]) => dispatch(setSpeechRate(value))}
              min={0.5}
              max={2}
              step={0.1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Slower (0.5x)</span>
              <span>Normal (1x)</span>
              <span>Faster (2x)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground text-center">
            Your preferences are saved automatically and will be remembered on
            this device.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
