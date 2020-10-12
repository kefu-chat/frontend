export function askNotificationPermission(): Promise<string> {
  return new Promise(
    (resolve: (result: string) => void, reject: () => void): void => {
      const permissionResult = Notification.requestPermission(
        (result: string) => {
          resolve(result);
        }
      );

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    }
  );
}

export function playIncomingAudio(): void {
  const audio = new Audio();
  audio.src = "/assets/music/receive-message.mp3";
  audio.load();
  audio.play();
}

export function playOutcomingAudio(): void {
  const audio = new Audio();
  audio.src = "/assets/music/post-message.mp3";
  audio.load();
  audio.play();
}
