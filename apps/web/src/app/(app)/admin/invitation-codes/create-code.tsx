"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { trpc } from "@/utils/trpc";

export function CreateInvitationCode() {
  const utils = trpc.useUtils();
  const createInvitationCode = trpc.admin.invitationCode.create.useMutation({
    onSuccess: () => {
      utils.admin.invitationCode.list.invalidate();

      setIsOpen(false);
      // Reset form after submission
      setFormData({
        code: "",
        description: "",
        maxUses: "",
        validUntil: null,
        stripeCoupon: "",
      });
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    maxUses: "",
    validUntil: null as Date | null,
    stripeCoupon: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, validUntil: date || null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically call your tRPC mutation to create the invitation code
    console.log("Form submitted:", formData);

    createInvitationCode.mutate({
      code: formData.code,
      description: formData.description,
      maxUses: formData.maxUses ? Number(formData.maxUses) : undefined,
      validUntil: formData.validUntil ?? undefined,
      stripeCoupon: formData.stripeCoupon,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create Invitation Code</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Invitation Code</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxUses">Max Uses</Label>
            <Input
              id="maxUses"
              name="maxUses"
              type="number"
              value={formData.maxUses}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Valid Until</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.validUntil && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.validUntil ? (
                    dayjs(formData.validUntil).format("PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.validUntil || undefined}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stripeCoupon">Stripe Coupon ID (optional)</Label>
            <Input
              id="stripeCoupon"
              name="stripeCoupon"
              value={formData.stripeCoupon}
              onChange={handleInputChange}
            />
          </div>
          <Button type="submit" className="w-full">
            Create Invitation Code
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
