"use client";

import { Scale, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SUGGESTION_QUESTIONS } from "@/lib/constants";

interface WelcomeScreenProps {
  onSuggestionClick: (question: string, language: string) => void;
}

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
          <Scale className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Namaste! I&apos;m NITI-SATHI</h2>
        <p className="text-muted-foreground max-w-md">
          Your AI legal assistant for Nepali law and governance. Ask me anything
          about the Constitution, Acts, legal rights, and procedures.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 max-w-2xl w-full">
        {SUGGESTION_QUESTIONS.map((q, i) => (
          <Card
            key={i}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => onSuggestionClick(q.en, "en")}
          >
            <CardContent className="p-4 flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm">{q.en}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
