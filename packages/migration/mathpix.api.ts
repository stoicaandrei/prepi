import axios from "axios";

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

const mathpixImageUrl = "https://api.mathpix.com/v3/text";

interface DataOptions {
  include_asciimath?: boolean;
  include_latex?: boolean;
}

interface Region {
  top_left_x: number;
  top_left_y: number;
  width: number;
  height: number;
}

interface Callback {
  post: string;
  headers?: Record<string, string>;
}

interface ProcessImageParams {
  src?: string;
  file?: File;
  metadata?: Record<string, any>;
  tags?: string[];
  async?: boolean;
  callback?: Callback;
  formats?: ("text" | "data" | "html" | "latex_styled")[];
  data_options?: DataOptions;
  include_detected_alphabets?: boolean;
  alphabets_allowed?: AlphabetsAllowed;
  region?: Region;
  enable_blue_hsv_filter?: boolean;
  confidence_threshold?: number;
  confidence_rate_threshold?: number;
  include_equation_tags?: boolean;
  include_line_data?: boolean;
  include_word_data?: boolean;
  include_smiles?: boolean;
  include_inchi?: boolean;
  include_geometry_data?: boolean;
  auto_rotate_confidence_threshold?: number;
  rm_spaces?: boolean;
  rm_fonts?: boolean;
  idiomatic_eqn_arrays?: boolean;
  idiomatic_braces?: boolean;
  numbers_default_to_math?: boolean;
  math_fonts_default_to_math?: boolean;
  math_inline_delimiters?: [string, string];
  math_display_delimiters?: [string, string];
  enable_spell_check?: boolean;
  enable_tables_fallback?: boolean;
}

interface DataObject {
  type: string;
  value: string;
}

interface LineData {
  // Define LineData structure if needed
}

interface WordData {
  // Define WordData structure if needed
}

interface DetectedAlphabet {
  // Define DetectedAlphabet structure if needed
}

interface GeometryData {
  // Define GeometryData structure if needed
}

interface ProcessImageResponse {
  request_id?: string;
  text?: string;
  latex_styled?: string;
  confidence?: number;
  confidence_rate?: number;
  line_data?: LineData[];
  word_data?: WordData[];
  data?: DataObject[];
  html?: string;
  detected_alphabets?: DetectedAlphabet[];
  is_printed?: boolean;
  is_handwritten?: boolean;
  auto_rotate_confidence?: number;
  geometry_data?: GeometryData[];
  auto_rotate_degrees?: number;
  error?: string;
  error_info?: Record<string, any>;
  version: string;
}

export const processImage = async (
  params: ProcessImageParams,
): Promise<ProcessImageResponse> => {
  try {
    let data: any;
    let headers = { ...mathpixHeaders };

    if (params.file) {
      // If a file is provided, use FormData
      const formData = new FormData();
      formData.append("file", params.file);
      formData.append("options_json", JSON.stringify(params));
      data = formData;
      headers["Content-Type"] = "multipart/form-data";
    } else {
      // If no file is provided, assume it's a URL in the 'src' parameter
      data = params;
    }

    const response = await axios.post<ProcessImageResponse>(
      mathpixImageUrl,
      data,
      { headers },
    );

    return response.data;
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
};
