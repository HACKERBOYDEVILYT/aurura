# 📱 ARURA Android Application Architecture & Setup Guide

Arura Android is engineered with modern Android development standards (100% Kotlin + Jetpack Compose, Material 3, Clean Architecture, and AndroidX Media3).

---

## 1. Tech Stack Overview
* **Language**: Kotlin 2.0+
* **UI**: 100% Jetpack Compose with Material Design 3
* **Architecture**: Clean Architecture + MVVM + Multi-Module
* **Media Playback**: AndroidX Media3 ExoPlayer (`media3-exoplayer`, `media3-ui`, `media3-session`)
* **Dependency Injection**: Google Dagger Hilt (`hilt-android`)
* **Asynchronous Flow**: Kotlin Coroutines + StateFlow / SharedFlow
* **Networking**: Retrofit 2 + OkHttp 4 (with Bearer token interceptor)
* **Local Persistence**: Android Room Database + Jetpack DataStore (Preferences)
* **Image Loading**: Coil Compose (with caching & crossfade)
* **Background Sync**: Android Jetpack WorkManager (offline downloads & EPG cache updates)

---

## 2. Multi-Module Project Structure

```
arura-android/
├── app/                        # Application entry point, App class, Navigation graph
├── core/
│   ├── designsystem/          # Material 3 dark cinematic theme, fonts, buttons, cards
│   ├── network/               # Retrofit client, OkHttp interceptors, JWT refresh authenticator
│   ├── database/              # Room database, DAOs, TypeConverters for offline caching
│   ├── model/                 # Shared domain entity models (MediaItem, Channel, User)
│   └── player/                # Modular AndroidX Media3 ExoPlayer engine, MediaSessionService
├── feature/
│   ├── home/                  # Featured carousel, trending movies, horizontal trays
│   ├── bangla/                # Dedicated Bangla Hub, actor chips (Nisho, Chanchal)
│   ├── player/                # Fullscreen video player, quality selector, subtitle picker
│   ├── livetv/                # 24/7 channel list and horizontal EPG timeline
│   ├── sports/                # Live cricket/football scorecards and stream view
│   ├── youtube/               # Vertical Shorts feed & YouTube Music background mode
│   ├── discovery/             # Natural language AI Mood Recommendation prompt view
│   └── library/               # User watchlist, continue watching progress, offline downloads
└── build-logic/               # Convention plugins for Gradle Kotlin DSL
```

---

## 3. Media3 ExoPlayer Engine Configuration

```kotlin
@AndroidEntryPoint
class PlaybackService : MediaSessionService() {
    private var mediaSession: MediaSession? = null

    override fun onCreate() {
        super.onCreate()
        val player = ExoPlayer.Builder(this)
            .setSeekBackIncrementMs(10000)
            .setSeekForwardIncrementMs(10000)
            .setTrackSelector(DefaultTrackSelector(this))
            .build()

        mediaSession = MediaSession.Builder(this, player).build()
    }

    override fun onGetSession(controllerInfo: MediaSession.ControllerInfo): MediaSession? {
        return mediaSession
    }

    override fun onDestroy() {
        mediaSession?.run {
            player.release()
            release()
            mediaSession = null
        }
        super.onDestroy()
    }
}
```

---

## 4. Building & Running the Android App
```bash
# Clone the repository
git clone https://github.com/ayanislam/arura-streaming.git

# Navigate to android folder and build debug APK
cd android
./gradlew assembleDebug

# Run unit tests
./gradlew testDebugUnitTest
```
