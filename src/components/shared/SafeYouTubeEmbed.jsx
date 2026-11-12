export default function SafeYouTubeEmbed({ videoId, title, message = '' }) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className="safe-youtube-embed">
      <div className="video-container">
        <iframe
          src={embedUrl}
          title={title || 'Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="youtube-fallback">
        <span>⚠ No ves el video? Algunos videos no permiten reproducirse dentro de esta página por decisión de su autor.</span>
        <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          ▶ Abrir video en YouTube
        </a>
        {message && <p className="youtube-fallback-note">{message}</p>}
      </div>
    </div>
  );
}