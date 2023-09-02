import path from "path"
export function resolveHtmlPath(htmlFileName: string) {
    if (process.env.NODE_ENV === "development") {
      console.log("getIndexPath:htmlFileName", htmlFileName);
  
      const port = process.env.PORT || 1212;
      const url = new URL(`http://localhost:${port}`);
      url.pathname = htmlFileName;
      console.log("getIndexPath:url.href", url.href);
  
      return url.href;
    }
    console.log(
      "getIndexPath:file",
      __dirname,
      `file://${path.resolve(__dirname, "../renderer/", htmlFileName)}`
    );
  
    return `file://${path.resolve(__dirname, "../renderer/", htmlFileName)}`;
  }
  

  