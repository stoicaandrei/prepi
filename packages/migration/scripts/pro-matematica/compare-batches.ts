import oBatch from "./gpt-o-batch.json";
import oMiniBatch from "./gpt-o-mini-batch.json";

import fs from "fs";

type ProblemType = {
  statement: string;
  points: number;
  officialExplanation: {
    text: string;
    points: number;
  }[];
};

export default function compareBatches() {
  let texResult = `\\`;

  for (let i = 0; i < oBatch.length; i++) {
    const pbO = oBatch[i];
    const pbOMini = oMiniBatch[i];

    const pbOData = pbO.response.body.choices[0].message.content
      .replace(/^```json\s*/, "") // Remove the ```json start tag
      .replace(/```$/, ""); // Remove the ``` end tag
    const pbOMiniData = pbOMini.response.body.choices[0].message.content
      .replace(/^```json\s*/, "") // Remove the ```json start tag
      .replace(/```$/, ""); // Remove the ``` end tag

    console.log(i);

    console.log(pbOData);
    const pbODataParsed: ProblemType = JSON.parse(pbOData);
    console.log(pbOMiniData);
    const pbOMiniDataParsed: ProblemType = JSON.parse(pbOMiniData);

    texResult += `Problem ${i + 1}\n\n`;

    texResult += `GPT-4o\n\n`;
    texResult += `Statement: ${pbODataParsed.statement}\n\n`;
    texResult += `Points: ${pbODataParsed.points}\n\n`;
    texResult += `Official Explanation:\n\n`;
    pbODataParsed.officialExplanation.forEach((oe, index) => {
      texResult += `Point ${index + 1}: ${oe.text}\n\n`;
      texResult += `Points: ${oe.points}\n\n`;
    });

    texResult += `GPT-4o Mini\n\n`;
    texResult += `Statement: ${pbOMiniDataParsed.statement}\n\n`;
    texResult += `Points: ${pbOMiniDataParsed.points}\n\n`;
    texResult += `Official Explanation:\n\n`;
    pbOMiniDataParsed.officialExplanation.forEach((oe, index) => {
      texResult += `Point ${index + 1}: ${oe.text}\n\n`;
      texResult += `Points: ${oe.points}\n\n`;
    });

    texResult += "\n\n";

    fs.writeFileSync("comparison.tex", texResult);
  }
}
