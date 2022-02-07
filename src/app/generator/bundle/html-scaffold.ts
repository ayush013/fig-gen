const getHTMLScaffold = (markup: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com" />
    </head>
    <body>
        ${markup}
    </body>
    </html>`;
};

export default getHTMLScaffold;
