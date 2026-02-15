import { useState } from "react";
import { LogOut, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { SECURITY_QUESTIONS } from "@/data/mockData";


interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
}

export function LogoutModal({ open, onClose }: LogoutModalProps) {
  const { confirmLogout } = useAuth();
  const { logout, saveSecuritySetup } = useAuth();
  const [question, setQuestion] = useState(SECURITY_QUESTIONS[0]);
  const [customQuestion, setCustomQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  if (!open) return null;

  const handleConfirm = () => {
   

    if(useCustom && customQuestion.trim()){
      saveSecuritySetup({
      securityQuestion: customQuestion,
      securityAnswer: answer,
    });
  }
   const success=confirmLogout(answer);
    if(!success) return;

    
  };

  const isValid = answer.trim().length > 0 && (useCustom ? customQuestion.trim().length > 0 : true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-md p-6 mx-4 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Security Setup</h3>
              <p className="text-sm text-muted-foreground">Set up verification for next login</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label>Security Question</Label>
              <button onClick={() => setUseCustom(!useCustom)} className="text-xs text-primary hover:underline">
                {useCustom ? "Use predefined" : "Custom question"}
              </button>
            </div>
            {useCustom ? (
              <Input
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="Enter your custom question..."
                className="bg-muted/50"
              />
            ) : (
              <Select value={question} onValueChange={setQuestion}>
                <SelectTrigger className="bg-muted/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SECURITY_QUESTIONS.map((q) => (
                    <SelectItem key={q} value={q}>{q}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div>
            <Label htmlFor="logout-answer">Your Answer</Label>
            <Input
              id="logout-answer"
              type="password"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter answer..."
              className="mt-1 bg-muted/50"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={handleConfirm} disabled={!isValid} className="flex-1 gap-2">
              <LogOut className="h-4 w-4" />
              Confirm & Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
