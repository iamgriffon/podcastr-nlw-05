import { createContext, ReactNode, useState, useContext } from "react";

interface Episode {
  title: string,
  thumbnail: string,
  members: string,
  publishedAt: string,
  duration: number,
  url: string,
}

interface PlayerContextData {
  episodeList: Episode[];
  currentEpisodeIndex: number,
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  play: (episode: Episode) => void;
  togglePause: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  setPlayingState: (isPlaying: boolean) => void;
  clearPlayingState: () => void;
  playList: (list: Episode[], index: number) => void;
  hasNext: boolean;
  hasPrevious: boolean;
  playNext: () => void;
  playPrevious: () => void;
}

interface PlayerContextProviderProps {
  children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setIsPlaying(true);
    setCurrentEpisodeIndex(0);
  }

  function togglePause() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop(){
    setIsLooping(!isLooping)
  }

  function toggleShuffle(){
    setIsShuffling(!isShuffling)
  }
  
  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function clearPlayingState(){
    setEpisodeList([]);
    setCurrentEpisodeIndex(0)
  };

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length

  function playNext() {
    if (isShuffling){
      const nextRandomEpisode = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisode);

    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevious() {
    const nextEpisodeIndex = currentEpisodeIndex - 1;
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }


  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        toggleLoop,
        togglePause,
        toggleShuffle,
        play,
        setPlayingState,
        clearPlayingState,
        playList,
        hasNext,
        hasPrevious,
        playNext,
        playPrevious
      }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext);
}
  