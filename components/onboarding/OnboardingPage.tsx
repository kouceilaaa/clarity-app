"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/lib/hooks/usePreferences";
import { completeOnboarding } from "@/lib/actions/preferences.actions";
import { simplifyText } from "@/lib/actions/simplification.actions";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Brain,
  Users,
  Focus,
  Languages,
  Sparkles,
  Type,
  Palette,
  Volume2,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import type { SimplificationMode } from "@/lib/types";

// Situation options for Step 1
const situations = [
  {
    id: "dyslexia",
    label: "Dyslexie",
    description: "J'ai des difficultés de lecture liées à la dyslexie",
    icon: Brain,
    presets: {
      fontSize: 20,
      dyslexiaMode: true,
      theme: "normal" as const,
      defaultMode: "simple" as SimplificationMode,
      speechRate: 0.75,
    },
  },
  {
    id: "senior",
    label: "Senior",
    description: "Je préfère une police plus grande et un contraste élevé",
    icon: Users,
    presets: {
      fontSize: 24,
      dyslexiaMode: false,
      theme: "high-contrast" as const,
      defaultMode: "simple" as SimplificationMode,
      speechRate: 0.75,
    },
  },
  {
    id: "adhd",
    label: "TDAH",
    description: "J'ai du mal à me concentrer sur de longs textes",
    icon: Focus,
    presets: {
      fontSize: 18,
      dyslexiaMode: false,
      theme: "normal" as const,
      defaultMode: "summary" as SimplificationMode,
      speechRate: 1.0,
    },
  },
  {
    id: "learning-french",
    label: "Apprenant Français",
    description: "J'apprends le français et j'ai besoin de textes simplifiés",
    icon: Languages,
    presets: {
      fontSize: 18,
      dyslexiaMode: false,
      theme: "normal" as const,
      defaultMode: "accessible" as SimplificationMode,
      speechRate: 0.85,
    },
  },
  {
    id: "other",
    label: "Autre",
    description: "Je personnaliserai mes préférences moi-même",
    icon: Sparkles,
    presets: {
      fontSize: 16,
      dyslexiaMode: false,
      theme: "normal" as const,
      defaultMode: "simple" as SimplificationMode,
      speechRate: 1.0,
    },
  },
] as const;

// Sample demo text for Step 3
const demoText = `La photosynthèse est un processus biochimique complexe par lequel les organismes chlorophylliens convertissent l'énergie lumineuse en énergie chimique, permettant ainsi la synthèse de composés organiques à partir de dioxyde de carbone et d'eau.`;

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSituation, setSelectedSituation] = useState<string | null>(
    null
  );
  const [isCompleting, setIsCompleting] = useState(false);
  const [demoMode, setDemoMode] = useState<SimplificationMode>("simple");
  const [demoResult, setDemoResult] = useState<string | null>(null);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const {
    fontSize,
    dyslexiaMode,
    theme,
    speechRate,
    defaultMode,
    updateFontSize,
    updateDyslexiaMode,
    updateTheme,
    updateSpeechRate,
    updateDefaultMode,
  } = usePreferences();

  const totalSteps = 3;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Handle situation selection and apply presets
  const handleSituationSelect = useCallback(
    (situationId: string) => {
      setSelectedSituation(situationId);
      const situation = situations.find((s) => s.id === situationId);
      if (situation && situation.presets) {
        // Apply presets
        updateFontSize(situation.presets.fontSize);
        updateDyslexiaMode(situation.presets.dyslexiaMode);
        updateTheme(situation.presets.theme);
        updateDefaultMode(situation.presets.defaultMode);
        updateSpeechRate(situation.presets.speechRate);
      }
    },
    [
      updateFontSize,
      updateDyslexiaMode,
      updateTheme,
      updateDefaultMode,
      updateSpeechRate,
    ]
  );

  // Handle demo simplification
  const handleDemoSimplify = useCallback(async () => {
    setIsDemoLoading(true);
    setDemoResult(null);

    try {
      const result = await simplifyText({
        text: demoText,
        mode: demoMode,
      });

      if (result.success && result.data) {
        setDemoResult(result.data.simplifiedText);
        toast.success("Texte simplifié avec succès !");
      } else {
        toast.error(result.error || "Erreur lors de la simplification");
      }
    } finally {
      setIsDemoLoading(false);
    }
  }, [demoMode]);

  // Handle onboarding completion
  const handleComplete = useCallback(async () => {
    setIsCompleting(true);

    try {
      const result = await completeOnboarding();
      if (result.success) {
        toast.success("Configuration terminée !");
        router.push("/dashboard");
      } else {
        toast.error(result.error || "Erreur lors de la finalisation");
      }
    } finally {
      setIsCompleting(false);
    }
  }, [router]);

  // Handle skip
  const handleSkip = useCallback(async () => {
    await completeOnboarding();
    router.push("/dashboard");
  }, [router]);

  // Navigation handlers
  const goToNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  const goToPrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-bold">
                Quelle est votre situation ?
              </h2>
              <p className="text-muted-foreground">
                Sélectionnez l&apos;option qui vous correspond le mieux pour que
                nous puissions personnaliser votre expérience.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {situations.map((situation) => {
                const Icon = situation.icon;
                const isSelected = selectedSituation === situation.id;

                return (
                  <Card
                    key={situation.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md relative overflow-hidden",
                      isSelected &&
                        "border-primary ring-2 ring-primary ring-offset-2"
                    )}
                    onClick={() => handleSituationSelect(situation.id)}
                  >
                    <CardContent className="p-6">
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle2 className="size-5 text-primary" />
                        </div>
                      )}
                      <div className="flex flex-col gap-3">
                        <div
                          className={cn(
                            "size-12 rounded-lg flex items-center justify-center transition-colors",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-primary/10 text-primary"
                          )}
                        >
                          <Icon className="size-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {situation.label}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {situation.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-bold">
                Personnalisez votre expérience
              </h2>
              <p className="text-muted-foreground">
                {selectedSituation
                  ? "Nous avons pré-configuré ces paramètres pour vous. Ajustez-les si nécessaire."
                  : "Configurez vos préférences de lecture et d'accessibilité."}
              </p>
            </div>

            <div className="space-y-8 max-w-2xl mx-auto">
              {/* Font Size */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Type className="size-5 text-primary" />
                  <div>
                    <Label className="text-base font-semibold">
                      Taille du texte
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Ajustez la taille de la police (
                      <span className="font-medium">{fontSize}px</span>)
                    </p>
                  </div>
                </div>
                <Slider
                  value={[fontSize]}
                  onValueChange={([value]) => updateFontSize(value)}
                  min={12}
                  max={32}
                  step={2}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Petit (12px)</span>
                  <span>Grand (32px)</span>
                </div>
              </div>

              {/* Dyslexia Mode */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Brain className="size-5 text-primary" />
                  <div>
                    <Label className="text-base font-semibold">
                      Mode Dyslexie
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Police OpenDyslexic et espacement amélioré
                    </p>
                  </div>
                </div>
                <Button
                  variant={dyslexiaMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateDyslexiaMode(!dyslexiaMode)}
                >
                  {dyslexiaMode ? "Activé" : "Désactivé"}
                </Button>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Palette className="size-5 text-primary" />
                  <div>
                    <Label className="text-base font-semibold">
                      Contraste Élevé
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Améliore la lisibilité avec un contraste plus fort
                    </p>
                  </div>
                </div>
                <Button
                  variant={theme === "high-contrast" ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    updateTheme(
                      theme === "high-contrast" ? "normal" : "high-contrast"
                    )
                  }
                >
                  {theme === "high-contrast" ? "Activé" : "Désactivé"}
                </Button>
              </div>

              {/* Speech Rate */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Volume2 className="size-5 text-primary" />
                  <div>
                    <Label className="text-base font-semibold">
                      Vitesse de lecture vocale
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Vitesse:{" "}
                      {speechRate === 0.75
                        ? "Lente"
                        : speechRate === 1.0
                        ? "Normale"
                        : "Rapide"}
                    </p>
                  </div>
                </div>
                <Slider
                  value={[speechRate]}
                  onValueChange={([value]) => updateSpeechRate(value)}
                  min={0.5}
                  max={1.5}
                  step={0.25}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Lente</span>
                  <span>Rapide</span>
                </div>
              </div>

              {/* Default Mode */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Mode de simplification par défaut
                </Label>
                <Select
                  value={defaultMode}
                  onValueChange={(value: SimplificationMode) =>
                    updateDefaultMode(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Simple</span>
                        <span className="text-xs text-muted-foreground">
                          Pour les enfants (8 ans)
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="accessible">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Accessible</span>
                        <span className="text-xs text-muted-foreground">
                          Pour les adolescents
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="summary">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Résumé</span>
                        <span className="text-xs text-muted-foreground">
                          3-5 phrases clés
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-bold">Essayez-le maintenant !</h2>
              <p className="text-muted-foreground">
                Testez la simplification avec un exemple de texte. Choisissez un
                mode et voyez le résultat.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {/* Mode Selector */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Choisissez un mode
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={demoMode === "simple" ? "default" : "outline"}
                    onClick={() => setDemoMode("simple")}
                    className="flex flex-col h-auto py-3"
                  >
                    <span className="font-semibold">Simple</span>
                    <span className="text-xs opacity-80">8 ans</span>
                  </Button>
                  <Button
                    variant={demoMode === "accessible" ? "default" : "outline"}
                    onClick={() => setDemoMode("accessible")}
                    className="flex flex-col h-auto py-3"
                  >
                    <span className="font-semibold">Accessible</span>
                    <span className="text-xs opacity-80">Ados</span>
                  </Button>
                  <Button
                    variant={demoMode === "summary" ? "default" : "outline"}
                    onClick={() => setDemoMode("summary")}
                    className="flex flex-col h-auto py-3"
                  >
                    <span className="font-semibold">Résumé</span>
                    <span className="text-xs opacity-80">Court</span>
                  </Button>
                </div>
              </div>

              {/* Original Text */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Texte original
                </Label>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm leading-relaxed">{demoText}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Simplify Button */}
              <Button
                onClick={handleDemoSimplify}
                disabled={isDemoLoading}
                className="w-full"
                size="lg"
              >
                {isDemoLoading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Simplification en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4 mr-2" />
                    Simplifier le texte
                  </>
                )}
              </Button>

              {/* Result */}
              {demoResult && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">
                      Texte simplifié
                    </Label>
                    <Badge variant="secondary" className="gap-1">
                      <Check className="size-3" />
                      Mode {demoMode}
                    </Badge>
                  </div>
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4">
                      <p className="text-sm leading-relaxed">{demoResult}</p>
                    </CardContent>
                  </Card>
                  <p className="text-xs text-muted-foreground text-center">
                    ✨ Parfait ! Vous pouvez maintenant simplifier vos propres
                    textes.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            Configuration initiale
          </Badge>
          <h1 className="text-3xl font-bold mb-2">Bienvenue sur ClarityWeb</h1>
          <p className="text-muted-foreground">
            Étape {currentStep + 1} sur {totalSteps}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={goToPrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="size-4 mr-2" />
            Précédent
          </Button>

          <Button variant="ghost" onClick={handleSkip}>
            Passer
          </Button>

          {currentStep < totalSteps - 1 ? (
            <Button
              onClick={goToNext}
              disabled={currentStep === 0 && !selectedSituation}
            >
              Suivant
              <ArrowRight className="size-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={isCompleting}>
              {isCompleting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Finalisation...
                </>
              ) : (
                <>
                  <Check className="size-4 mr-2" />
                  Terminer
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
