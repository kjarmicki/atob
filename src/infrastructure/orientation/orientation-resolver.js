import browserOrientationProvider from './browser-orientation-provider';
import cordovaOrientationProvider from './cordova-orientation-provider';

export default function orientationResolver(window) {
    if(cordovaOrientationProvider.isAvailable(window)) return cordovaOrientationProvider(window);
    if(browserOrientationProvider.isAvailable(window)) return browserOrientationProvider(window);
    throw new Error('No orientation provider available');
}