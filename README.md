# HTMAA 2025 Course Blog

A course blog for HTMAA (How to Make Almost Anything) 2025, built with [Eleventy](https://www.11ty.dev/) static site generator.

## Quick Start

### Prerequisites

- Node.js (v20 or higher)
- npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd blog
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

> [!WARNING]
> We output files into a `/gitlab` dir, a sibling to `/blog`. The dev and build scripts will delete some of the files in the `/gitlab` dir. Make sure you have version control setup properly or you will lose data.

```bash
npm run dev
```

The site will be available at `http://localhost:8080` with live reload enabled.

## Writing Posts

### Creating a New Post

1. Create a new Markdown file in `src/posts/` following the naming convention:

   ```
   src/posts/week-X-topic.md
   ```

2. Use the following frontmatter template:

   ```markdown
   ---
   title: Your Post Title
   date: YYYY-MM-DD
   keywords: ["tag1", "tag2"]
   ---

   Your content here...
   ```

3. You can reference the template file at `src/posts/20000101-template.txt`

### Post Structure

- **Title**: Displayed as the post heading
- **Date**: Used for sorting and display (format: YYYY-MM-DD)
- **Keywords**: Tags for categorization and filtering
- **Content**: Written in Markdown with support for syntax highlighting

## Available Scripts

- `npm run dev` - Start development server with live reload
- `npm run build` - Build the site for production
- `npm run clean` - Remove generated files

## Project Structure

```
├── src/                    # Source files
│   ├── _includes/         # Eleventy templates
│   │   ├── base.njk      # Base HTML template
│   │   ├── post.njk      # Post template
│   │   └── partials/     # Reusable template parts
│   ├── posts/            # Blog posts (Markdown)
│   ├── index.md          # Homepage content
│   └── style.css         # Styles
├── .eleventy.js          # Eleventy configuration
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## Features

- **Static Site Generation**: Fast, secure, and SEO-friendly
- **Syntax Highlighting**: Code blocks with Shiki highlighter
- **RSS Feed**: Automatically generated at `/feed.xml`
- **Responsive Design**: Mobile-friendly layout
- **Live Reload**: Automatic browser refresh during development

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

- Input/output directories
- Plugin configuration
- Custom filters and functions

## Dependencies

- **@11ty/eleventy** - Static site generator
- **@11ty/eleventy-plugin-rss** - RSS feed generation
- **shiki** - Syntax highlighting
- **prettier** - Code formatting

## Deployment

We manually build the project into a sibling `/gitlab` directory, manually commit and push from there. The GitLab CI script will handle the deployment upon commit.

## Prompt

The `README.md` can be re-generated with the following prompt:

> Scan the content of the repo to write a minimum README.md to help other developers use this repo.

## License

MIT License
