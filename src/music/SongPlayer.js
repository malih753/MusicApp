import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';
import TrackPlayer from 'react-native-track-player';

const SongPlayer = ({
  songsList,
  current,
  playPauseTrack,
  progress,
  isVisible,
  onClose,
}) => {
  const [play, setplay] = useState(false);
  const [currentSong, setCurrentSong] = useState(current);
  const format = seconds => {
    let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <Modal isVisible={isVisible} style={{margin: 0}}>
      <LinearGradient colors={['#97a5db', '#3349a1']} style={{flex: 1}}>
        <TouchableOpacity
          style={{marginTop: 20, marginLeft: 20}}
          onPress={() => {
            onClose();
          }}>
          <Image
            source={require('../../src/images/down.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Image source={songsList[currentSong].artwork} style={styles.art} />
        <Text style={styles.cur}>{songsList[currentSong].title}</Text>
        <Text style={styles.cur1}>{songsList[current].artist}</Text>
        <Slider
          style={{width: '90%', height: 60, alignSelf: 'center'}}
          minimumValue={progress.position}
          maximumValue={progress.duration}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
        />
        <View
          style={{
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: 20,
          }}>
          <Text style={{color: 'white'}}>{format(progress.position)}</Text>
          <Text style={{color: 'white'}}>{format(progress.duration)}</Text>
        </View>
        <View
          style={{
            width: '100%',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexDirection: 'row',
            alignSelf: 'center',
            marginTop: 30,
          }}
          onPress={async () => {
            if (currentSong > 0) {
              await TrackPlayer.skip(currentSong - 1);
              await TrackPlayer.play();
              setCurrentSong(currentSong - 1);
            }
          }}>
          <TouchableOpacity>
            <Image
              source={require('../../src/images/previous.png')}
              style={{width: 40, height: 40, tintColor: 'white'}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              playPauseTrack();
            }}>
            {!play ? (
              <Image
                source={require('../../src/images/pla.png')}
                style={styles.btn}
              />
            ) : (
              <Image
                source={require('../../src/images/pa.png')}
                style={styles.btn1}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              await TrackPlayer.skip(currentSong + 1);
              await TrackPlayer.play();
              setCurrentSong(currentSong + 1);
            }}>
            <Image
              source={require('../../src/images/next.png')}
              style={{width: 40, height: 40, tintColor: 'white'}}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Modal>
  );
};

export default SongPlayer;

const styles = StyleSheet.create({
  icon: {
    width: 18,
    height: 18,
    tintColor: 'white',
  },
  cur: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
    marginLeft: 20,
    marginTop: 15,
  },
  art: {
    width: '80%',
    height: '35%',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 5,
    alignSelf: 'center',
  },
  cur1: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginLeft: 20,
  },
  btn: {
    width: 40,
    height: 40,
    marginLeft: 10,
    marginRight: 10,
  },
  btn1: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
    tintColor: 'white',
  },
});
