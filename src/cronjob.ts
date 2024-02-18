import { Octokit } from "@octokit/rest";
import consola from "consola";
import { remark } from "remark";
import type { Env, GitTree, Project } from "./types";
import { ICON } from "./remark-plugins/icon";

export async function runCronjob(env: Env) {
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
      .use(ICON, {
        name: project.name,
        icons: ICONS,
      })
      .process(readmeContent.content || "No README was found.");

    if (project.description) {
      const emoji = project.description.match(/\p{Emoji}/u);
      if (emoji) {
        if (!ICONS.has(project.name)) {
          ICONS.set(project.name, emoji[0]);
        }
        project.description = project.description.replace(emoji[0], "").trim();
      }
    }

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

  const projectsTreePaths = projectsTree.map((file) => file.path);
  const changes = updatedTree.filter((file) => {
    // If the sha is null and the file exists in projectsTree, it should be deleted
    if (file.sha === null && projectsTreePaths.includes(file.path?.replace(`${contentPath}/`, ""))) {
      return true;
    }

    if (file.content && !projectsTreePaths.includes(file.path?.replace(`${contentPath}/`, ""))) {
      return true;
    }

    if (file.content && projectsTreePaths.includes(file.path?.replace(`${contentPath}/`, ""))) {
      return true;
    }

    return false;
  });

  if (changes.length === 0) {
    consola.info("no changes detected");
    return;
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
}
