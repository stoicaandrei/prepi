import * as readline from "readline";
import { prisma } from "@prepi/db";

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to ask a question and return a promise with the answer
function askQuestion(query: string) {
  return new Promise((resolve) =>
    rl.question(query, resolve),
  ) as Promise<string>;
}

const matching = [
  {
    legacyId: "cm0voj6xx0014i7d650xc8sdz",
    videoFolder: "derivate - cum apar formulele",
    id: "1014790613",
    title: "Derivate, cum apar formulele - Prepi Pregatire BAC Matematica",
  },
  {
    legacyId: "cm0vojqqe0060i7d6hwob2hmq",
    videoFolder: "derivate - cum apar formulele",
    id: "1014790613",
    title: "Derivate, cum apar formulele - Prepi Pregatire BAC Matematica",
  },
  {
    legacyId: "cm0vojqqe0060i7d6hwob2hmq",
    videoFolder: "derivate -  reguli de derivate - compunerea",
    id: "1014790631",
    title: "Derivate, reguli de derivare - Prepi Pregatire BAC Matematica",
  },
  {
    legacyId: "cm0vojqqe0060i7d6hwob2hmq",
    videoFolder: "derivate - reguli de derivate - exemple",
    id: "1014790645",
    title:
      "Derivate, reguli de derivare, exemple - Prepi Pregatire BAC Matematica",
  },
  {
    legacyId: "cm0vojbjf0026i7d65o7s8ze6",
    videoFolder: "compunerea-final",
    id: "1014790596",
    title: "Compunerea - Prepi Pregatire BAC Matematica",
  },
  {
    legacyId: "cm0vojc61002bi7d64mvlzmm6",
    videoFolder: "derivate - tangenta la grafic - part 1",
    id: "1014790708",
    title:
      "Derivate, tangenta la grafic (partea 1) - Prepi Pregatire BAC Matematica",
  },
  {
    legacyId: "cm0vojc61002bi7d64mvlzmm6",
    videoFolder: "derivate - tangenta la grafic - part 2",
    id: "1014791223",
    title:
      "Derivate, tangenta la grafic (partea 2) - Prepi Pregatire BAC Matematica",
  },
  {
    legacyId: "cm0vojc61002bi7d64mvlzmm6",
    videoFolder: "derivate - tangenta la grafic - part 3",
    id: "1014791340",
    title:
      "Derivate - tangenta la grafic (partea 3) - Prepi Pregatire BAC Matematica",
  },
  {
    legacyId: "cm0vojdvi002qi7d6kzfcr1hf",
    videoFolder: "ecuatii inecuatii - elemente de trigonometrie - radiani",
    id: "1014791322",
    title:
      "Ecuatii si inecuatii, elemente de trigonometrie, radiani - Prepi Pregatire BAC Matematica",
  },
  {
    legacyId: "cm0vojdvi002qi7d6kzfcr1hf",
    videoFolder:
      "ecuatii si inecuatii - elemente de trigonometrie - functii trigonometrice",
    id: "1014790831",
    title:
      "Ecuatii si inecuatii, elemente de trigonometrie, functii trigonometrice - Prepi Pregatire BAC Mate",
  },
  {
    legacyId: "cm0vojohv005fi7d6xw1ep5av",
    videoFolder: "derivate - prezentare generala",
    id: "1014790966",
    title: "Derivate, prezentare generala - Prepi Pregatire BAC Matematica",
  },
  {
    legacyId: "cm0vojohv005fi7d6xw1ep5av",
    videoFolder: "derivate - derivata intr-un punct, exemple",
    id: "1014790666",
    title:
      "Derivate, derivata intr-un punct, exemple - Prepi Pregatire BAC Matematica",
  },
  {
    legacyId: "cm0vojgx1003hi7d6j8db3dhj",
    videoFolder: "functia de gradul  2 - prezentare",
    id: "1014790851",
    title: "Functia de gradul 2, prezentare - Prepi Pregatire BAC Matematica",
  },
  {
    legacyId: "cm0vojgx1003hi7d6j8db3dhj",
    videoFolder: "functia de gradul 2 - forma canonica",
    id: "1014790887",
    title:
      "Functia de gradul 2, forma canonica - Prepi Pregatire BAC Matematica",
  },
  {
    legacyId: "cm0vojgx1003hi7d6j8db3dhj",
    videoFolder: "functia de gradul 2 - grafic",
    id: "1014790907",
    title: "Functia de gradul 2, grafic - Prepi Pregatire BAC Matematica",
  },
  {
    legacyId: "cm0vojgx1003hi7d6j8db3dhj",
    videoFolder: "functia de gradul 2  - semn",
    id: "1014790862",
    title: "Functia de gradul 2, semn - Prepi Pregatire BAC Matematica",
  },
  {
    legacyId: "cm0vojlig004oi7d6i8rs64lu",
    videoFolder: "limite - prezentare generala",
    id: "1014790927",
    title: "Limite, prezentare generala - Prepi Pregatire BAC Matematica",
  },
  {
    legacyId: "cm0vojnds0055i7d6zbvhvhhy",
    videoFolder: "siruri de numere - monotonie",
    id: "1014791013",
    title: "Siruri de numere - Monotonie - Prepi Pregatire BAC Matematica",
  },
  {
    legacyId: "cm0vojnds0055i7d6zbvhvhhy",
    videoFolder: "siruri de numere - marginire_final",
    id: "1014790996",
    title: "Siruri de numere - Marginire - Prepi Pregatire BAC Matematica",
  },
  {
    legacyId: "cm0vojnds0055i7d6zbvhvhhy",
    videoFolder: "siruri de numere - convergenta",
    id: "1014790947",
    title: "Siruri de numere, convergenta - Prepi Pregatire BAC Matematica",
  },
  {
    legacyId: "cm0vojnds0055i7d6zbvhvhhy",
    videoFolder: "siruri de numere - teorema weierstrass",
    id: "1014791201",
    title:
      "Siruri de numere, teorema Weierstrass - Prepi Pregatire BAC Matematica",
  },
  {
    legacyId: "cm0voj4ig000ii7d68ucfh8cq",
    videoFolder:
      "ecuatii si inecuatii - ecuatia de gradul 2- relatiile lui viete",
    id: "1014547644",
    title:
      "Ecuatia de gradul 2, relatiile lui Viete - Prepi Pregatire BAC Matematica",
  },
];

const videoToEmbed = (id: string, title: string) => {
  return `<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/${id}?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="${title}"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>`;
};

const videoTitleToHtml = (title: string) => {
  return `<div data-folder="${title}" class="prepi-video"><center>Un videoclip va apărea aici...</center></div>`;
};

// Script to match vimeo videos to db video folder names
async function migrateData() {
  try {
    // const allLegacyContent = await prisma.lessonLegacyContent.findMany({
    //   where: {
    //     html: {
    //       contains: "prepi-video",
    //     },
    //   },
    // });

    // if (allLegacyContent.length === 0) {
    //   throw new Error("No lessons found with prepi-video content");
    // }

    // console.log(
    //   `Found ${allLegacyContent.length} lessons with prepi-video content`
    // );

    // // Loop through all lessons with prepi-video content
    // type VideoList = {
    //   legacyId: string;
    //   videoFolder: string;
    // };

    // const videoList: VideoList[] = [];

    // // a html can have multiple videos
    // for (const lesson of allLegacyContent) {
    //   const html = lesson.html;
    //   const regex = /data-folder="(.+?)"/g;
    //   let match;

    //   while ((match = regex.exec(html)) !== null) {
    //     videoList.push({
    //       legacyId: lesson.id,
    //       videoFolder: match[1],
    //     });
    //   }
    // }

    // console.log(`Found ${videoList.length} videos in lessons`);

    // console.log(videoList);

    console.log(matching.length);

    for (const match of matching) {
      const legacyContent = await prisma.lessonLegacyContent.findFirst({
        where: { id: match.legacyId },
      });

      if (!legacyContent) {
        throw new Error(`Lesson not found with id: ${match.legacyId}`);
      }

      const html = legacyContent.html;

      if (!html) {
        throw new Error(`Lesson ${match.legacyId} does not have any content`);
      }

      const updatedHtml = html.replace(
        videoTitleToHtml(match.videoFolder),
        videoToEmbed(match.id, match.title),
      );

      await prisma.lessonLegacyContent.update({
        where: { id: match.legacyId },
        data: {
          html: updatedHtml,
        },
      });

      console.log(`Updated lesson ${match.legacyId}`);
    }

    // while (true) {
    //   const lessonSlug = await askQuestion("Enter the lesson slug: ");
    //   const videoTitle = await askQuestion("Enter the video title: ");
    //   const videoUrl = await askQuestion("Enter the video URL: ");

    //   const videoLesson = await prisma.lesson.findFirst({
    //     where: { slug: lessonSlug },
    //     include: {
    //       legacyContent: true,
    //     },
    //   });

    //   if (!videoLesson) {
    //     throw new Error(`Lesson not found with slug: ${lessonSlug}`);
    //   }

    //   const html = videoLesson.legacyContent?.html;

    //   if (!html) {
    //     throw new Error(`Lesson ${lessonSlug} does not have any content`);
    //   }

    //   const updatedHtml = html.replace(
    //     videoTitleToHtml(videoTitle),
    //     videoUrlToEmbed(videoUrl)
    //   );

    //   await prisma.lessonLegacyContent.update({
    //     where: { id: videoLesson.legacyContent?.id },
    //     data: {
    //       html: updatedHtml,
    //     },
    //   });
    // }

    // You can add more collections to migrate here
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export default migrateData;
