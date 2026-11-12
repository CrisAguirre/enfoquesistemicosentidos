import { useRef, useState, useEffect } from 'react';
import './CustomVideoPlayer.css';

export default function CustomVideoPlayer({ src, poster }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(p || 0);
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    videoRef.current.volume = vol;
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      videoRef.current.volume = volume > 0 ? volume : 1;
      setVolume(videoRef.current.volume);
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className={`custom-video-container ${isFullscreen ? 'fullscreen' : ''}`} ref={containerRef}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="custom-video"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      ></video>
      
      <div className="video-controls">
        <button className="control-btn" onClick={togglePlay}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        
        <div className="progress-container" onClick={handleProgressClick}>
          <div className="progress-bar">
            <div className="progress-filled" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <div className="volume-control">
          <button className="control-btn" onClick={toggleMute}>
            {isMuted ? '🔇' : '🔊'}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
        
        <button className="control-btn" onClick={toggleFullscreen}>
          {isFullscreen ? '↙️' : '⛶'}
        </button>
      </div>
    </div>
  );
}
