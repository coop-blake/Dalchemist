import path from "path";

import url from "url";
export function resolveHtmlPath(htmlFileName: string, hash: string = "") {
  if (process.env.NODE_ENV === "development") {
    console.log("getIndexPath:htmlFileName", htmlFileName);

    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    // url.hash=hash
    console.log("getIndexPath:url.href", url.href);

    return url.href + "#" + hash;
  }
  console.log(
    "getIndexPath:file",
    __dirname,
    `file://${
      path.join(path.resolve(__dirname, "../renderer/", htmlFileName)) +
      "#" +
      hash
    }`
  );

  // return `file://${
  //   path.join(path.resolve(__dirname, "../renderer/", htmlFileName)) +
  //   "#" +
  //   hash
  // }`;

  return url.format({
    protocol: "file",
    slashes: true,
    hash: hash,
    pathname: path.join(path.resolve(__dirname, "../renderer/", htmlFileName)),
  });
}

export function onReady(doThis: () => void) {
  document.readyState === "complete" || document.readyState === "interactive"
    ? doThis()
    : document.addEventListener("DOMContentLoaded", () => {
        doThis();
      });
}

export function show(domNodeId: string) {
  onReady(() => {
    const domNode = document.getElementById(domNodeId);
    console.log("show", domNode);

    if (domNode) {
      domNode.style.setProperty("display", "block");
    }
  });
}

export function hide(domNodeId: string) {
  onReady(() => {
    const domNode = document.getElementById(domNodeId);
    console.log("hdiing", domNode);
    if (domNode) {
      domNode.style.setProperty("display", "none");
    }
  });
}

export function formatTimestampToMinute(timestamp: number) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function formatDateForConsole(datetime: number): string {
  const lastRefreshDate = new Date(datetime);
  const formattedDate = lastRefreshDate.toLocaleString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return formattedDate;
}
