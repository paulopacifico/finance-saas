import { readFile } from "node:fs/promises";
import path from "node:path";

type TemplateKind = "tailwind" | "html";

type TemplateFrameProps = {
  template: TemplateKind;
};

async function loadTemplateHtml(template: TemplateKind) {
  const folder = template === "tailwind" ? "Tailwind-template" : "HTML-template";
  const htmlPath = path.join(process.cwd(), folder, "index.html");
  const html = await readFile(htmlPath, "utf8");

  if (template === "tailwind") {
    return html;
  }

  const cssPath = path.join(process.cwd(), folder, "styles.css");
  const css = await readFile(cssPath, "utf8");
  return html.replace(
    /<link rel="stylesheet" href="\.\/styles\.css">\s*/i,
    `<style>${css}</style>\n`,
  );
}

export async function TemplateFrame({ template }: TemplateFrameProps) {
  const html = await loadTemplateHtml(template);
  const title = template === "tailwind" ? "Finflow Tailwind Template" : "Finflow HTML Template";

  return (
    <section className="h-screen w-full overflow-hidden">
      <iframe
        title={title}
        srcDoc={html}
        className="h-full w-full border-0"
        sandbox="allow-scripts allow-same-origin"
      />
    </section>
  );
}
