/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useReducer, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

declare var global: {HermesInternal: null | {}};

import ReactNativeBiometrics from 'react-native-biometrics';

type State = {
  isSensorAvailable: string;
  biometricType: string;
};

const biometricTypeReducer = (state: any, action: any): State => {
  switch (action.type) {
    case ReactNativeBiometrics.TouchID:
      return {isSensorAvailable: 'Yes', biometricType: 'TouchID'};
    case ReactNativeBiometrics.FaceID:
      return {isSensorAvailable: 'Yes', biometricType: 'FaceID'};
    case ReactNativeBiometrics.Biometrics:
      return {isSensorAvailable: 'Yes', biometricType: 'Biometrics'};
    case 'UNKNOWN':
      return {isSensorAvailable: 'No', biometricType: '-'};
    default:
      return {isSensorAvailable: 'No', biometricType: '-'};
  }
};

const initReactNativeBiometrics = (dispatch: any) => {
  ReactNativeBiometrics.isSensorAvailable()
    .then(resultObject => {
      const {available, biometryType} = resultObject;
      if (!available) {
        dispatch({type: 'UNKNOWN'});
        return;
      }

      console.log('biometryType', biometryType);
      dispatch({type: biometryType});
    })
    .catch(error => {
      dispatch({type: 'UNKNOWN'});
      console.log('Biometrics error:', error);
    });
};

const createKeys = () => {
  console.log('create keys!');
  ReactNativeBiometrics.createKeys()
    .then(resultObject => {
      const {publicKey} = resultObject;
      console.log(publicKey);
    })
    .catch(err => console.log(err));
};

const promptFingerprint = () => {
  ReactNativeBiometrics.simplePrompt({
    promptMessage: 'Confirm fingerprint',
    allowDeviceCredential: true,
  })
    .then(resultObject => {
      const {success} = resultObject;

      if (success) {
        console.log('successful biometrics provided');
      } else {
        console.log('user cancelled biometric prompt');
      }
    })
    .catch(() => {
      console.log('biometrics failed');
    });
};

const checkBiometricKeysExist = () => {
  ReactNativeBiometrics.biometricKeysExist().then(resultObject => {
    const {keysExist} = resultObject;

    if (keysExist) {
      console.log('Keys exist');
    } else {
      console.log('Keys do not exist or were deleted');
    }
  });
};

const deleteKeys = () => {
  ReactNativeBiometrics.deleteKeys().then(resultObject => {
    const {keysDeleted} = resultObject;

    if (keysDeleted) {
      console.log('Successful deletion');
    } else {
      console.log('Unsuccessful deletion because there were no keys to delete');
    }
  });
};

const createSignature = () => {
  let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
  let payload = epochTimeSeconds + 'some message';

  console.log('Signing payload:', payload);

  ReactNativeBiometrics.createSignature({
    promptMessage: 'Sign in',
    payload: payload,
    allowDeviceCredential: true,
  })
    .then(resultObject => {
      const {success, signature} = resultObject;

      if (success) {
        console.log(signature);
      } else {
        console.log('create signature failed :(');
      }
    })
    .catch(error => {
      console.log('Signature failed', error);
    });
};

const App = () => {
  const [state, dispatch] = useReducer(biometricTypeReducer, {
    isSensorAvailable: '-',
    biometricType: '-',
  });

  useEffect(() => {
    initReactNativeBiometrics(dispatch);
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>
                BiometricIsSensorAvailable
              </Text>
              <Text>
                <Text style={styles.subtitle}>Available: </Text>
                <Text style={styles.highlight}>
                  {state.isSensorAvailable}{' '}
                </Text>{' '}
                |{'  '}
                <Text style={styles.subtitle}>Type: </Text>
                <Text style={styles.highlight}>{state.biometricType}</Text>
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <TouchableOpacity
                style={styles.sectionItem}
                onPress={promptFingerprint}>
                <Text style={styles.sectionTitle}>1. SimplePrompt</Text>
                <Text style={styles.subtitle}>Prompt for FingerPrint</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sectionContainer}>
              <TouchableOpacity style={styles.sectionItem} onPress={createKeys}>
                <Text style={styles.sectionTitle}>2. CreateKeys</Text>
                <Text style={styles.subtitle}>
                  Console log generated public key
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sectionContainer}>
              <TouchableOpacity
                style={styles.sectionItem}
                onPress={checkBiometricKeysExist}>
                <Text style={styles.sectionTitle}>3. BiometricKeysExist</Text>
                <Text style={styles.subtitle}>
                  Console log presence of biometric keys
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sectionContainer}>
              <TouchableOpacity style={styles.sectionItem} onPress={deleteKeys}>
                <Text style={styles.sectionTitle}>4. DeleteKeys</Text>
                <Text style={styles.subtitle}>
                  Delete biometric keys (see console log)
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sectionContainer}>
              <TouchableOpacity
                style={styles.sectionItem}
                onPress={createSignature}>
                <Text style={styles.sectionTitle}>5. CreateSignature</Text>
                <Text style={styles.subtitle}>
                  Sign a sample payload (see console log)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    margin: 16,
    paddingHorizontal: 8,
  },
  sectionItem: {
    padding: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#fefefe',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  subtitle: {
    fontWeight: '300',
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
