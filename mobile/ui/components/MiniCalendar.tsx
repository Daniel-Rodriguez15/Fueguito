import { Pressable, StyleSheet, Text, View } from 'react-native'
import { activeDaysInMonth, streakInfo, type NightLogState } from '@/domain/night-log'
import { Flame } from './Flame'
import { colors, fonts, radii } from '../theme'

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

function todayLocal(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

/** Compact current-month streak view for the home screen. */
export function MiniCalendar({ log, onPress }: { log: NightLogState; onPress: () => void }) {
  const today = todayLocal()
  const year = Number(today.slice(0, 4))
  const month = Number(today.slice(5, 7))
  const yearMonth = today.slice(0, 7)

  const activeDays = new Set(activeDaysInMonth(log, yearMonth).map((d) => Number(d.slice(8, 10))))
  const streak = streakInfo(log, today)
  const todayDay = Number(today.slice(8, 10))

  const daysInMonth = new Date(year, month, 0).getDate()
  const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7
  const cells: Array<number | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) {
    cells.push(null)
  }

  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Flame size={22 + Math.min(streak.length, 30) * 0.6} intensity={streak.length} />
          <Text style={styles.title}>Racha</Text>
        </View>
        <Text style={[styles.streak, streak.atRisk && styles.streakRisk]}>
          {streak.atRisk
            ? 'Juega hoy o la pierden'
            : streak.length > 0
              ? `${streak.length} ${streak.length === 1 ? 'día' : 'días'}`
              : 'Enciéndanla hoy'}
        </Text>
      </View>
      <View style={styles.weekRow}>
        {WEEKDAYS.map((d, index) => (
          <Text key={index} style={styles.weekday}>
            {d}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((day, index) => {
          if (day === null) {
            return <View key={index} style={styles.cell} />
          }
          const active = activeDays.has(day)
          const isToday = day === todayDay
          return (
            <View key={index} style={styles.cell}>
              {active ? (
                <Flame size={26} label={String(day)} intensity={streak.length} />
              ) : isToday ? (
                <Flame size={26} label={String(day)} variant="outline" />
              ) : (
                <Text style={styles.dayText}>{day}</Text>
              )}
            </View>
          )
        })}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 14,
    borderRadius: radii.medium,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
    gap: 8,
  },
  cardPressed: {
    borderColor: colors.fire,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: fonts.medium,
    color: colors.text,
    fontSize: 15,
  },
  streak: {
    fontFamily: fonts.medium,
    color: colors.fire,
    fontSize: 13,
  },
  streakRisk: {
    color: colors.fireBright,
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    color: colors.textDim,
    fontSize: 10,
    fontFamily: fonts.medium,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 11,
    color: colors.textDim,
    fontVariant: ['tabular-nums'],
  },
})
