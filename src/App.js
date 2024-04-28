import {
  Check,
  Fullscreen,
  FullscreenExit,
  Pause,
  PlayArrow,
  VolumeDown,
  VolumeOff,
  VolumeUp,
} from "@mui/icons-material";
import { Slider } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import { cn, formatTime } from "./utils/func";

function App() {
  const ref = useRef(null);
  const [count, setCount] = useState(0); // for hide control bar
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [config, setConfig] = useState({
    playbackRate: 1.0,
    volumeValue: 100,
    isFullscreen: false,
    loop: false,
    pip: false, // Picture in Picture (the browser support this feature, not need to make it true)
  });

  const [videoInfo, setVideoInfo] = useState({
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    videoTitle: "Big Buck Bunny",
    streamer: {
      name: "Chicken Streamer",
      avatar: "",
      // more info
    },
  });

  const [fnControl, setFnControl] = useState({
    playVideo: () => playVideo(),
    pauseVideo: () => pauseVideo(),
    seekToTime: (time) => seekToTime(time),
    handleVolumeChange: (value) => handleVolumeChange(value),
    onFullScreen: () => onFullScreen(),
    onExitFullScreen: () => onExitFullScreen(),
    handlePlaybackRateChange: (value) => handlePlaybackRateChange(value),
  });

  const handleVolumeChange = (value) => {
    setConfig({ ...config, volumeValue: value });
  };

  const playVideo = () => {
    setIsPlaying(true);
  };

  const pauseVideo = () => {
    setIsPlaying(false);
  };

  const seekToTime = (time) => {
    setCurrentTime(time);
    ref.current.seekTo(time);
  };

  const onFullScreen = () => {
    const element = document.getElementById("frame");
    if (screenfull.isEnabled) {
      screenfull.request(element);
      setConfig({ ...config, isFullscreen: true });
    }
  };

  const onExitFullScreen = () => {
    if (screenfull.isEnabled) {
      screenfull.exit();
      setConfig({ ...config, isFullscreen: false });
    }
  };

  const handlePlaybackRateChange = (value) => {
    console.log("playback rate change to", value);
    setConfig({ ...config, playbackRate: value });
  };

  return (
    <div className="w-screen h-screen relative flex flex-col items-center">
      <div className="font-sans w-full h-14 bg-purple-500 flex items-center px-4">
        <h6 className="text-white font-bold">Livestreaming website</h6>
      </div>
      <div
        className="w-[1080px] relative"
        id="frame"
        onMouseMove={() => {
          setCount(0);
        }}
      >
        <ReactPlayer
          ref={ref}
          url={videoInfo.videoUrl}
          muted={config.volumeValue === 0 ? true : false}
          volume={config.volumeValue / 100}
          playing={isPlaying}
          width={"100%"}
          height={"100%"}
          playbackRate={config.playbackRate}
          loop={config.loop}
          onProgress={(state) => {
            setCount(count + 1);

            setLoaded(state.loaded);
            setCurrentTime(state.playedSeconds);
          }}
          onSeek={(time) => {
            // if (!playControl.isPlaying)
            //   setPlayControl({ ...playControl, isPlaying: true });
          }}
          onDuration={(duration) => {
            setDuration(duration);
          }}
        />
        <FrontOfVideo
          isPlaying={isPlaying}
          currentTime={currentTime}
          loaded={loaded}
          config={config}
          fnControl={fnControl}
          duration={duration}
          videoInfo={videoInfo}
          className={count > 3 ? "hidden" : "visible"}
        />
      </div>
    </div>
  );
}

function FrontOfVideo({
  isPlaying,
  currentTime,
  loaded,
  config,
  fnControl,
  duration,
  videoInfo,
  className,
}) {
  return (
    <div
      className={cn(
        "absolute top-0 w-full h-full flex flex-col items-center justify-end",
        className
      )}
    >
      <div className="absolute top-2 left-4 text-white font-bold font-sans">
        {videoInfo.streamer.name}
      </div>
      <div
        className="h-full w-full flex items-center justify-center"
        onMouseUp={() => {
          if (isPlaying) {
            if (fnControl.pauseVideo) fnControl.pauseVideo();
          } else {
            if (fnControl.playVideo) fnControl.playVideo();
          }
        }}
      >
        {!isPlaying && (
          <PlayArrow
            sx={{ fontSize: 100 }}
            className="text-white cursor-pointer"
          />
        )}
      </div>

      <VideoControl
        isPlaying={isPlaying}
        currentTime={currentTime}
        loaded={loaded}
        config={config}
        fnControl={fnControl}
        duration={duration}
      />
    </div>
  );
}

function VideoControl({
  isPlaying,
  currentTime,
  loaded,
  config,
  fnControl,
  duration,
  className,
}) {
  return (
    <div
      className={cn(
        "w-11/12 h-fit pb-4 bg-transparent flex flex-col items-center justify-center",
        className
      )}
    >
      <VideoTracking
        className="w-full"
        isPlaying={isPlaying}
        currentTime={currentTime}
        loaded={loaded}
        config={config}
        fnControl={fnControl}
        duration={duration}
      />
      <VideoControlButtons
        className="w-full"
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        config={config}
        fnControl={fnControl}
      />
    </div>
  );
}

function VideoTracking({
  className,
  isPlaying,
  currentTime,
  loaded,
  config,
  duration,
  fnControl,
}) {
  return (
    <div
      className={cn(
        "w-full bg-transparent flex items-center justify-center",
        className
      )}
    >
      <Slider
        value={duration !== 0 ? (currentTime / duration) * 100 : 0}
        onChange={(e) => {
          if (fnControl.seekToTime) {
            fnControl.seekToTime((e.target.value / 100) * duration);
          }
        }}
        size="small"
      />
    </div>
  );
}

function VideoControlButtons({
  className,
  isPlaying,
  currentTime,
  duration,
  config,
  fnControl,
}) {
  return (
    <div
      className={cn(
        "w-full flex flex-row items-center justify-between text-white",
        className
      )}
    >
      <div className="flex flex-row items-center gap-6">
        <div
          onClick={() => {
            if (isPlaying) {
              if (fnControl.pauseVideo) fnControl.pauseVideo();
            } else {
              if (fnControl.playVideo) fnControl.playVideo();
            }
          }}
        >
          {isPlaying ? (
            <Pause
              sx={{ fontSize: 24 }}
              className="text-white cursor-pointer"
            />
          ) : (
            <PlayArrow
              sx={{ fontSize: 24 }}
              className="text-white cursor-pointer"
            />
          )}
        </div>
        <VolumeButton onVolumeChange={fnControl.handleVolumeChange} />
        <span className="text-white">
          {formatTime(currentTime)}/{formatTime(duration)}
        </span>
      </div>

      <div className="flex flex-row items-center gap-4">
        <RateCombobox
          options={[1, 1.5, 2, 2.5]}
          value={config.playbackRate}
          onChange={fnControl.handlePlaybackRateChange}
        />

        <div
          onClick={() => {
            if (screenfull.isFullscreen) {
              if (fnControl.onExitFullScreen) fnControl.onExitFullScreen();
            } else {
              if (fnControl.onFullScreen) fnControl.onFullScreen();
            }
          }}
        >
          {config.isFullscreen ? (
            <FullscreenExit
              sx={{ fontSize: 24 }}
              className="text-white cursor-pointer"
            />
          ) : (
            <Fullscreen
              sx={{ fontSize: 24 }}
              className="text-white cursor-pointer"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function VolumeButton({ onVolumeChange }) {
  const [volumeValue, setVolumeValue] = useState(100);
  const [currentVolume, setCurrentVolume] = useState(100);

  const handleVolumeChange = (value) => {
    setVolumeValue(value);
    if (onVolumeChange) onVolumeChange(value);
  };

  useEffect(() => {
    if (volumeValue !== 0) setCurrentVolume(volumeValue);
  }, [volumeValue]);

  return (
    <div className="w-[120px] flex flex-row items-center gap-4">
      <div
        className="text-white cursor-pointer"
        onClick={() => {
          if (volumeValue === 0) handleVolumeChange(currentVolume);
          else handleVolumeChange(0);
        }}
      >
        {volumeValue === 0 && <VolumeOff sx={{ fontSize: 24 }} />}
        {volumeValue > 0 && volumeValue < 50 && (
          <VolumeDown sx={{ fontSize: 24 }} />
        )}
        {volumeValue >= 50 && <VolumeUp sx={{ fontSize: 24 }} />}
      </div>
      <Slider
        value={volumeValue}
        onChange={(e) => handleVolumeChange(e.target.value)}
        size="small"
      />
    </div>
  );
}

const RateCombobox = ({ options, value, onChange }) => {
  const [showOptions, setShowOptions] = useState(false);
  const handleValueChange = (value) => {
    if (onChange) onChange(value);
    setShowOptions(false);
  };

  return (
    <div className="relative flex flex-row items-center justify-center gap-4 cursor-pointer">
      <div
        className={cn("text-white cursor-pointer")}
        onClick={() => setShowOptions(!showOptions)}
      >
        {value + "x"}
      </div>
      {showOptions && (
        <div className="absolute bottom-full w-fit h-fit px-1 py-1 bg-black/70 flex flex-col items-center rounded-md">
          {options.map((option) => (
            <div
              key={option}
              value={option}
              className={cn(
                "text-white border-0 outline-none cursor-pointer flex flex-row items-center justify-start gap-2 hover:bg-white/20 rounded"
              )}
              onClick={() => handleValueChange(option)}
            >
              <span className="w-[20px]">
                {value === option ? <Check /> : null}
              </span>
              <p className="w-[70px]">{option + "x"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
