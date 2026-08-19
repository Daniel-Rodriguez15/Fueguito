import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { activeDaysInMonth, streakInfo, type NightLogState } from '@/domain/night-log'
import { BackButton } from '../components/BackButton'
import { Flame } from '../components/Flame'
import { colors, fonts, radii } from '../theme'

const GAME_LABELS: Readonly<Record<string, string>> = {
  'truth-or-dare': 'Verdad o Reto',
  bottle: 'Pico Botella',
  dice: 'Dados',
  collection: 'Colección',
  'most-likely': '¿Más probable?',
  roulette: 'Contrarreloj',
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

function todayLocal(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function CalendarScreen({ log, onBack }: { log: NightLogState; onBack: () => void }) {
  const today = todayLocal()
  const [year, setYear] = useState(Number(today.slice(0, 4)))
  const [month, setMonth] = useState(Number(today.slice(5, 7)))
  const [selected, setSelected] = useState<string>(today)

  const yearMonth = `${year}-${String(month).padStart(2, '0')}`
  const activeDays = new Set(activeDaysInMonth(log, yearMonth).map((d) => Number(d.slice(8, 10))))
  const streak = streakInfo(log, today)

  const daysInMonth = new Date(year, month, 0).getDate()
  const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7 // Monday first
  const cells: Array<number | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) {
    cells.push(null)
  }

  const changeMonth = (delta: number) => {
    let nextMonth = month + delta
    let nextYear = year
    if (nextMonth < 1) {
      nextMonth = 12
      nextYear -= 1
    } else if (nextMonth > 12) {
      nextMonth = 1
      nextYear += 1
    }
    setMonth(nextMonth)
    setYear(nextYear)
  }

  const selectedGames = log.entries[selected] ?? []

  return (
    <View style={styles.screen}>
      <BackButton onBack={onBack} />
      <Text style={styles.title}>Calentadario</Text>
      <Text style={styles.streak}>
        {streak.atRisk
          ? `Racha de ${streak.length} en peligro: jueguen hoy`
          : streak.length > 0
            ? `Racha: ${streak.length} ${streak.length === 1 ? 'día' : 'días'}`
            : 'Sin racha… por ahora'}
      </Text>

      <View style={styles.monthRow}>
        <Pressable onPress={() => changeMonth(-1)} hitSlop={10}>
          <Text style={styles.monthArrow}>‹</Text>
        </Pressable>
        <Text style={styles.monthLabel}>
          {MONTH_NAMES[month - 1]} {year}
        </Text>
        <Pressable onPress={() => changeMonth(1)} hitSlop={10}>
          <Text style={styles.monthArrow}>›</Text>
        </Pressable>
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
          const date = `${yearMonth}-${String(day).padStart(2, '0')}`
          const active = activeDays.has(day)
          const isToday = date === today
          const isSelected = date === selected
          return (
            <Pressable
              key={index}
              style={[styles.cell, isSelected && styles.cellSelected, isToday && styles.cellToday]}
              onPress={() => setSelected(date)}
            >
              {active ? (
                <Flame size={28} label={String(day)} />
              ) : (
                <Text style={styles.cellDay}>{day}</Text>
              )}
            </Pressable>
          )
        })}
      </View>

      <View style={styles.detail}>
        <Text style={styles.detailTitle}>{selected === today ? 'Hoy' : selected}</Text>
        {selectedGames.length > 0 ? (
          selectedGames.map((game) => (
            <Text key={game} style={styles.detailGame}>
              {GAME_LABELS[game] ?? game}
            </Text>
          ))
        ) : (
          <Text style={styles.detailEmpty}>Noche tranquila… ¿la encendemos?</Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    gap: 10,
  },
  title: {
    fontFamily: fonts.display,
    color: colors.text,
    fontSize: 30,
    textAlign: 'center',
  },
  streak: {
    color: colors.fire,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 22,
  },
  monthArrow: {
    color: colors.text,
    fontSize: 26,
    fontFamily: fonts.medium,
    paddingHorizontal: 8,
  },
  monthLabel: {
    color: colors.text,
    fontSize: 16,
    fontFamily: fonts.medium,
    minWidth: 150,
    textAlign: 'center',
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    color: colors.textDim,
    fontSize: 12,
    fontFamily: fonts.medium,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  cellSelected: {
    backgroundColor: colors.surface,
  },
  cellToday: {
    borderWidth: 1,
    borderColor: colors.fire,
  },
  cellDay: {
    color: colors.textDim,
    fontSize: 13,
  },
  cellDayActive: {
    color: colors.text,
    fontFamily: fonts.medium,
  },
  cellFire: {
    fontSize: 10,
    marginTop: -2,
  },
  detail: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.medium,
    padding: 14,
    gap: 4,
    marginTop: 'auto',
    marginBottom: 10,
  },
  detailTitle: {
    color: colors.textDim,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  detailGame: {
    color: colors.text,
    fontSize: 15,
    fontFamily: fonts.medium,
  },
  detailEmpty: {
    color: colors.textDim,
    fontStyle: 'italic',
  },
})
