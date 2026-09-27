export class FileBlobDownloader {
  public download(
    jsonString: string,
    filename: string = `kaizenflow-backup-${new Date().toISOString().split("T")[0]}.json`
  ): boolean {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return false;
    }

    try {
      const blob = new Blob([jsonString], {
        type: "application/json;charset=utf-8;",
      });
      const url =
        typeof URL !== "undefined" && typeof URL.createObjectURL === "function"
          ? URL.createObjectURL(blob)
          : `data:application/json;charset=utf-8,${encodeURIComponent(jsonString)}`;

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (
        typeof URL !== "undefined" &&
        typeof URL.revokeObjectURL === "function" &&
        !url.startsWith("data:")
      ) {
        URL.revokeObjectURL(url);
      }
      return true;
    } catch (err) {
      console.error("[FileBlobDownloader] Failed to initiate file download:", err);
      return false;
    }
  }
}

export const fileBlobDownloader = new FileBlobDownloader();
