import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function main() {
  // const assistant = await openai.beta.assistants.create({
  //   name: "Math Transcriber",
  //   instructions:
  //     "You are a robot that reads exam papers and transcribes the problems and solutions into a digital format. You will keep the romanian language",
  //   model: "gpt-4o",
  //   tools: [{ type: "file_search" }],
  // });

  // console.log("Assistant created successfully!");

  const subiect = await openai.files.create({
    file: fs.createReadStream(
      "./2010_E_c_Matematica_SM_M1_Model_Subiect_LRO.pdf",
    ),
    purpose: "assistants",
  });

  const barem = await openai.files.create({
    file: fs.createReadStream(
      "./2010_E_c_Matematica_SM_M1_Model_Barem_LRO.pdf",
    ),
    purpose: "assistants",
  });

  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content: "Transcribe subject 1, problem 1, statement and solution.",
        attachments: [
          { file_id: subiect.id, tools: [{ type: "file_search" }] },
          { file_id: barem.id, tools: [{ type: "file_search" }] },
        ],
      },
    ],
  });

  console.log("Thread created successfully!");
  const assistant = { id: "asst_RFZm6aUSpxsUN91PKX9ZlxuF" };

  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistant.id,
  });

  const messages = await openai.beta.threads.messages.list(thread.id, {
    run_id: run.id,
  });

  const message = messages.data.pop()!;
  if (message.content[0].type === "text") {
    const { text } = message.content[0];
    const { annotations } = text;
    const citations: string[] = [];

    let index = 0;
    for (let annotation of annotations) {
      text.value = text.value.replace(annotation.text, "[" + index + "]");
      // const { file_citation } = annotation;
      // if (file_citation) {
      //   const citedFile = await openai.files.retrieve(file_citation.file_id);
      //   citations.push("[" + index + "]" + citedFile.filename);
      // }
      index++;
    }

    console.log(text.value);
    console.log(citations.join("\n"));
  }
}
