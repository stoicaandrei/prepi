import { convertImgToMd, convertPdfToMd } from "./../mathpix.utils";
import fs from "fs";

export default async function main() {
  const md = await convertImgToMd(
    "https://cdn.mathpix.com/cropped/2024_10_22_2ca51d87e6c7d61e400ag-2.jpg?height=468&width=578&top_left_y=1867&top_left_x=355",
  );
  await fs.promises.writeFile("test.md", md);
}
