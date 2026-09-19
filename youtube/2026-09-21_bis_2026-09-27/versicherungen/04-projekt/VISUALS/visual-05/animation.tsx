import React from 'react';
import {Interactive, useCurrentFrame} from 'remotion';
import {
  CameraPush,
  ContactShadow,
  CameraBlur,
  ObjectBikeWheel,
  ObjectCrate,
  ObjectGlasses,
  ObjectSuitcase,
  ObjectTable,
  PhysicalPhone,
  PhysicalTag,
  YouTubePhysicalStage,
  dropIn,
  ease,
} from '../../motion-kit';

export const MECHANIC_ID = 'endless-item-pile';
export const VISUAL_TECHNIQUE_ID = 'items-drop-until-frame-overflows';
export const COMPOSITION_FAMILY_ID = 'physical-accumulation';
export const RESULT_HOLD_FRAMES = 40;

export const ANIMATION_NARRATIVE = {
  START: 'Ein leerer Tisch, auf dem noch nichts liegt',
  MECHANISM: 'Ein Gegenstand nach dem anderen fällt herein, der Stapel wächst und der Tisch gibt darunter nach',
  RESULT: 'Der Stapel läuft oben aus dem Bild — die Liste hört nie auf',
};

export const PREMIUM_VISUAL_NARRATIVE = {
  HERO: 'Der wachsende Stapel aus erkennbaren Alltagsgegenständen',
  SUPPORT: 'Der Tisch, der unter der Last sichtbar durchhängt',
  MATERIAL: 'Glas, Metall, Hartschale, Gummi — lauter ersetzbare Dinge',
  DEPTH: 'Tisch in Aufsicht, Stapel baut sich nach oben aus dem Frame heraus',
};

/**
 * Die Gegenstände sind gezeichnet, nicht beschriftet.
 *
 * Die vorige Fassung stapelte abgerundete Rechtecke mit den Aufschriften
 * `Handy`, `Brille`, `Koffer`, `Fahrrad`. Genau das schliesst CLAUDE.md §11 als
 * Hauptsprache aus: wer den Text nicht liest, sieht nur Kaesten.
 *
 * Objekte, Fallbewegung, Kontaktschatten, Kamerafahrt und Bewegungsunschaerfe
 * kommen aus dem Baukasten. Diese Datei beschreibt nur noch, WAS faellt und
 * WANN — nicht mehr, wie Fallen aussieht.
 */

/**
 * Die Gegenstaende, von unten nach oben in der Reihenfolge, in der sie fallen.
 *
 * `w`/`h` sind die sichtbaren Masse, `ox`/`oy` der Abstand zwischen der Ecke des
 * Containers und der sichtbaren Ecke. Bei `PhysicalPhone` ist der nicht null,
 * weil `scale` um die Boxmitte wirkt.
 */
const SURFACE_Y = 895;
const CENTRE_X = 960;

const STACK = [
  {key: 'phone', w: 63, h: 122, ox: 44, oy: 84, start: 8, tilt: -9, nudge: -34},
  {key: 'glasses', w: 200, h: 72, ox: 0, oy: 0, start: 34, tilt: 6, nudge: 26},
  {key: 'suitcase', w: 250, h: 160, ox: 0, oy: 0, start: 60, tilt: -4, nudge: -22},
  {key: 'wheel', w: 170, h: 170, ox: 0, oy: 0, start: 88, tilt: 8, nudge: 30},
  {key: 'extra-1', w: 174, h: 90, ox: 6, oy: 8, start: 118, tilt: -9, nudge: -38},
  {key: 'extra-2', w: 174, h: 90, ox: 6, oy: 8, start: 142, tilt: 7, nudge: 34},
  {key: 'extra-3', w: 174, h: 90, ox: 6, oy: 8, start: 162, tilt: -8, nudge: -28},
] as const;

/**
 * Jeder Gegenstand liegt auf dem vorigen. Die letzten liegen dadurch ueber der
 * Zonenkante bei y 180, werden vom Frame abgeschnitten — und genau dieses
 * Abschneiden ist die Aussage der Szene.
 */
let stackTop = SURFACE_Y;
const ITEMS = STACK.map((item) => {
  const rest = stackTop - item.h - item.oy;
  stackTop -= item.h;
  return {...item, rest, x: CENTRE_X - item.w / 2 - item.ox + item.nudge};
});

const LAST_START = ITEMS[ITEMS.length - 1].start;

const Body: React.FC<{itemKey: string}> = ({itemKey}) => {
  if (itemKey === 'phone') return <PhysicalPhone x={0} y={0} scale={0.42} />;
  if (itemKey === 'glasses') return <ObjectGlasses width={200} />;
  if (itemKey === 'suitcase') return <ObjectSuitcase width={250} />;
  if (itemKey === 'wheel') return <ObjectBikeWheel width={170} />;
  return <ObjectCrate width={186} />;
};

export const YouTubeVisual05Animation: React.FC = () => {
  const frame = useCurrentFrame();

  // Der Tisch gibt nach, je mehr auf ihm liegt — ein eigener Kanal, der ueber
  // die ganze Szene laeuft und nicht an einem einzelnen Fall haengt.
  const sag = ease(frame, ITEMS[0].start, LAST_START + 20) * 13;

  // Jeder Aufprall staucht den Stapel kurz; er federt zurueck.
  const shake = ITEMS.reduce((sum, item) => sum + dropIn(frame, {start: item.start}).impact, 0);

  return (
    <YouTubePhysicalStage>
      <CameraPush from={1} to={1.055} start={10} end={200}>
        <Interactive.Div name="Tisch" style={{position: 'absolute', left: 470, top: 860, translate: `0px ${sag * 0.4}px`}}>
          <ObjectTable sag={sag} />
        </Interactive.Div>

        <CameraBlur>
          {ITEMS.map((item) => {
            const drop = dropIn(frame, {start: item.start, tilt: item.tilt});
            const isExtra = item.key.startsWith('extra');

            return (
              <div key={item.key}>
                <ContactShadow
                  x={item.x + item.ox}
                  y={item.rest + item.oy + item.h}
                  width={item.w}
                  contact={drop.contact}
                  opacity={drop.contact}
                />
                <Interactive.Div
                  name={item.key}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    transformOrigin: `${item.ox + item.w / 2}px ${item.oy + item.h}px`,
                    translate: `${item.x + drop.swingX}px ${item.rest + drop.offsetY + shake * 7}px`,
                    rotate: `${drop.rotate}deg`,
                    scale: `${drop.scaleX} ${drop.scaleY}`,
                    opacity: drop.progress * (isExtra ? 0.62 : 1),
                  }}
                >
                  <Body itemKey={item.key} />
                </Interactive.Div>
              </div>
            );
          })}
        </CameraBlur>

        <Interactive.Div name="Schild" style={{position: 'absolute', left: 1230, top: 690, opacity: ease(frame, 168, 192)}}>
          <PhysicalTag material="warning">und so weiter</PhysicalTag>
        </Interactive.Div>
      </CameraPush>
    </YouTubePhysicalStage>
  );
};
