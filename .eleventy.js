import { HtmlBasePlugin, IdAttributePlugin, InputPathToUrlTransformPlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import { createHighlighter } from "shiki";

/**
 * @import { UserConfig } from "@11ty/eleventy"
 */

/**
 * @param {UserConfig} eleventyConfig
 * @returns
 */
export default async function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
  eleventyConfig.addPlugin(IdAttributePlugin);
  eleventyConfig.addPlugin(feedPlugin, {
    type: "rss",
    outputPath: "/feed.xml",
    collection: {
      name: "post", // iterate over `collections.posts`
      limit: 10, // 0 means no limit
    },
    metadata: {
      language: "en",
      title: "HTMAA 2025 BLog",
      base: "https://fab.cba.mit.edu/classes/863.25/people/SunChuanqi/",
      author: {
        name: "Sun Chuanqi",
      },
    },
  });
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/**/*.webp", { mode: "html-relative" });
  eleventyConfig.addPassthroughCopy("src/**/*.FCStd", { mode: "html-relative" });
  eleventyConfig.addPassthroughCopy("src/**/*.txt", { mode: "html-relative" });
  eleventyConfig.addPassthroughCopy("src/**/*.svg", { mode: "html-relative" });

  eleventyConfig.addFilter("humanDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US");
  });
  eleventyConfig.addFilter("machineDate", (dateObj) => {
    return new Date(dateObj).toISOString();
  });

  const highlighter = await createHighlighter({ themes: ["dark-plus"], langs: ["js", "jsx", "ts", "tsx", "html", "css", "diff", "yaml", "json"] });
  // ref: https://www.hoeser.dev/blog/2023-02-07-eleventy-shiki-simple/
  eleventyConfig.amendLibrary("md", (md) => {
    md.set({
      highlight: (code, lang) => highlighter.codeToHtml(code, { lang, theme: "dark-plus" }),
    });
  });

  return {
    dir: {
      input: "src",
      output: "public" /* replace this with wherever your GitLab repo is, relative to this repo */,
    },
  };
}

export const config = {
  pathPrefix: "/classes/863.25/people/SunChuanqi/",
};
