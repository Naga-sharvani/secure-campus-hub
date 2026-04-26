import { useEffect, useState } from "react";
import { Shield, AlertTriangle, CheckCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

interface VerificationModalProps {
  open: boolean;
  onClose: () => void;
  onVerified: () => void;
  actionLabel: string;
}

export function VerificationModal({ open, onClose, onVerified, actionLabel }: VerificationModalProps) {
  const { securitySetup, verifySensitiveAction } = useAuth();
  const [answer, setAnswer] = useState("");
  const [step, setStep] = useState<"question" | "image" | "success">("question");

  useEffect(() => {
  if (securitySetup?.method === "image") {
    setStep("image");
  }
  }, [securitySetup]);

  const [error, setError] = useState("");

  if (!open) return null;

  const handleQuestionSubmit = () => {
  if (verifySensitiveAction(answer)) {
    setStep("success");

    setTimeout(() => {
      onVerified();
      resetState();
    }, 1000);
  } else {
    setError("Incorrect answer. Access denied.");
  }
};

  const handleImageVerify = async (file: File) => {
  if (!securitySetup?.imageLabel) return;

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("https://secure-campus-hub-server.onrender.com/match", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (
    data.label?.toLowerCase() ===
    securitySetup.imageLabel.toLowerCase()
  ) {
    setStep("success");

    setTimeout(() => {
      onVerified();
      resetState();
    }, 1000);
  } else {
    setError("Incorrect object detected");
  }
};

const resetState = () => {
  setAnswer("");
  setStep(
    securitySetup?.method === "image"
      ? "image"
      : "question"
  );
  setError("");
};

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-md p-6 mx-4 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <Shield className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Zero-Trust Verification</h3>
              <p className="text-sm text-muted-foreground">{actionLabel}</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {["question", "image", "success"].map((s, i) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${
              i <= ["question", "image", "success"].indexOf(step) ? "bg-primary" : "bg-muted"
            }`} />
          ))}
        </div>

        {step === "question" && (
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground text-sm">Security Question</Label>
              <p className="text-foreground font-medium mt-1">
                {securitySetup?.securityQuestion || "Set your custom security question"}
              </p>
            </div>
            <div>
              <Label htmlFor="answer">Your Answer</Label>
              <Input
                id="answer"
                type="password"
                value={answer}
                onChange={(e) => { setAnswer(e.target.value); setError(""); }}
                placeholder="Enter your answer..."
                className="mt-1 bg-muted/50"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </div>
            )}
            <Button onClick={handleQuestionSubmit} className="w-full" disabled={!answer}>
              Verify Answer
            </Button>
          </div>
        )}

        {step === "image" && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">Upload verification image to proceed</p>
              <label className="flex flex-col items-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-colors border-border hover:border-primary/50">
  <Upload className="h-10 w-10 text-muted-foreground" />

  <span className="text-sm text-muted-foreground">
    Click to upload verification image
  </span>

  <input
    type="file"
    className="hidden"
    accept="image/*"
    onChange={(e) =>
      handleImageVerify(e.target.files?.[0]!)
    }
  />
</label>
            </div>
            
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-4">
            <CheckCircle className="h-12 w-12 text-primary mx-auto mb-3" />
            <p className="text-foreground font-medium">Verification Successful</p>
            <p className="text-sm text-muted-foreground">Action authorized</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-4 text-center font-mono">
          ZERO-TRUST • CONTINUOUS VERIFICATION
        </p>
      </div>
    </div>
  );
}
