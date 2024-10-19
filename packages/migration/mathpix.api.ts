import axios from "axios";

const mathpixBase = "https://api.mathpix.com/v3/";
const mathpixHeaders = {
  app_id: process.env.MATHPIX_APP_ID,
  app_key: process.env.MATHPIX_APP_KEY,
  "Content-Type": "application/json",
};
const mathpixPdfUrl = "https://api.mathpix.com/v3/pdf/";

interface PdfProcessResponse {
  pdf_id: string;
  error?: string;
  error_info?: {
    [key: string]: any;
  };
}

interface AlphabetsAllowed {
  [key: string]: boolean;
}

interface ConversionFormats {
  mmd?: boolean;
  md?: boolean;
  docx?: boolean;
  "tex.zip"?: boolean;
  html?: boolean;
  "lines.json"?: boolean;
  "lines.mmd.json"?: boolean;
}

interface ProcessPdfParams {
  url?: string;
  metadata?: Record<string, any>;
  alphabets_allowed?: AlphabetsAllowed;
  rm_spaces?: boolean;
  rm_fonts?: boolean;
  idiomatic_eqn_arrays?: boolean;
  include_equation_tags?: boolean;
  include_smiles?: boolean;
  include_chemistry_as_image?: boolean;
  numbers_default_to_math?: boolean;
  math_inline_delimiters?: [string, string];
  math_display_delimiters?: [string, string];
  page_ranges?: string;
  enable_spell_check?: boolean;
  auto_number_sections?: boolean;
  remove_section_numbering?: boolean;
  preserve_section_numbering?: boolean;
  enable_tables_fallback?: boolean;
  conversion_formats?: ConversionFormats;
}

export const processPdf = async (
  params: ProcessPdfParams,
): Promise<PdfProcessResponse> => {
  try {
    const response = await axios.post<PdfProcessResponse>(
      mathpixPdfUrl,
      params,
      {
        headers: mathpixHeaders,
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw error;
  }
};

interface ProcessingStatus {
  status: "loaded" | "split" | "completed" | "error";
  num_pages?: number;
  num_pages_completed?: number;
  percent_done?: number;
}

export const checkProcessingStatus = async (
  pdfId: string,
): Promise<ProcessingStatus> => {
  try {
    const response = await axios.get<ProcessingStatus>(
      `${mathpixPdfUrl}${pdfId}`,
      {
        headers: mathpixHeaders,
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error checking PDF processing status:", error);
    throw error;
  }
};

export const pollProcessingStatus = async (
  pdfId: string,
  interval = 1000,
  timeout = 300000,
): Promise<ProcessingStatus> => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const status = await checkProcessingStatus(pdfId);

    if (status.status === "completed" || status.status === "error") {
      return status;
    }

    console.log(
      `Processing status: ${status.status}, Percent done: ${status.percent_done}%`,
    );

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error("PDF processing timed out");
};

type ConversionFormat =
  | "mmd"
  | "md"
  | "docx"
  | "tex.zip"
  | "html"
  | "lines.json"
  | "lines.mmd.json";

export const getConversionResult = async (
  pdfId: string,
  format: ConversionFormat,
): Promise<string> => {
  try {
    const response = await axios.get(`${mathpixPdfUrl}${pdfId}.${format}`, {
      headers: mathpixHeaders,
      responseType: "arraybuffer",
    });

    // For text-based formats, convert ArrayBuffer to string
    if (
      ["mmd", "md", "html", "lines.json", "lines.mmd.json"].includes(format)
    ) {
      return Buffer.from(response.data).toString("utf-8");
    }

    // For binary formats (docx, tex.zip), return base64 encoded string
    return Buffer.from(response.data).toString("base64");
  } catch (error) {
    console.error(
      `Error getting conversion result for format ${format}:`,
      error,
    );
    throw error;
  }
};
