import { HtmlBasePlugin, IdAttributePlugin, InputPathToUrlTransformPlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import path from "path"; // Import path module to check extensions easily
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
  eleventyConfig.addPassthroughCopy("src/**/*.{webp,step,FCStd,txt,svg,mp3,wav,mp4,cpp,ino,3mf,obj,zip,dxf,sbp}", { mode: "html-relative" });
  eleventyConfig.addPassthroughCopy("src/**/code/**/*", { mode: "html-relative" });

  // Ignore specific files from template processing
  eleventyConfig.ignores.add("src/**/code/**");

  eleventyConfig.addFilter("humanDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US");
  });
  eleventyConfig.addFilter("machineDate", (dateObj) => {
    return new Date(dateObj).toISOString();
  });

  const highlighter = await createHighlighter({
    themes: ["dark-plus"],
    langs: ["js", "jsx", "ts", "tsx", "html", "css", "diff", "yaml", "json", "cpp", "sh"],
  });

  // Custom markdown-it plugin to handle images and mp4 videos
  function customMediaPlugin(md) {
    const defaultRender =
      md.renderer.rules.image ||
      function (tokens, idx, options, env, renderer) {
        return renderer.renderToken(tokens, idx, options);
      };

    md.renderer.rules.image = function (tokens, idx, options, env, renderer) {
      const token = tokens[idx];
      const src = token.attrGet("src");
      const alt = token.content;

      // Check if the source is an MP4 file
      if (src && path.extname(src).toLowerCase() === ".mp4") {
        // Return a video tag
        // You can add class names or other attributes here if needed
        return `<video src="${src}" controls title="${alt}"></video>`;
      }

      // --- Standard Image Handling ---

      // Add loading="lazy" if not already present
      if (!token.attrGet("loading")) {
        token.attrSet("loading", "lazy");
      }

      // Add decoding="async" if not already present
      if (!token.attrGet("decoding")) {
        token.attrSet("decoding", "async");
      }

      return defaultRender(tokens, idx, options, env, renderer);
    };
  }

  // ref: https://www.hoeser.dev/blog/2023-02-07-eleventy-shiki-simple/
  eleventyConfig.amendLibrary("md", (md) => {
    md.set({
      highlight: (code, lang) => highlighter.codeToHtml(code, { lang, theme: "dark-plus" }),
    });

    // Add the custom media plugin (renamed from lazyImagesPlugin)
    md.use(customMediaPlugin);
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
