import { Octokit } from "@octokit/rest";
import { consola } from "consola";
import { remark } from "remark";
import type { Project } from "./types";
import { METADATA } from "./remark-plugins/metadata";

export interface Env {
  GITHUB_TOKEN: string;
}

interface GitTree {
  /** @description The file referenced in the tree. */
  path?: string;
  /**
   * @description The file mode; one of `100644` for file (blob), `100755` for executable (blob), `040000` for subdirectory (tree), `160000` for submodule (commit), or `120000` for a blob that specifies the path of a symlink.
   * @enum {string}
   */
  mode?: "100644" | "100755" | "040000" | "160000" | "120000";
  /**
   * @description Either `blob`, `tree`, or `commit`.
   * @enum {string}
   */
  type?: "blob" | "tree" | "commit";
  /**
   * @description The SHA1 checksum ID of the object in the tree. Also called `tree.sha`. If the value is `null` then the file will be deleted.
   *
   * **Note:** Use either `tree.sha` or `content` to specify the contents of the entry. Using both `tree.sha` and `content` will return an error.
   */
  sha?: string | null;
  /**
   * @description The content you want this file to have. GitHub will write this blob out and use that SHA for this entry. Use either this, or `tree.sha`.
   *
   * **Note:** Use either `tree.sha` or `content` to specify the contents of the entry. Using both `tree.sha` and `content` will return an error.
   */
  content?: string;
};

export default {
  async fetch(
    _request,
    _ctx,
  ): Promise<Response> {
    const url = `https://cron.projectrc.luxass.dev`;

    const ogUrl = new URL(
      `https://image.luxass.dev/api/image/text?input=${encodeURIComponent(
        JSON.stringify({
          width: 300,
          height: 300,
          text: "🛠️",
        }),
      )}`,
    );
    return new Response(/* html */ `
    <!DOCTYPE html>
    <html lang="en" class="dark">
      <head>
        <!-- global metadata -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <link rel="icon" href="/favicon.ico">

        <!-- primary meta tags -->
        <title>cron job | projectrc.luxass.dev</title>
        <meta name="title" content="cron job | projectrc.luxass.dev">
        <meta name="description" content="A Cloudflare worker to update my projects">

        <!-- open graph -->
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="cron.projectrc.luxass.dev">
        <meta property="og:url" content="${url}">
        <meta property="og:title" content="cron job | projectrc.luxass.dev">
        <meta property="og:description" content="A Cloudflare worker to update my projects">
        <meta property="og:image" content="${ogUrl}" />

        <!-- twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="${url}">
        <meta property="twitter:title" content="cron job | projectrc.luxass.dev">
        <meta property="twitter:description" content="A Cloudflare worker to update my projects">
        <meta property="twitter:image" content="${ogUrl}" />
        <style>
          *,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:var(--un-default-border-color, #e5e7eb)}html{line-height:1.5;-webkit-text-size-adjust:100%;text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}*,:before,:after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }@font-face{font-family:Lexend;font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/lexend/v19/wlptgwvFAVdoq2_F94zlCfv0bz1WCzsWzLhnepKu.woff2) format("woff2");unicode-range:U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB}@font-face{font-family:Lexend;font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/lexend/v19/wlptgwvFAVdoq2_F94zlCfv0bz1WCzsWzLlnepKu.woff2) format("woff2");unicode-range:U+0100-02AF,U+0304,U+0308,U+0329,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20CF,U+2113,U+2C60-2C7F,U+A720-A7FF}@font-face{font-family:Lexend;font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/s/lexend/v19/wlptgwvFAVdoq2_F94zlCfv0bz1WCzsWzLdneg.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}.my{margin-top:1rem;margin-bottom:1rem}.mb-8{margin-bottom:2rem}.inline-block{display:inline-block}.h2{height:.5rem}.min-h-250px{min-height:250px}.flex{display:flex}.flex-1{flex:1 1 0%}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-center{justify-content:center}.p-4{padding:1rem}.text-2xl{font-size:1.5rem!important;line-height:2rem!important}.font-sans{font-family:Lexend,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"}html{touch-action:manipulation;scroll-behavior:smooth;font-size:1rem;line-height:1.5rem;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}body{margin-left:1rem!important;margin-right:1rem!important;min-height:100vh;max-width:42rem;min-height:100dvh;display:flex;flex-direction:column;justify-content:space-between;--un-bg-opacity:1;background-color:rgb(245 245 245 / var(--un-bg-opacity));padding-top:2rem;padding-bottom:2rem;font-family:Lexend,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";--un-text-opacity:1;color:rgb(38 38 38 / var(--un-text-opacity))}.dark body{--un-bg-opacity:1;background-color:rgb(23 23 23 / var(--un-bg-opacity));--un-text-opacity:1;color:rgb(212 212 212 / var(--un-text-opacity))}@media (min-width: 768px){body{margin-left:auto!important;margin-right:auto!important}}
        </style>
      </head>
      <body class="font-sans">
        <main class="flex-1 p-4 flex flex-col items-center justify-center">
          <h1 class="text-2xl">wheeeeeeep</h1>
          <p class="mb-8 text-2xl">mention @robobub on github for a surprise 🐰</p>
        </main>
      </body>
    </html>`, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  },
  async scheduled(_event, env, _ctx) {
    const ICONS = new Map<string, string>();

    const octokit = new Octokit({ auth: env.GITHUB_TOKEN });

    const { data: commits } = await octokit.repos.listCommits({
      owner: "luxass",
      repo: "luxass.dev",
      per_page: 1, // Get only the latest commit
    });

    const latestCommitSHA = commits[0].sha;

    const contentPath = "src/content/projects";

    const { data: { tree: projectsTree } } = await octokit.git.getTree({
      owner: "luxass",
      repo: "luxass.dev",
      tree_sha: `main:${contentPath}`,
      recursive: "1",
    });

    const updatedTree: GitTree[] = projectsTree
      .filter(({ type, path }) => type === "blob" && !path?.endsWith(".gitkeep"))
      .map(({ path, mode, type }) => ({
        path: `${contentPath}/${path}`,
        sha: null,
        mode: mode as GitTree["mode"],
        type: type as GitTree["type"],
      }));

    const { projects } = await fetch(
      "https://projectrc.luxass.dev/api/projects.json",
    ).then((res) => res.json() as Promise<{ projects: Project[] }>);

    if (!projects) {
      consola.error("no projects found");
      return;
    }

    for (const project of projects.filter((project) => project.readme)) {
      const fileName = project.name.replace(/^\./, "").replace(/\./g, "-");
      if (!project.readme) {
        consola.warn(`no README found for ${project.name}`);
        continue;
      }

      const readmeContent: unknown = await fetch(project.readme, {
        headers: {
          "X-MDX": "true",
        },
      }).then((res) => res.json());

      if (!readmeContent || typeof readmeContent !== "object" || !("content" in readmeContent) || typeof readmeContent.content !== "string") {
        consola.error(`No README found for ${project.name}`);
        continue;
      }
      const file = await remark()
        .use(METADATA, {
          name: project.name,
          icons: ICONS,
        })
        .process(readmeContent.content || "No README was found.");

      const frontmatter = `---
                  handle: ${project.name}
                  name: ${project.name}
                  owner: ${project.nameWithOwner.split("/")[0]}
                  ${project.description ? `description: ${project.description}` : ""}
                  githubUrl: ${project.url}
                  ${project.npm ? `npm: "${project.npm.name}"` : ""}
                  ${ICONS.has(project.name) ? `icon: ${ICONS.get(project.name)}` : ""}
                  ---`
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join("\n");

      // check if updatedTree already contains the file based on fileName
      const existingFile = updatedTree.find((file) => file.path === `${contentPath}/${fileName}.mdx`);

      if (!existingFile) {
        updatedTree.push({
          path: `${contentPath}/${fileName}.mdx`,
          mode: "100644",
          type: "blob",
          content: `${frontmatter}\n\n${file.toString()}`,
        });
        consola.success(`added ${fileName}`);
      } else {
        if (existingFile?.sha === null) {
          delete existingFile?.sha;
        }

        existingFile!.content = `${frontmatter}\n\n${file.toString()}`;
        consola.success(`updated ${fileName}`);
      }
    }

    const newTree = await octokit.git.createTree({
      owner: "luxass",
      repo: "luxass.dev",
      base_tree: latestCommitSHA,
      tree: updatedTree,
    });

    const newCommit = await octokit.git.createCommit({
      owner: "luxass",
      repo: "luxass.dev",
      message: "chore: update list of projects",
      tree: newTree.data.sha,
      parents: [latestCommitSHA],
    });

    await octokit.git.updateRef({
      owner: "luxass",
      repo: "luxass.dev",
      ref: "heads/main",
      sha: newCommit.data.sha,
    });
  },
} satisfies ExportedHandler<Env>;
