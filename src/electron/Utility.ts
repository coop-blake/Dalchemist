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
  

export  function onReady(doThis: () => void) {
    document.readyState === "complete" || document.readyState === "interactive"
      ? doThis()
      : document.addEventListener("DOMContentLoaded", () => {
          doThis();
        });
  }

export function show(domNodeId : string){
  onReady(() => {
    const domNode = document.getElementById(domNodeId)
    console.log("show", domNode)

    if(domNode)
    {
      domNode.style.setProperty("display", "block")
    }
  })
}

export function hide(domNodeId : string){
  onReady(() => {
    const domNode = document.getElementById(domNodeId)
console.log("hdiing", domNode)
    if(domNode)
    {
      domNode.style.setProperty("display", "none")
    }
  })
}


export function formatTimestampToMinute(timestamp: number) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
