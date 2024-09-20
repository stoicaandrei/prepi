"use server";

import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function submitForm(formData: FormData) {
  const validatedFields = schema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { email } = validatedFields.data;

  try {
    const response = await fetch("https://formcarry.com/s/jrVHdlL50E6", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, message: "coming soon form" }),
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
