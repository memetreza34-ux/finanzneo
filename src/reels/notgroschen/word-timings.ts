export type TimedSentence = {id: string; text: string; frames: readonly number[]};

// Vorläufige Timings für die 60-Sekunden-Komposition.
// Nach Ablage des finalen Voiceovers müssen alle Grenzen akustisch geprüft werden.
export const NOTGROSCHEN_WORD_TIMINGS: readonly TimedSentence[] = [
  {id:'sentence-01',text:'Eine kaputte Waschmaschine wird richtig teuer, wenn du dafür Dispo, Ratenzahlung oder Kredit brauchst.',frames:[8,20,32,44,56,68,80,92,103,115,127,139,151,163,175]},
  {id:'sentence-02',text:'Genau dafür ist ein Notgroschen da: schnell verfügbares Geld für ungeplante Ausgaben.',frames:[185,197,208,220,232,243,255,267,278,290,302,313,325]},
  {id:'sentence-03',text:'Als Daumenregel nennt die Verbraucherzentrale zwei bis drei Monatsgehälter.',frames:[338,348,357,367,377,386,396,406,415,425]},
  {id:'sentence-04',text:'Die passende Höhe hängt aber von deiner persönlichen Situation ab.',frames:[435,446,458,469,480,492,503,514,525,537,548]},
  {id:'sentence-05',text:'Starte deshalb nicht sofort mit dem großen Ziel.',frames:[563,571,578,586,594,602,610,617,625]},
  {id:'sentence-06',text:'Baue zuerst einen Mini-Puffer von 500 Euro auf.',frames:[633,647,661,675,688,702,716,730,744]},
  {id:'sentence-07',text:'Danach sicherst du einen Monat deiner notwendigen Ausgaben.',frames:[758,768,777,787,796,806,816,825,835]},
  {id:'sentence-08',text:'Erst dann wächst der Puffer bis zu deinem persönlichen Ziel.',frames:[843,854,865,876,887,898,910,921,932,943,954]},
  {id:'sentence-09',text:'Ein echter Notfall ist notwendig, ungeplant und nicht aus deinem Monatsbudget bezahlbar.',frames:[968,979,990,1002,1013,1024,1036,1047,1058,1069,1080,1092,1103]},
  {id:'sentence-10',text:'Bei 1.800 Euro netto wären zwei bis drei Monatsgehälter 3.600 bis 5.400 Euro.',frames:[1118,1130,1141,1153,1164,1176,1187,1199,1210,1222,1233,1245,1256,1268]},
  {id:'sentence-11',text:'Mit 150 Euro monatlich hast du den 500-Euro-Puffer im vierten Monat und 3.600 Euro nach 24 Monaten.',frames:[1283,1295,1307,1319,1331,1343,1356,1368,1380,1392,1404,1416,1428,1440,1452,1464,1476,1484]},
  {id:'sentence-12',text:'Parke das Geld getrennt auf einem Tagesgeldkonto, damit es verfügbar bleibt.',frames:[1508,1519,1530,1541,1552,1563,1573,1584,1595,1606,1617,1628]},
  {id:'sentence-13',text:'Nutze den Notgroschen nur für echte Notfälle und fülle ihn danach wieder auf.',frames:[1643,1655,1667,1678,1690,1702,1714,1725,1737,1749,1761,1772,1784,1796]},
] as const;
