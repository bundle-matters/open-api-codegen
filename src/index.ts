import path from 'path';
import AdmZip from 'adm-zip';
import { readFile, ensureDir, copySync, emptyDirSync, removeSync } from 'fs-extra';
import { minimatch } from 'minimatch';
import { existsSync } from 'fs';

async function fetchJsonData(url: string) {
  const { default: fetch } = await import('node-fetch');

  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }

    if (!path.isAbsolute(url)) {
      url = path.join(process.cwd(), url);
    }

    const fileData = await readFile(url, 'utf8');
    try {
      const data = JSON.parse(fileData);
      return data;
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

interface OpenAPIPullBaseOptions {
  /**
   * glob pattern to keep files
   */
  include?: string;
}

interface OpenAPIPullServerOptions extends OpenAPIPullBaseOptions {
  lang?: 'aspnetcore'
  | 'go-server'
  | 'inflector'
  | 'java-vertx'
  | 'jaxrs-cxf'
  | 'jaxrs-cxf-cdi'
  | 'jaxrs-di'
  | 'jaxrs-jersey'
  | 'jaxrs-resteasy'
  | 'jaxrs-resteasy-eap'
  | 'jaxrs-spec'
  | 'kotlin-server'
  | 'micronaut'
  | 'nodejs-server'
  | 'python-flask'
  | 'scala-akka-http-server'
  | 'spring';
  type: 'SERVER';
}

interface OpenAPIClientPullOptions extends OpenAPIPullBaseOptions{
  lang?: 'csharp'
  | 'csharp-dotnet2'
  | 'dart'
  | 'dynamic-html'
  | 'go'
  | 'html'
  | 'html2'
  | 'java'
  | 'javascript'
  | 'jaxrs-cxf-client'
  | 'kotlin-client'
  | 'openapi'
  | 'openapi-yaml'
  | 'php'
  | 'python'
  | 'r'
  | 'ruby'
  | 'scala'
  | 'swift3'
  | 'swift4'
  | 'swift5'
  | 'typescript-angular'
  | 'typescript-axios'
  | 'typescript-fetch';
  type: 'CLIENT';
}

// fetch json and parse as object
export async function openapiCodegen(openAPIJSONUrl: string, outputDir: string, options?: OpenAPIPullServerOptions | OpenAPIClientPullOptions) {
  const {
    lang = 'typescript-axios',
    type = 'CLIENT',
    include,
  } = options || {};

  const openapiJSON = await fetchJsonData(openAPIJSONUrl);
  const { default: fetch } = await import('node-fetch');
  const response = await fetch('https://generator3.swagger.io/api/generate', {
    method: 'POST',
    body: JSON.stringify({
      type,
      lang,
      spec: openapiJSON,
    }),
    headers: {
      Accept: 'application/octet-stream, application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
  }

  const contentDisposition = response.headers.get('content-disposition');
  const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
  const filename = filenameMatch ? filenameMatch[1] : 'unknown-file';
  if (!filename.endsWith('.zip')) {
    throw new Error(`Invalid file type: ${filename}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const extractDir = outputDir;

  if (!existsSync(extractDir)) {
    await ensureDir(extractDir);
  }
  // Backup the original directory
  const backupDir = `${outputDir}_backup`;
  copySync(outputDir, backupDir);
  console.log(`Original directory backed up to: ${backupDir}`);

  try {
    // Clear the save directory
    emptyDirSync(outputDir);
    console.log(`Save directory cleared: ${outputDir}`);

    const zip = new AdmZip(buffer);

    if (include) {
      const zipEntries = zip.getEntries();
      const matchingEntries = zipEntries.filter(entry => minimatch(entry.entryName, include));
      matchingEntries.forEach(entry => {
        const entrySavePath = path.join(extractDir, path.dirname(entry.entryName));
        zip.extractEntryTo(entry, entrySavePath, false, true);
        console.log(`Extracted file: ${entrySavePath}`);
      });
    } else {
      zip.extractAllTo(extractDir, true);
      console.log(`ZIP file extracted to: ${extractDir}`);
    }

    // Remove the backup directory
    emptyDirSync(backupDir);
    removeSync(backupDir);
    console.log(`Backup directory deleted: ${backupDir}`);
  } catch (error) {
    // Handle error
    console.error(`Error occurred while handling the file: ${error}`);

    // Rollback by restoring the backup
    emptyDirSync(outputDir);
    copySync(backupDir, outputDir);
    console.log(`Rollback: Original directory restored: ${outputDir}`);

    // Remove the backup directory
    emptyDirSync(backupDir);
    removeSync(backupDir);
    console.log(`Rollback: Backup directory deleted: ${backupDir}`);
  }
}
