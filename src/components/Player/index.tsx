import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { usePlayer } from '../../context/PlayerContext';
import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const { episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    togglePause,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    clearPlayingState,
    hasNext,
    hasPrevious,
    playNext,
    playPrevious
  } = usePlayer();

  const episode = episodeList[currentEpisodeIndex];

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  function setupProgressListener(){
    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    })
  }

  function handleSlide(amount: number){
    audioRef.current.currentTime = amount;
    setProgress(amount);
  };

  function handleEpisodeEnded(){
    if (hasNext) {
      playNext();
    } else {
      clearPlayingState();
    }
  }

  return (
    <div className={styles.playerContainer}>
      <Head>
        <title>Podcastr | Home</title>
      </Head>
      
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para tocar</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress ?? 0)}</span>
          <div className={styles.slider}>
            {episode ?
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSlide}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9475ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              /> : <div className={styles.emptySlider} />
            }
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode &&
          <audio
            src={episode.url}
            ref={audioRef} autoPlay
            loop={isLooping}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
            onEnded={handleEpisodeEnded} />
          }

        <div className={styles.buttons}>
          <button
            type='button'
            disabled={!episode || episodeList.length == 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}>
            <img src="/shuffle.svg" alt="Aleatório" />
          </button>
          <button type='button' disabled={!episode || !hasPrevious} onClick={playPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type='button'
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePause}>
            {isPlaying
              ? <img src="/pause.svg" alt="Pausar episódio" />
              : <img src="/play.svg" alt="Tocar episódio" />
            }
          </button>
          <button type='button' disabled={!episode || !hasNext} onClick={playNext}>
            <img src="/play-next.svg" alt="Tocar a próxima" />
          </button>
          <button
            type='button'
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>

        </div>
      </footer>

    </div>
  );
}