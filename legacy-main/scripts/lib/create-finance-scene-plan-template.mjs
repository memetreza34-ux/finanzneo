const singlePhase = (action) => [{at: 0, action}];

const todoImagePrompt = ({topic, sceneId, composition}) =>
  `FINANCE_TODO_IMAGE_BRIEF: Write the final English image prompt for scene "${sceneId}" about "${topic}". Composition: ${composition}. Style anchor follows once the new Bildstil is defined.`;

const imageScene = ({id, durationSec, topic, variant = 'default', purpose, headline, icon, composition, content = {}}) => ({
  id,
  durationSec,
  voiceText: `FINANCE_TODO_SCRIPT: Konkreten Satz für ${id} zu „${topic}“ schreiben.`,
  imagePrompt: todoImagePrompt({topic, sceneId: id, composition}),
  layout: 'full-bleed',
  variant,
  purpose,
  visualAction: 'Ein starkes Bild zeigt die vollständige Aussage; Remotion ergänzt nur Überschrift, Icon, Untertitel, sanften Zoom und minimale Bildfahrt.',
  visualPhases: singlePhase('Hauptbild ab Frame 0 zeigen'),
  semanticChanges: ['vollständige Bildaussage ab Frame 0'],
  assetIds: [`images-${id === 'hook' ? '01' : id === 'relevanz' ? '02' : id === 'zahl' ? '03' : id === 'mechanismus' ? '04' : id === 'beispiel' ? '05' : id === 'vergleich' ? '06' : id === 'entwicklung' ? '07' : '08'}-${id}`],
  content: {icon, kicker: 'FINANCE_TODO_CONTENT', headline, ...content},
  transition: 'cut',
  ...(id === 'hook' ? {frameZeroMainMotif: true} : {}),
  decorativeOnly: false,
});

export const createFinanceScenePlanTemplate = ({slug = 'thema-slug', title = 'FinanzNeo-Reel', topic = 'Finanzthema'} = {}) => {
  const scenes = [
    imageScene({id: 'hook', durationSec: 5, topic, purpose: 'the financial problem becoming personally relevant', headline: 'FINANCE_TODO_CONTENT', icon: 'wallet', composition: 'place the real-world anchor in the center foreground, the cause on the left and the consequence on the right within the same environment'}),
    imageScene({id: 'relevanz', durationSec: 6, topic, purpose: 'the concrete financial consequence for the viewer', headline: 'FINANCE_TODO_CONTENT', icon: 'target', composition: 'use a different everyday environment, place the viewer-related object in the foreground and the financial consequence clearly behind or beside it'}),
    imageScene({id: 'zahl', durationSec: 6, topic, purpose: 'the most important number represented through concrete objects', headline: 'FINANCE_TODO_CONTENT', icon: 'euro', composition: 'show a countable physical comparison with the starting amount on the left and the removed or remaining amount on the right inside one coherent setting', content: {primaryNumber: 'FINANCE_TODO_CONTENT', secondaryNumber: 'FINANCE_TODO_CONTENT'}}),
    imageScene({id: 'mechanismus', durationSec: 8, topic, variant: 'three-stage', purpose: 'the mechanism connecting cause and financial result', headline: 'FINANCE_TODO_CONTENT', icon: 'coins', composition: 'connect three concrete objects from the left foreground through the center to the visible result on the right background'}),
    imageScene({id: 'beispiel', durationSec: 7, topic, purpose: 'a concrete real-world example', headline: 'FINANCE_TODO_CONTENT', icon: 'cart', composition: 'use a recognizable everyday location and object as the central anchor, with the action close by and the outcome clearly visible'}),
    imageScene({id: 'vergleich', durationSec: 7, topic, variant: 'before-after', purpose: 'a fair comparison between two outcomes', headline: 'FINANCE_TODO_CONTENT', icon: 'scale', composition: 'show the same starting condition in the center and two outcomes on the left and right within one coherent environment, never as separate cards'}),
    imageScene({id: 'entwicklung', durationSec: 8, topic, variant: 'timeline-world', purpose: 'a visible change over time', headline: 'FINANCE_TODO_CONTENT', icon: 'clock', composition: 'arrange three recognizable time markers from the foreground to the background within the same real-world setting'}),
    imageScene({id: 'rechnung', durationSec: 8, topic, variant: 'calculation-scene', purpose: 'a calculation explained through concrete real-world objects', headline: 'FINANCE_TODO_CONTENT', icon: 'calculator', composition: 'place the real starting object on the left, calculation evidence in the center and the practical result on the right without using a generic money pile'}),
    {
      id: 'payoff', durationSec: 6.5,
      voiceText: 'FINANCE_TODO_SCRIPT: Direkte Antwort auf die Hook ohne neue Behauptung.',
      layout: 'text-punch', variant: 'payoff', purpose: 'Die zentrale Frage beantworten.',
      visualAction: 'Das letzte Bild läuft mit sanftem Zoom weiter; die kurze Kernaussage und das Icon liegen darüber.',
      visualPhases: singlePhase('Vorheriges Bild weiterverwenden'),
      semanticChanges: ['Kernaussage auf bestehendem Bild'], assetIds: [],
      content: {icon: 'idea', kicker: 'FINANCE_TODO_CONTENT', headline: 'FINANCE_TODO_CONTENT', body: 'FINANCE_TODO_CONTENT'},
      transition: 'cut', decorativeOnly: false,
    },
  ];

  return {
    version: 'finance-v1',
    slug,
    title,
    fps: 30,
    centralQuestion: `FINANCE_TODO_SCRIPT: Eine konkrete Zuschauerfrage zu „${topic}“ formulieren.`,
    payoff: 'FINANCE_TODO_SCRIPT: Die zentrale Frage sachlich und praktisch beantworten.',
    sources: [],
    scriptText: scenes.map((scene) => scene.voiceText).join(' '),
    voiceoverInstruction: 'Sprich auf Deutsch, klar, seriös und direkt. Keine Begrüßung, kein Musikbett und keine künstliche Dramatik. Hook, Zahlen, Wendepunkt und Payoff deutlich betonen. Kurze natürliche Pausen.',
    voiceoverAssetId: 'audio-voiceover-final',
    captionsAssetId: 'captions-voiceover-final-captions',
    scenes,
  };
};
