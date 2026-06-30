import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Persistent re-engagement notifications. A dense, varied set of daily nudges
// (repeating every day) plus a weekly Jumu'ah reminder — re-armed on every app
// launch so they never silently lapse.

const CHANNEL = 'reminders';

// Resolve trigger-type enums lazily (inside functions) rather than at module
// load, so importing this file can never throw during app startup.
const triggerTypes = () => Notifications.SchedulableTriggerInputTypes || {};

// Show notifications even when the app is foregrounded.
export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

async function ensureChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL, {
    name: 'Daily reminders',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#E6C27A',
    bypassDnd: false,
  });
}

// Several touchpoints a day, each repeating daily. The evening one moves to the
// user's wind-down time.
const DAILY_NUDGES = [
  { id: 'dawn', h: 7, m: 30, title: 'Begin with Him 🌅', body: 'One minute with the Quran before the day pulls you away.' },
  { id: 'midday', h: 12, m: 30, title: 'A pause for your soul 🤍', body: 'Take a breath and a verse. Your streak is waiting.' },
  { id: 'afternoon', h: 17, m: 0, title: 'Don’t break the chain 🔥', body: 'You’ve come too far to miss today. Tap to keep your streak alive.' },
  { id: 'night', h: 22, m: 30, title: 'Your night recitation awaits 🌙', body: 'Wind down with tonight’s surah. Press play.' },
  { id: 'lastcall', h: 22, m: 55, title: 'Last call for today 🌌', body: 'A single ayah keeps the streak — and the habit — alive.' },
];

function windDownTime(w) {
  switch (w) {
    case 'early': return { h: 21, m: 30 };
    case 'late': return { h: 0, m: 30 };
    case 'varies': return { h: 22, m: 0 };
    case 'mid':
    default: return { h: 22, m: 30 };
  }
}

// (Re)schedule the full reminder set. Safe to call repeatedly — it clears and
// rebuilds. Returns the number of notifications scheduled (0 if no permission).
export async function scheduleReminders(opts = {}) {
  try {
    setupNotificationHandler();
    await ensureChannel();

    const perm = await Notifications.getPermissionsAsync();
    const ok = perm.granted || perm.ios?.status === Notifications.IosAuthorizationStatus?.PROVISIONAL;
    if (!ok) return 0;

    await Notifications.cancelAllScheduledNotificationsAsync();

    const { DAILY, WEEKLY } = triggerTypes();
    const wind = windDownTime(opts.winddown);
    const nudges = DAILY_NUDGES.map((n) => (n.id === 'night' ? { ...n, h: wind.h, m: wind.m } : n));

    let count = 0;
    for (const n of nudges) {
      await Notifications.scheduleNotificationAsync({
        content: { title: n.title, body: n.body, sound: 'default' },
        trigger: { type: DAILY, hour: n.h, minute: n.m, channelId: CHANNEL },
      });
      count++;
    }

    // Weekly Jumu'ah (Friday) — expo weekday is 1=Sun … 7=Sat, so Friday = 6.
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Jumu’ah · Surah Al-Kahf 🕊️',
        body: 'It’s Friday — recite Al-Kahf for light until the next.',
        sound: 'default',
      },
      trigger: { type: WEEKLY, weekday: 6, hour: 9, minute: 0, channelId: CHANNEL },
    });
    count++;

    return count;
  } catch (e) {
    return 0;
  }
}

export async function cancelReminders() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {}
}
