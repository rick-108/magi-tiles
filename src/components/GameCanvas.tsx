diff --git a/src/components/GameCanvas.tsx b/src/components/GameCanvas.tsx
index c346b25..0000000 100644
--- a/src/components/GameCanvas.tsx
+++ b/src/components/GameCanvas.tsx
@@
-import { audioEngine } from '../utils/audioSynth';
+// Lazy-load audio engine to reduce initial bundle size and only init on first user gesture
+let audioEngine: typeof import('../utils/audioSynth').audioEngine | null = null;
+const getAudioEngine = async () => {
+  if (audioEngine) return audioEngine;
+  const mod = await import('../utils/audioSynth');
+  audioEngine = mod.audioEngine;
+  return audioEngine;
+};
@@
-  const unlockAudio = () => {
-    if (!hasAudioUnlocked.current) {
-      audioEngine.initAudioContext();
-      hasAudioUnlocked.current = true;
-    }
-  };
+  const unlockAudio = async () => {
+    if (!hasAudioUnlocked.current) {
+      const ae = await getAudioEngine();
+      ae.initAudioContext();
+      hasAudioUnlocked.current = true;
+    }
+  };
@@
-    return () => {
-      audioEngine.stopDynamicLayering();
-    };
+    return () => {
+      // stop dynamic layering if loaded
+      if (audioEngine) audioEngine.stopDynamicLayering();
+    };
   }, []);
@@
-    if (!hasGameStartedRef.current) {
-      hasGameStartedRef.current = true;
-      setGameStarted(true);
-      audioEngine.startDynamicLayering(song.bpm || 128);
-    }
+    if (!hasGameStartedRef.current) {
+      hasGameStartedRef.current = true;
+      setGameStarted(true);
+      // dynamic import audio engine and start layering
+      getAudioEngine().then((ae) => ae.startDynamicLayering(song.bpm || 128)).catch(() => {});
+    }
@@
-    audioEngine.playNote(targetTile.note.pitch, targetTile.note.duration || 0.4, precisionRating, soundStyle);
+    getAudioEngine().then((ae) => ae.playNote(targetTile.note.pitch, targetTile.note.duration || 0.4, precisionRating, soundStyle)).catch(()=>{});
@@
-    audioEngine.stopDynamicLayering();
-    audioEngine.playErrorSound();
+    if (audioEngine) audioEngine.stopDynamicLayering();
+    getAudioEngine().then((ae) => ae.playErrorSound()).catch(()=>{});
@@
-            audioEngine.stopDynamicLayering();
+            if (audioEngine) audioEngine.stopDynamicLayering();
             onBackToMenu();
           }}
@@
-                  audioEngine.stopDynamicLayering();
+                  if (audioEngine) audioEngine.stopDynamicLayering();
                   onBackToMenu();
                 }}
