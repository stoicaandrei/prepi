import {
  processPdf,
  pollProcessingStatus,
  getConversionResult,
  processImage,
} from "./mathpix.api";

const cleanUpMd = (md: string) => {
  return md.replace(/\\text\s*\{\s*([^}]+\s*)\}/g, "$1");
};

export const convertPdfToMd = async (pdfUrl: string) => {
  // Step 1: Process the PDF
  console.log("Processing PDF...");
  const processResult = await processPdf({
    url: pdfUrl,
    numbers_default_to_math: true,
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
    const _mdResult = await getConversionResult(pdfId, "md");
    const mdResult = await replaceImagesWithText(_mdResult);

    return cleanUpMd(mdResult);
  } else {
    throw new Error("PDF processing failed or timed out");
  }
};

const replaceImagesWithText = async (markdown: string): Promise<string> => {
  const imageRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
  let result = markdown;
  let match;

  while ((match = imageRegex.exec(markdown)) !== null) {
    const [fullMatch, imageUrl] = match;

    console.log(`Converting image: ${imageUrl}`);
    const convertedText = await convertImgToMd(imageUrl);
    result = result.replace(fullMatch, convertedText);
  }

  return result;
};

export const convertImgToMd = async (imgUrl: string) => {
  console.log("Processing Image...");
  const processResult = await processImage({
    src: imgUrl,
    formats: ["latex_styled"],
  });

  const data = processResult.latex_styled;

  if (!data) {
    throw new Error("Image processing failed, no data returned");
  }

  return data;
};
