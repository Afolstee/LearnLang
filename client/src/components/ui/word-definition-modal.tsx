import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Volume2, Bookmark, X } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api, type WordDefinition } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Language } from "@shared/schema";

interface WordDefinitionModalProps {
  word?: string;
  context?: string;
  nativeLanguage: Language;
  userId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function WordDefinitionModal({
  word,
  context,
  nativeLanguage,
  userId,
  isOpen,
  onClose,
}: WordDefinitionModalProps) {
  const { toast } = useToast();

  const { data: definition, isLoading } = useQuery({
    queryKey: ["/api/define", word, nativeLanguage, context],
    queryFn: () => word ? api.defineWord(word, nativeLanguage, context) : null,
    enabled: isOpen && !!word,
  });

  const saveWordMutation = useMutation({
    mutationFn: (vocabularyData: {
      userId: string;
      word: string;
      definition: string;
      culturalContext?: string;
      nativeTranslation?: string;
      exampleSentence?: string;
    }) => api.saveVocabulary(vocabularyData),
    onSuccess: () => {
      toast({
        title: "Word saved!",
        description: "Added to your vocabulary collection.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save word. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveWord = () => {
    if (!definition || !userId) return;
    
    saveWordMutation.mutate({
      userId,
      word: definition.word,
      definition: definition.definition,
      culturalContext: definition.culturalContext,
      nativeTranslation: definition.nativeTranslation,
      exampleSentence: definition.exampleSentence,
    });
  };

  const handlePronunciation = () => {
    if (!word) return;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Not supported",
        description: "Speech synthesis is not supported in your browser.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md transform transition-all duration-200" data-testid="word-definition-modal">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl font-semibold text-gray-900" data-testid="modal-word">
              {word || "Loading..."}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              data-testid="close-modal"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        {isLoading ? (
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ) : definition ? (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Definition</h4>
              <p className="text-gray-700" data-testid="modal-definition">
                {definition.definition}
              </p>
            </div>
            
            {definition.culturalContext && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Cultural Context</h4>
                <p className="text-gray-700" data-testid="modal-cultural-note">
                  {definition.culturalContext}
                </p>
              </div>
            )}
            
            {definition.nativeTranslation && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Translation</h4>
                <p className="text-gray-700 font-medium" data-testid="modal-translation">
                  {definition.nativeTranslation}
                </p>
              </div>
            )}
            
            {definition.exampleSentence && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Example</h4>
                <p className="text-gray-700 italic" data-testid="modal-example">
                  "{definition.exampleSentence}"
                </p>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePronunciation}
                className="flex items-center space-x-2"
                data-testid="pronunciation-button"
              >
                <Volume2 className="w-4 h-4" />
                <span>Pronunciation</span>
              </Button>
              
              {userId && (
                <Button
                  onClick={handleSaveWord}
                  disabled={saveWordMutation.isPending}
                  className="flex items-center space-x-2"
                  data-testid="save-word-button"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>{saveWordMutation.isPending ? "Saving..." : "Save Word"}</span>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">Failed to load definition. Please try again.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
