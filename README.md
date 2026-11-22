# HTMAA 2025 Course Blog

A course blog for HTMAA (How to Make Almost Anything) 2025, built with [Eleventy](https://www.11ty.dev/) static site generator.

- **Website (GitHub Pages)**: https://chuanqisun.github.io/htmaa-2025/
- **Mirror (MIT GitLab Pages)**: https://fab.cba.mit.edu/classes/863.25/people/SunChuanqi/

## Quick Start

### Prerequisites

- Node.js (v20 or higher)
- npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd htmaa-2025
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## Writing Posts

### Creating a New Post

1. Create a new Markdown file in `src/posts/` following the naming convention:

   ```
   src/posts/week-XX/index.md
   ```

2. Use the following frontmatter template (reference `src/posts/week-00-template.txt`):

   ```markdown
   ---
   title: Replace with Real Title
   date: YYYY-MM-DD
   keywords: ["keyword1"]
   ---

   Your content here...
   ```

### Adding Media Files

- Place images and other media in `src/posts/week-XX/media/`
- FreeCAD models can be stored in `src/posts/week-XX/models/`
- Supported formats: `.webp`, `.FCStd`, `.txt` files are automatically copied during build. Additional formats should be configured in `.eleventy.js`.

### Post Structure

- **Title**: Displayed as the post heading
- **Date**: Used for sorting and display (format: YYYY-MM-DD)
- **Keywords**: Tags for categorization and filtering
- **Content**: Written in Markdown with support for syntax highlighting

## Available Scripts

- `npm run dev` - Start development server with live reload (automatically cleans and rebuilds)
- `npm run build` - Build the site for production (defaults to GitLab)
- `npm run build:github` - Build the site for GitHub Pages (`pathPrefix: /htmaa-2025/`)
- `npm run build:gitlab` - Build the site for the MIT GitLab mirror (`pathPrefix: /classes/863.25/people/SunChuanqi/`)
- `npm run clean` - Remove generated `public/posts` directory

## Project Structure

```
├── src/                    # Source files
│   ├── _includes/         # Eleventy templates
│   │   ├── base.njk      # Base HTML template
│   │   ├── post.njk      # Post template
│   │   └── partials/     # Reusable template parts
│   ├── posts/            # Blog posts (Markdown)
│   │   ├── posts.json    # Post configuration
│   │   ├── week-00-template.txt # Template for new posts
│   │   └── week-XX/      # Individual week folders
│   │       ├── index.md  # Post content
│   │       ├── media/    # Images and media files
│   │       └── models/   # 3D models (FreeCAD files)
│   ├── index.md          # Homepage content
│   └── style.css         # Styles
├── public/               # Generated site output
├── .eleventy.js          # Eleventy configuration
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## Features

- **Static Site Generation**: Fast, secure, and SEO-friendly
- **Syntax Highlighting**: Code blocks with Shiki highlighter supporting JS, TS, HTML, CSS, YAML, JSON, and more
- **RSS Feed**: Automatically generated at `/feed.xml`
- **Responsive Design**: Mobile-friendly layout
- **Live Reload**: Automatic browser refresh during development
- **Media Support**: Automatic copying of images (.webp), models (.FCStd), and text files
- **MIT Deployment Ready**: Configured for MIT Fab Academy deployment

## Customization

### Styling

Edit `src/style.css` to customize the appearance. The site uses IBM Plex Mono font from Google Fonts.

### Templates

Modify templates in `src/_includes/` to change the layout and structure:

- `base.njk` - Main HTML structure
- `post.njk` - Individual post layout
- `partials/nav.njk` - Navigation component

### Configuration

Adjust site settings in `.eleventy.js` including:

- Input/output directories (src → public)
- Plugin configuration (RSS, HTML base, syntax highlighting)
- Custom filters and functions
- Path prefix for MIT Fab Academy deployment
- File passthrough for media assets

## Dependencies

- **@11ty/eleventy** - Static site generator
- **@11ty/eleventy-plugin-rss** - RSS feed generation
- **shiki** - Syntax highlighting
- **prettier** - Code formatting

## Deployment

This blog is automatically deployed to both GitHub Pages and the MIT GitLab mirror via GitHub Actions on pushes to `master`:

- **GitHub Pages** (`npm run build:github`):
  - URL: https://chuanqisun.github.io/htmaa-2025/
  - Path prefix: `/htmaa-2025/`
- **MIT GitLab Mirror** (`npm run build:gitlab`):
  - URL: https://fab.cba.mit.edu/classes/863.25/people/SunChuanqi/
  - Repository: https://gitlab.cba.mit.edu/classes/863.25/people/SunChuanqi
  - Path prefix: `/classes/863.25/people/SunChuanqi/`

To deploy manually, run the corresponding build script and publish the `public/` directory contents.

## Prompt

The `README.md` can be re-generated with the following prompt:

> Scan the content of the repo to write a minimum README.md to help other developers use this repo.

## License

MIT License
