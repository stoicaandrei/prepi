"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExamDifficulty, IdealGrade } from "@prisma/client";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const onboardPreferences = trpc.user.onboardPreferences.useMutation({
    onSuccess: () => {
      router.push("/onboarding/checkout");
    },
  });

  const [idealGrade, setIdealGrade] = useState<IdealGrade>(IdealGrade.EIGHT);
  const [examDifficulty, setExamDifficulty] = useState<ExamDifficulty>(
    ExamDifficulty.M2,
  );
  const [invitationCode, setInvitationCode] = useState("");

  const readyToSubmit = idealGrade && examDifficulty;

  const handleSubmit = () => {
    if (!readyToSubmit) return;

    onboardPreferences.mutate({
      idealGrade,
      examDifficulty,
      invitationCode,
    });
  };

  return (
    <div className="flex items-center justify-center overflow-scroll">
      <img
        src="/illustrations/background-items.svg"
        alt=""
        className="absolute z-0"
      />
      <Card className="w-full max-w-md z-10">
        <CardHeader>
          <img
            src="/illustrations/girl-giant-phone.svg"
            alt="Illustration"
            className="mx-auto mb-6"
            width={250}
            height={225}
          />
          <CardTitle className="text-xl">
            Spune-ne câteva detalii despre tine
          </CardTitle>
          <CardDescription className="text-sm">
            Setează-ți preferințele pentru platformă
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="target-grade" className="text-sm">
                  Nota țintă
                </Label>
                <Select
                  value={idealGrade}
                  onValueChange={(val) => setIdealGrade(val as IdealGrade)}
                >
                  <SelectTrigger id="target-grade" className="text-sm">
                    <SelectValue placeholder="Alege nota țintă" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value={IdealGrade.SIX}>6-7</SelectItem>
                    <SelectItem value={IdealGrade.EIGHT}>8-9</SelectItem>
                    <SelectItem value={IdealGrade.TEN}>10</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="profile" className="text-sm">
                  Profil matematică
                </Label>
                <Select
                  value={examDifficulty}
                  onValueChange={(val) =>
                    setExamDifficulty(val as ExamDifficulty)
                  }
                >
                  <SelectTrigger id="profile" className="text-sm">
                    <SelectValue placeholder="Alege profilul" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value={ExamDifficulty.M1}>
                      M1 (Mate-Info)
                    </SelectItem>
                    <SelectItem value={ExamDifficulty.M2}>
                      M2 (Stiintele Naturii)
                    </SelectItem>
                    <SelectItem value={ExamDifficulty.M3}>
                      M3 (Pedagocic)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* TODO: Check if invitation code is valid before allowing user to submit form */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="invitation-code" className="text-sm">
                  Cod de invitație
                  <span className="text-xs text-muted-foreground ml-2">
                    (opțional)
                  </span>
                </Label>
                <Input
                  id="invitation-code"
                  placeholder="Introdu codul de invitație"
                  className="text-sm"
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            className="text-sm"
            disabled={!readyToSubmit || onboardPreferences.isLoading}
            onClick={handleSubmit}
          >
            {onboardPreferences.isLoading && "încarcă..."}
            {!onboardPreferences.isLoading && "Salvează"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
