import { convertPdfToMd } from "./../mathpix.utils";
import fs from "fs";

export default async function main() {
  const md = await convertPdfToMd(
    "https://www.pro-matematica.ro/bacalaureat/2010/2010_E_c_Matematica_SM_M1_Model_Barem_LRO.pdf",
  );
  await fs.promises.writeFile("test.md", md);
}
