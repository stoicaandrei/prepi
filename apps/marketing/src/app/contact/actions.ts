"use server";

import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

export async function submitForm(formData: FormData) {
  const validatedFields = schema.safeParse({
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { email, message } = validatedFields.data;

  try {
    const response = await fetch("https://formcarry.com/s/jrVHdlL50E6", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, message }),
    });

    const result = await response.json();

    if (response.ok) {
      return { success: "We received your submission, thank you!" };
    } else {
      return {
        error: result.message || "An error occurred while submitting the form.",
      };
    }
  } catch (error) {
    return { error: "An error occurred while submitting the form." };
  }
}
