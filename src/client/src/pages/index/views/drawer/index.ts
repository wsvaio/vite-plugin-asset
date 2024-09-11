export function codeDownload(path?: string, name?: string) {
  return `
<a download href="${path}/${name}">${name}</a>
`.trim();
}

export function codeImage(path?: string, name?: string) {
  return `
<img src="${path}/${name}" alt="${name}" />
`.trim();
}

export function codeVideo(path?: string, name?: string) {
  return `
<video src="${path}/${name}" controls />
`.trim();
}

export function codeAudio(path?: string, name?: string) {
  return `
<audio src="${path}/${name}" controls />
`.trim();
}

export function codeImport(path?: string, name?: string) {
  return `
import ${name?.split(".")?.[0]} from "${path}/${name}";
`.trim();
}
