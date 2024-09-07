export function codeA(path?: string, name?: string) {
  return `
<a download href="${path}/${name}">
  Download ${name}
</a>
`.trim();
}

export function codeImg(path?: string, name?: string) {
  return `
<img src="${path}/${name}" />
`.trim();
}

export function codeImport(path?: string, name?: string) {
  return `
import ${name?.split(".")?.[0]} from "${path}/${name}";
`.trim();
}
