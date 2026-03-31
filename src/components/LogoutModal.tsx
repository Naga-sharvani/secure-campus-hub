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
  const [method, setMethod] = useState<"question" | "image">("question");
  const [imageLabel, setImageLabel] = useState("");

  if (!open) return null;

const handleConfirm = () => {
  if (method === "question") {
    saveSecuritySetup({
      method: "question",
      securityQuestion: useCustom ? customQuestion : question,
      securityAnswer: answer,
    });
  }

  if (method === "image") {
    saveSecuritySetup({
      method: "image",
      imageLabel: imageLabel.toLowerCase(),
    });
  }

  const success = confirmLogout(answer);
  if (!success) return;

  onClose();
};

  const isValid = answer.trim().length > 0 && (useCustom ? customQuestion.trim().length > 0 : true);

 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
    <div className="glass-card w-full max-w-md p-6 mx-4 animate-slide-up">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Security Setup
            </h3>
            <p className="text-sm text-muted-foreground">
              Set up verification for next login
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">

        {/* Verification Method Selector */}
        <div>
          <Label>Verification Method</Label>
          <Select
            value={method}
            onValueChange={(v) =>
              setMethod(v as "question" | "image")
            }
          >
            <SelectTrigger className="bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="question">
                Security Question
              </SelectItem>
              <SelectItem value="image">
                Image Verification
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Security Question Section */}
        {method === "question" && (
          <>
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label>Security Question</Label>

                <button
                  onClick={() =>
                    setUseCustom(!useCustom)
                  }
                  className="text-xs text-primary hover:underline"
                >
                  {useCustom
                    ? "Use predefined"
                    : "Custom question"}
                </button>
              </div>

              {useCustom ? (
                <Input
                  value={customQuestion}
                  onChange={(e) =>
                    setCustomQuestion(
                      e.target.value
                    )
                  }
                  placeholder="Enter your custom question..."
                  className="bg-muted/50"
                />
              ) : (
                <Select
                  value={question}
                  onValueChange={setQuestion}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {SECURITY_QUESTIONS.map(
                      (q) => (
                        <SelectItem
                          key={q}
                          value={q}
                        >
                          {q}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <Label htmlFor="logout-answer">
                Your Answer
              </Label>

              <Input
                id="logout-answer"
                type="password"
                value={answer}
                onChange={(e) =>
                  setAnswer(e.target.value)
                }
                placeholder="Enter answer..."
                className="mt-1 bg-muted/50"
              />
            </div>
          </>
        )}

        {/* Image Verification Section */}
        {method === "image" && (
          <div>
            <Label>
              Enter object for verification
            </Label>

            <Input
              placeholder="Example: cake"
              value={imageLabel}
              onChange={(e) =>
                setImageLabel(
                  e.target.value
                )
              }
              className="bg-muted/50"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>

          <Button
            onClick={handleConfirm}
            className="flex-1 gap-2"
          >
            <LogOut className="h-4 w-4" />
            Confirm & Logout
          </Button>
        </div>
      </div>
    </div>
  </div>
);
}
