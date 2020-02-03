console.log('page builder called');

import fs from 'fs';
import pageData from './src/data/pageData.mjs';

// index.html template
const buildIndexFile = (data) => {

    let indexfileLocation = '`${location.origin}/?p=${location.pathname.substring(1)}`';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>${data.title}</title>

    <!-- to prevent caching -->
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="-1">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 11:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">

    <!-- general page metadata -->
    <meta name="author" content="Rik Roots">
    <meta name="description" content="${data.title} - ${data.description}">

    <!-- Facebook metadata -->

    <!-- Twitter metadata -->

</head>
<body>
    <script>
        location.href = ${indexfileLocation};
    </script>
</body>
</html>`;
};

// This function creates the directory if it doesn't already exist
const checkDirectory = (dir) => {

    return new Promise((resolve, reject) => {

        fs.access(dir, fs.constants.F_OK, (err) => {

            if (err) fs.mkdir(dir, { recursive: false }, (err) => {

                if (err) reject(`failed to create ${dir}`);
                else resolve(`created ${dir}`);
            });

            else resolve(`${dir} already exists and can access`);
        });
    });
};

// This function generates index pages
const writeIndexFile = (data) => {

    return new Promise((resolve, reject) => {

        fs.open(`${data.directory}/index.html`, 'wx', (fileError, fd) => {

            if (fileError && fileError.code !== 'EEXIST') reject(`error for ${data.directory}/index.html - ${fileError.code}, ${fileError.message}`);

            fs.writeFile(`${data.directory}/index.html`, buildIndexFile(data), 'utf8', (writeError) => {

                if (writeError) reject(`failed to write ${data.directory}/index.html file: ${writeError.code}, ${writeError.message}`);

                else resolve(`${data.directory}/index.html file updated`)
            });
         });
    });
};

// Process the router base pages index files
pageData.forEach(page => {

    checkDirectory(page.directory)
    .then(res => writeIndexFile(page))
    .then(res => console.log(res))
    .catch(err => console.log(err));
});

console.log('\npage builder completed');
