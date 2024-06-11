import filesViwerCSS from "./filesViewer.module.css";

let serverAddress = localStorage.getItem("targetUrl");
function renderFilePreview(filename) {
  const extension = filename?.split(".")?.pop()?.toLowerCase();
  return (
    <a target="_blank" download href={`${serverAddress}uploads/${filename}`}>
      {extension == "png" ||
      extension == "jpg" ||
      extension == "jpeg" ||
      extension == "gif" ||
      extension == "webp" ||
      extension == "svg" ||
      extension == "jfif" ? (
        <ImagePreview filename={filename} />
      ) : extension === "pdf" ? (
        <PdfPreview filename={filename} />
      ) : extension === "ppt" || extension === "pptx" ? (
        <PptPreview filename={filename} />
      ) : extension === "doc" || extension === "docx" ? (
        <WordPreview filename={filename} />
      ) : extension === "mp4" ||
        extension === "webm" ||
        extension === "mkv" ||
        extension === "mov" ? (
        <VideoPreview filename={filename} />
      ) : extension === "mp3" ||
        extension === "wav" ||
        extension === "m4a" ||
        extension === "ogg" ||
        extension === "flac" ||
        extension === "aac" ? (
        <AudioPreview filename={filename} />
      ) : (
        <DefaultPreview filename={filename} />
      )}
    </a>
  );
}
function ImagePreview({ filename }) {
  return (
    <img
      className={filesViwerCSS.filesSize}
      src={serverAddress + "uploads/" + filename}
    />
  );
}

function PdfPreview({ filename }) {
  return (
    <div class={filesViwerCSS.container}>
      <iframe
        className={filesViwerCSS.filesSize}
        src={serverAddress + "uploads/" + filename}
      ></iframe>
      <div
        onClick={() => window.open(serverAddress + "uploads/" + filename)}
        class={filesViwerCSS.overlay}
      ></div>
    </div>
  );
}

function PptPreview({ filename }) {
  return (
    <div class={filesViwerCSS.container}>
      <iframe
        className={filesViwerCSS.filesSize}
        src={serverAddress + "uploads/" + filename}
      ></iframe>
      <div
        onClick={() => window.open(serverAddress + "uploads/" + filename)}
        class={filesViwerCSS.overlay}
      ></div>
    </div>
  );
}

function WordPreview({ filename }) {
  return (
    <div class={filesViwerCSS.container}>
      <iframe
        className={filesViwerCSS.filesSize}
        // src={serverAddress + "uploads/" + filename}
      ></iframe>
      <div
        onClick={() => window.open(serverAddress + "uploads/" + filename)}
        class={filesViwerCSS.overlay}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "black",
            textDecoration: "none",
          }}
        >
          Word File
        </span>
      </div>
    </div>
  );
}

function VideoPreview({ filename }) {
  return (
    <div class={filesViwerCSS.container}>
      <video controls className={filesViwerCSS.filesSize}>
        <source src={serverAddress + "uploads/" + filename} type="video/mp4" />
        <source src={serverAddress + "uploads/" + filename} type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <div
        onClick={() => window.open(serverAddress + "uploads/" + filename)}
        class={filesViwerCSS.overlay}
      ></div>
    </div>
  );
}

function AudioPreview({ filename }) {
  return (
    <div class={filesViwerCSS.container}>
      <audio className={filesViwerCSS.filesSize} controls>
        <source src={serverAddress + "uploads/" + filename} type="audio/mp3" />
        <source src={serverAddress + "uploads/" + filename} type="audio/wav" />
        Your browser does not support the audio tag.
      </audio>
      <div
        onClick={() => window.open(serverAddress + "uploads/" + filename)}
        class={filesViwerCSS.overlay}
      ></div>
    </div>
  );
}

function DefaultPreview({ filename }) {
  // className={filesViwerCSS.filesSize}
  return (
    <div class={filesViwerCSS.container}>
      <i className={"far fa-file " + filesViwerCSS.filesSize}></i>
      <div
        onClick={() => window.open(serverAddress + "uploads/" + filename)}
        class={filesViwerCSS.overlay}
      ></div>
    </div>
  );
}
export default renderFilePreview;
