import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  FlatList,
  State,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {songsList} from './src/Songs';
import TrackPlayer, {
  Capability,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import SongPlayer from './src/music/SongPlayer';

export default function App() {
  const [current, setCurrent] = useState(0);
  const [playerInitialized, setPlayerInitialized] = useState(false); // Add this state
  const [play, setplay] = useState(false); // Add this state
  const [isVisible, setIsVisible] = useState(false);
  const progress = useProgress();
  useEffect(() => {
    setPlayer();
  }, []);

  const setPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause],
      });
      await TrackPlayer.add(songsList);
      setPlayerInitialized(true); // Set the playerInitialized state to true
    } catch (e) {
      console.error('Error setting up player:', e);
    }
  };
  const playPauseTrack = async directPlay => {
    // console.log(playerInitialized);
    if (!playerInitialized) {
      console.error('Player is not initialized yet');
      return;
    } else {
      if (play) {
        await TrackPlayer.pause();
        setplay(!play);
      } else {
        await TrackPlayer.play();
        setplay(!play);
      }
    }
  };
  useEffect(() => {
    // if (isPlaying()) {
    if (progress.position.toFixed(0) == progress.duration.toFixed(0)) {
      if (current < songsList.length) setCurrent[current + 1];
    }
    // }
  }, [progress]);

  return (
    <LinearGradient colors={['#2600ff', '#540979']} style={styles.container}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <Image source={require('./src/images/left.png')} style={styles.img} />
      <View style={styles.input}>
        <View style={styles.txt}>
          <Image
            source={require('./src/images/search.png')}
            style={styles.icon}
          />
          <Text style={styles.name}>Find in Playlist</Text>
        </View>
        <View style={styles.sort}>
          <Text style={styles.sortname}>Sort</Text>
        </View>
      </View>
      <Image source={songsList[current].artwork} style={styles.showimg} />
      <Text style={styles.cur}>{songsList[current].title}</Text>
      <View style={styles.spotify}>
        <Image
          source={require('./src/images/spotify.png')}
          style={styles.spo}
        />
        <Text style={styles.spoName}>English Song</Text>
      </View>
      <View style={styles.count}>
        <Text style={styles.cot}>20,187 saves</Text>
        <Text style={styles.cot}>46h 34 m</Text>
      </View>
      <View style={styles.bar}>
        <View style={styles.left}>
          <Image
            source={require('./src/images/spo.png')}
            style={styles.lefticon}
          />
          <Image
            source={require('./src/images/arrowdown.png')}
            style={styles.lefticon}
          />
          <Image
            source={require('./src/images/more.png')}
            style={styles.lefticon}
          />
        </View>
        <View style={styles.right}>
          <Image
            source={require('./src/images/shuffle.png')}
            style={styles.lefticon}
          />
          <TouchableOpacity
            onPress={() => {
              playPauseTrack();
            }}>
            {!play ? (
              <Image
                source={require('./src/images/play.png')}
                style={styles.btn}
              />
            ) : (
              <Image
                source={require('./src/images/pause.png')}
                style={styles.btn1}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={songsList}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              style={styles.list}
              onPress={async () => {
                await TrackPlayer.pause();
                await TrackPlayer.skip(index);
                await TrackPlayer.play();
                setCurrent(index);
              }}>
              <View style={styles.show}>
                <Image source={item.artwork} style={styles.art} />
                <View style={styles.nameshow}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.title}>{item.artist}</Text>
                </View>
                {index == current && !play && (
                  <Image
                    source={require('./src/images/spotify.png')}
                    style={{
                      width: 18,
                      height: 18,
                      marginLeft: 20,
                    }}
                  />
                )}
              </View>
              <Image
                source={require('./src/images/more.png')}
                style={styles.option}
              />
            </TouchableOpacity>
          );
        }}
      />
      <TouchableOpacity
        activeOpacity={1}
        style={{
          width: '100%',
          height: 70,
          position: 'absolute',
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          flexDirection: 'row',
        }}
        onPress={() => {
          setIsVisible(true);
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={songsList[current].artwork}
            style={{
              width: 54,
              height: 54,
              alignItems: 'center',
              paddingLeft: 50,
              paddingRight: 20,
              marginTop: 10,
              marginLeft: 10,
              borderRadius: 5,
              justifyContent: 'space-between',
            }}
          />

          <View style={styles.nameshow}>
            <Text style={[styles.title, {marginLeft: 10, marginTop: 10}]}>
              {songsList[current].title}
            </Text>
            <Text style={[styles.title, {marginLeft: 13, marginTop: 2}]}>
              {songsList[current].artist}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={{marginLeft: 70, marginTop: 25}}
          onPress={() => {
            playPauseTrack();
          }}>
          {!play ? (
            <Image
              source={require('./src/images/play.png')}
              style={styles.btn}
            />
          ) : (
            <Image
              source={require('./src/images/pause.png')}
              style={styles.btn1}
            />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
      <SongPlayer
        songsList={songsList}
        current={current}
        playPauseTrack={playPauseTrack}
        progress={progress}
        isVisible={isVisible}
        onClose={() => {
          setIsVisible(false);
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  img: {
    width: 24,
    height: 24,
    tintColor: 'white',
    marginTop: 30,
    marginLeft: 20,
  },
  container: {
    flex: 1,
  },
  input: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
  },
  txt: {
    width: '80%',
    height: 37,
    backgroundColor: 'white',
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
  },
  icon: {
    width: 18,
    height: 18,
  },
  name: {
    color: 'black',
    marginLeft: 10,
  },
  sort: {
    width: '15%',
    height: 37,
    backgroundColor: 'white',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  sortname: {
    fontWeight: 'bold',
  },
  showimg: {
    width: '70%',
    height: '35%',
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 3,
    resizeMode: 'cover',
  },
  spotify: {
    flexDirection: 'row',
    paddingLeft: 30,
    marginTop: 20,
  },
  spo: {
    width: 18,
    height: 18,
  },
  spoName: {
    color: 'white',
    fontSize: 14,
    marginLeft: 10,
  },
  count: {
    flexDirection: 'row',
    paddingLeft: 30,
    marginTop: 10,
  },
  cot: {
    color: 'white',
    fontSize: 12,
    marginLeft: 10,
  },
  bar: {
    flexDirection: 'row',
    width: '90%',
    marginTop: 10,
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
  },
  lefticon: {
    width: 18,
    height: 18,
    tintColor: 'white',
    marginLeft: 20,
  },
  btn: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  list: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
  },
  art: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  show: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: 'white',
  },
  nameshow: {
    marginLeft: 10,
  },
  option: {
    width: 18,
    height: 18,
    tintColor: 'white',
  },
  btn1: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
    tintColor: 'white',
  },
  cur: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
    marginLeft: 20,
    marginTop: 5,
  },
});
