import {
  processPdf,
  pollProcessingStatus,
  getConversionResult,
} from "./mathpix.api";

export const convertPdfToMd = async (pdfUrl: string) => {
  // Step 1: Process the PDF
  console.log("Processing PDF...");
  const processResult = await processPdf({
    url: pdfUrl,
    conversion_formats: {
      md: true,
    },
  });

  const pdfId = processResult.pdf_id;

  if (!pdfId) {
    throw new Error("PDF processing failed, no PDF ID returned");
  }

  console.log("PDF processed. PDF ID:", pdfId);

  // Step 2: Poll for processing status
  console.log("Polling for processing status...");
  const finalStatus = await pollProcessingStatus(pdfId);
  console.log("Final processing status:", finalStatus.status);

  if (finalStatus.status === "completed") {
    // Step 3: Get conversion results
    console.log("Getting conversion results...");

    // Get Markdown result
    const mdResult = await getConversionResult(pdfId, "md");
    return mdResult;
  } else {
    throw new Error("PDF processing failed or timed out");
  }
};
