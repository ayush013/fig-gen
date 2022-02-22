const TAILWIND_CDN = `<script src="https://cdn.tailwindcss.com"><\/script>`;

// Basic HTML scaffold for the generated markup
const getHTMLScaffold = (markup: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${TAILWIND_CDN}
    </head>
    <body>
        ${markup}
    </body>
    </html>`;
};

export default getHTMLScaffold;
